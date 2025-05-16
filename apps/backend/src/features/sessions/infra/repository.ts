import type { PrismaClient, Session as SessionModel } from "@prisma/client";
import { getUnexpiredUserSessions } from "@prisma/client/sql";
import type { ExcludeUndefinedFromOptionalKeys } from "@tic-tac-toe/core";
import {
  createPageMeta,
  EMPTY_STRING,
  getTheNumberOfSkippedItems,
  mapParsedUserAgent,
} from "@tic-tac-toe/core";
import { camelCase } from "change-case-all";
import { either as e, function as f, taskEither as te } from "fp-ts";

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
import { isNotFoundError, isUniqueKeyViolation } from "~/infra";

class PrismaSessionsRepository extends SessionsRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  override async createOne({
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

  override async deleteOne(params: DeleteOneIn): Promise<e.Either<NotFoundError, DeleteOneOut>> {
    const { id, userId } = params;
    return te.tryCatch(
      async () =>
        mapModelToEntity(
          await this.prisma.session.delete({
            where: {
              id,
              ...(userId && { userId }),
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

  override async delete({ userId, exceptForSessionId }: DeleteIn): Promise<DeleteOut> {
    return (
      await this.prisma.session.deleteMany({
        where: {
          userId,
          NOT: {
            id: exceptForSessionId,
          },
        },
      })
    ).count;
  }
}

function mapModelToEntity(value: SessionModel): FindOneOut {
  const {
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
