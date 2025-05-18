import type { PrismaClient, Session as SessionModel } from "@prisma/client";
import { getUnexpiredUserSessions } from "@prisma/client/sql";
import type { ExcludeUndefinedFromOptionalKeys } from "@tic-tac-toe/core";
import {
  createPageMeta,
  EMPTY_STRING,
  getTheNumberOfSkippedItems,
  mapParsedUserAgent,
  MILLISECONDS_PER_SECOND,
} from "@tic-tac-toe/core";
import type { AwilixContainer } from "awilix";
import { camelCase } from "change-case-all";
import type { FastifyBaseLogger } from "fastify";
import { either as e, function as f, taskEither as te } from "fp-ts";
import type { ToadScheduler } from "toad-scheduler";
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";

import { SessionsRepository } from "../app/ports";
import type {
  CreateOneIn,
  CreateOneOut,
  DeleteIn,
  DeleteOneIn,
  DeleteOneOut,
  DeleteOut,
  FindOneIn,
  FindOneOut,
  ListIn,
  ListOut,
  UpdateLastAccessDateIn,
  UpdateLastAccessDateOut,
  UpdateOneIn,
  UpdateOneOut,
} from "../app/ports/repository";

import { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { SessionFieldsInUniqueConstraints } from "~/core";
import { isConstrainedFields, sessionFieldsInUniqueConstraints } from "~/core";
import type { AsyncDispose, AsyncInit, Config } from "~/infra";
import { isNotFoundError, isUniqueKeyViolation } from "~/infra";

class PrismaSessionsRepository extends SessionsRepository implements AsyncInit, AsyncDispose {
  private jobToRemoveExpiredSessions: SimpleIntervalJob | null = null;

  constructor(
    private readonly config: Config,
    private readonly logger: FastifyBaseLogger,
    private readonly scheduler: ToadScheduler,
    private readonly prisma: PrismaClient,
  ) {
    super();
  }

  asyncInit(_diContainer: AwilixContainer): Promise<unknown> {
    this.jobToRemoveExpiredSessions = new SimpleIntervalJob(
      {
        milliseconds: this.config.session.howOftenToDeleteExpired,
      },
      new AsyncTask(
        "delete expired sessions",
        async () => {
          const numberOfDeleted = await this.prisma.$executeRaw`
            DELETE FROM sessions
            WHERE
              created_at + cast(maximum_age || ' second' AS INTERVAL) < current_timestamp at TIME ZONE 'UTC'
          `;
          this.logger.info(
            `${numberOfDeleted} expired sessions have been removed from the database`,
          );
        },
        (err) => {
          this.logger.error(
            {
              err,
            },
            "Something went wrong while trying to delete expired sessions",
          );
        },
      ),
    );

    this.scheduler.addSimpleIntervalJob(this.jobToRemoveExpiredSessions);
    return Promise.resolve();
  }

  asyncDispose() {
    this.jobToRemoveExpiredSessions?.stop();
    return Promise.resolve();
  }

  override async createOne({
    maximumAge,
    geolocation,
    device,
    os,
    browser,
    ...params
  }: CreateOneIn): Promise<
    e.Either<UniqueKeyViolationError<SessionFieldsInUniqueConstraints>, CreateOneOut>
  > {
    return te.tryCatch(
      async () => {
        return mapModelToEntity(
          await this.prisma.session.create({
            data: {
              maximumAge: maximumAge / MILLISECONDS_PER_SECOND,
              ...(geolocation && {
                latitude: geolocation.coordinates.latitude,
                longitude: geolocation.coordinates.longitude,
                countryCode: geolocation.country.code,
                countryName: geolocation.country.name,
                city: geolocation.city,
              }),
              ...mapParsedUserAgent({
                device: device ?? {
                  type: EMPTY_STRING,
                  vendor: EMPTY_STRING,
                  model: EMPTY_STRING,
                },
                os: os ?? {
                  name: EMPTY_STRING,
                  version: EMPTY_STRING,
                },
                browser: browser ?? {
                  name: EMPTY_STRING,
                  version: EMPTY_STRING,
                },
              }),
              ...params,
            },
          }),
        );
      },
      (reason) => {
        if (isUniqueKeyViolation(reason)) {
          const target = reason.meta.target;
          if (isConstrainedFields(target, sessionFieldsInUniqueConstraints)) {
            return new UniqueKeyViolationError(target);
          }
        }
        throw reason;
      },
    )();
  }

  override async updateOne({
    id,
    ...rest
  }: UpdateOneIn): Promise<
    e.Either<
      UniqueKeyViolationError<SessionFieldsInUniqueConstraints> | NotFoundError,
      UpdateOneOut
    >
  > {
    return te.tryCatch(
      async () =>
        mapModelToEntity(
          await this.prisma.session.update({
            where: {
              id,
            },
            data: rest as ExcludeUndefinedFromOptionalKeys<typeof rest>,
          }),
        ),
      (reason) => {
        if (isUniqueKeyViolation(reason)) {
          const target = reason.meta.target;
          if (isConstrainedFields(target, sessionFieldsInUniqueConstraints)) {
            return new UniqueKeyViolationError(target);
          }
        } else if (isNotFoundError(reason)) {
          return new NotFoundError({
            id,
          });
        }
        throw reason;
      },
    )();
  }

  override async updateLastAccessDate({
    id,
  }: UpdateLastAccessDateIn): Promise<e.Either<NotFoundError, UpdateLastAccessDateOut>> {
    return te.tryCatch(
      async () =>
        mapModelToEntity(
          await this.prisma.session.update({
            where: {
              id,
            },
            data: {
              lastAccessedAt: new Date(),
            },
          }),
        ),
      (reason) => {
        if (isNotFoundError(reason)) {
          return new NotFoundError({
            id,
          });
        }
        throw reason;
      },
    )();
  }

  override async findOne(params: FindOneIn): Promise<e.Either<NotFoundError, FindOneOut>> {
    return f.pipe(
      e.fromNullable(new NotFoundError(params))(
        await this.prisma.session.findFirst({
          where: params,
        }),
      ),
      e.map(mapModelToEntity),
    );
  }

  override async list({ filter, pageOptions }: ListIn): Promise<ListOut> {
    const numberOfSessions = await this.prisma.session.count({
      where: filter,
    });
    const sessions = await this.prisma.$queryRawTyped(
      getUnexpiredUserSessions(
        filter.userId,
        pageOptions.take,
        getTheNumberOfSkippedItems(pageOptions),
      ),
    );
    return {
      data: sessions.map((session) =>
        f.pipe(
          session,
          (session) =>
            Object.fromEntries(
              Object.entries(session).map(([key, value]) => [camelCase(key), value]),
            ) as SessionModel,
          mapModelToEntity,
        ),
      ),
      meta: createPageMeta(pageOptions, numberOfSessions),
    };
  }

  override async deleteOne({
    id,
    userId,
  }: DeleteOneIn): Promise<e.Either<NotFoundError, DeleteOneOut>> {
    return this.prisma.$transaction(async (tx) => {
      const getNumberOfUnexpiredUserSessions = async (userId: number) =>
        Number(
          (
            await tx.$queryRaw<[{ count: bigint }]>`
              SELECT
                count(*)
              FROM
                sessions
              WHERE
                user_id = ${userId}
                AND created_at + cast(maximum_age || ' second' AS INTERVAL) >= current_timestamp at TIME ZONE 'UTC'
            `
          )[0].count,
        );
      const numberOfUserSessions = await (typeof userId === "number"
        ? getNumberOfUnexpiredUserSessions(userId)
        : f.pipe(
            await tx.session.findFirst({
              where: {
                id,
              },
            }),
            te.fromNullable(0),
            te.map(({ userId }) => getNumberOfUnexpiredUserSessions(userId)),
            te.toUnion,
          )());
      console.log({ numberOfUserSessions });
      const where = {
        id,
        ...(userId && { userId }),
      };
      if (numberOfUserSessions === 0) {
        return e.left(new NotFoundError(where));
      } else {
        return f.pipe(
          te.tryCatch(
            () =>
              numberOfUserSessions === 1
                ? tx.session.update({
                    where,
                    data: {
                      maximumAge: 0,
                    },
                  })
                : this.prisma.session.delete({
                    where,
                  }),

            (reason) => {
              if (isNotFoundError(reason)) {
                return new NotFoundError(where);
              }
              throw reason;
            },
          ),
          te.map(mapModelToEntity),
        )();
      }
    });
  }

  override async delete({ userId, exceptForSessionId }: DeleteIn): Promise<DeleteOut> {
    return this.prisma.$transaction((tx) => {
      return f.pipe(
        te.fromNullable(0)(
          tx.session.findFirst({
            where: {
              id: exceptForSessionId,
            },
          }),
        ),
        te.map(
          async () =>
            (
              await tx.session.deleteMany({
                where: {
                  userId,
                  NOT: {
                    id: exceptForSessionId,
                  },
                },
              })
            ).count,
        ),
        te.toUnion,
      )();
    });
  }
}

function mapModelToEntity(value: SessionModel): FindOneOut {
  const {
    maximumAge,
    latitude,
    longitude,
    countryCode,
    countryName,
    city,
    deviceType,
    deviceVendor,
    deviceModel,
    osName,
    osVersion,
    browserName,
    browserVersion,
    ...sessionModel
  } = value;

  return {
    ...sessionModel,
    maximumAge: maximumAge * MILLISECONDS_PER_SECOND,
    geolocation:
      typeof latitude === "number" && typeof longitude === "number"
        ? {
            coordinates: {
              latitude,
              longitude,
            },
            country: {
              code: countryCode,
              name: countryName,
            },
            city,
          }
        : null,
    ...mapParsedUserAgent({
      deviceType,
      deviceVendor,
      deviceModel,
      osName,
      osVersion,
      browserName,
      browserVersion,
    }),
  };
}

export { PrismaSessionsRepository };
