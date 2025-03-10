import type { PrismaClient } from "@prisma/client";
import type { ExcludeUndefinedFromOptionalKeys } from "@tic-tac-toe/core";
import { either as e, taskEither as te } from "fp-ts";

import type {
  CreateIn,
  CreateOut,
  FindOneByIn,
  FindOneByOut,
  ListOut,
  UpdateIn,
  UpdateOut,
} from "../app/ports/repository";
import { UsersRepository } from "../app/ports/repository";

import { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { UserFieldsInUniqueConstraints } from "~/core";
import { isConstrainedFields, userFieldsInUniqueConstraints } from "~/core";
import { isNotFoundError, isUniqueKeyViolation } from "~/infra";

class PrismaUsersRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  override async create(
    params: CreateIn,
  ): Promise<e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints>, CreateOut>> {
    return te.tryCatch(
      () =>
        this.prisma.user.create({
          data: params,
        }),
      (reason) => {
        if (isUniqueKeyViolation(reason)) {
          const target = reason.meta.target;
          if (isConstrainedFields(target, userFieldsInUniqueConstraints)) {
            return new UniqueKeyViolationError(target);
          }
        }
        throw reason;
      },
    )();
  }

  override async update({
    id,
    ...rest
  }: UpdateIn): Promise<
    e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints> | NotFoundError, UpdateOut>
  > {
    return te.tryCatch(
      () =>
        this.prisma.user.update({
          where: {
            id,
          },
          data: rest as ExcludeUndefinedFromOptionalKeys<typeof rest>,
        }),
      (reason) => {
        if (isUniqueKeyViolation(reason)) {
          const target = reason.meta.target;
          if (isConstrainedFields(target, userFieldsInUniqueConstraints)) {
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

  override async findOneBy(params: FindOneByIn): Promise<e.Either<NotFoundError, FindOneByOut>> {
    return e.fromNullable(new NotFoundError(params))(
      await this.prisma.user.findFirst({
        where: params,
      }),
    );
  }

  override async list(): Promise<ListOut> {
    return this.prisma.user.findMany();
  }
}

export { PrismaUsersRepository };
