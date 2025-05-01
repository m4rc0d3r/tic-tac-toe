import type { PrismaClient } from "@prisma/client";
import type { ExcludeUndefinedFromOptionalKeys } from "@tic-tac-toe/core";
import { createPageMeta, getTheNumberOfSkippedItems } from "@tic-tac-toe/core";
import { either as e, taskEither as te } from "fp-ts";

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

  override async createOne(
    params: CreateOneIn,
  ): Promise<e.Either<UniqueKeyViolationError<SessionFieldsInUniqueConstraints>, CreateOneOut>> {
    return te.tryCatch(
      () =>
        this.prisma.session.create({
          data: params,
        }),
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
      () =>
        this.prisma.session.update({
          where: {
            id,
          },
          data: rest as ExcludeUndefinedFromOptionalKeys<typeof rest>,
        }),
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

  override async findOne(params: FindOneIn): Promise<e.Either<NotFoundError, FindOneOut>> {
    return e.fromNullable(new NotFoundError(params))(
      await this.prisma.session.findFirst({
        where: params,
      }),
    );
  }

  override async list({ filter, pageOptions }: ListIn): Promise<ListOut> {
    const args = {
      where: filter,
    };
    const numberOfSessions = await this.prisma.session.count(args);
    const sessions = await this.prisma.session.findMany({
      ...args,
      skip: getTheNumberOfSkippedItems(pageOptions),
      take: pageOptions.take,
    });
    return {
      data: sessions,
      meta: createPageMeta(pageOptions, numberOfSessions),
    };
  }

  override async deleteOne(params: DeleteOneIn): Promise<e.Either<NotFoundError, DeleteOneOut>> {
    return e.fromNullable(new NotFoundError(params))(
      await this.prisma.session.delete({
        where: params,
      }),
    );
  }

  override async delete(params: DeleteIn): Promise<DeleteOut> {
    return (
      await this.prisma.session.deleteMany({
        where: params,
      })
    ).count;
  }
}

export { PrismaSessionsRepository };
