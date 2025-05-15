import type { PrismaClient, User as UserModel } from "@prisma/client";
import { getUserWithLastOnlineDate } from "@prisma/client/sql";
import type { ExcludeUndefinedFromOptionalKeys } from "@tic-tac-toe/core";
import { camelCase } from "change-case-all";
import { either as e, function as f, taskEither as te } from "fp-ts";

import type {
  CreateIn,
  CreateOut,
  FindOneByIn,
  FindOneByOut,
  FindOneWithLastOnlineDateIn,
  FindOneWithLastOnlineDateOut,
  ListOut,
  UpdateIn,
  UpdateOut,
} from "../app/ports/repository";
import { UsersRepository } from "../app/ports/repository";

import { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { FullyRegisteredUser, UserFieldsInUniqueConstraints } from "~/core";
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
      async () =>
        mapModelToEntity(
          await this.prisma.user.create({
            data: params,
          }),
        ),
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
      async () =>
        mapModelToEntity(
          await this.prisma.user.update({
            where: {
              id,
            },
            data: rest as ExcludeUndefinedFromOptionalKeys<typeof rest>,
          }),
        ),
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
    return f.pipe(
      e.fromNullable(new NotFoundError(params))(
        await this.prisma.user.findFirst({
          where: params,
        }),
      ),
      e.map(mapModelToEntity),
    );
  }

  override async findOneWithLastOnlineDate(
    params: FindOneWithLastOnlineDateIn,
  ): Promise<e.Either<NotFoundError, FindOneWithLastOnlineDateOut>> {
    return f.pipe(
      (await this.prisma.$queryRawTyped(getUserWithLastOnlineDate(params.id)))[0],
      e.fromNullable(new NotFoundError(params)),
      e.map(mapModelWithLastOnlineDateToEntity),
    );
  }

  override async list(): Promise<ListOut> {
    return (await this.prisma.user.findMany()).map(mapModelToEntity);
  }
}

type FULLY_REGISTERED_USER_FIELDS = Extract<keyof FullyRegisteredUser, "email" | "passwordHash">;

function isFullyRegisteredUser(
  userModel: UserModel,
): userModel is Omit<UserModel, FULLY_REGISTERED_USER_FIELDS> &
  Pick<FullyRegisteredUser, FULLY_REGISTERED_USER_FIELDS> {
  const { email, passwordHash } = userModel;
  return [email, passwordHash].every((value) => value !== null);
}

function mapModelToEntity(userModel: UserModel): CreateOut {
  const { email, passwordHash, ...sharedUserModel } = userModel;

  return isFullyRegisteredUser(userModel)
    ? ({ registrationStatus: "FULL", ...userModel } as const)
    : ({ registrationStatus: "PARTIAL", ...sharedUserModel } as const);
}

function mapModelWithLastOnlineDateToEntity(
  userModel: getUserWithLastOnlineDate.Result,
): FindOneWithLastOnlineDateOut {
  return f.pipe(
    userModel,
    (userModel) =>
      Object.fromEntries(
        Object.entries(userModel).map(([key, value]) => [camelCase(key), value]),
      ) as UserModel & Pick<FindOneWithLastOnlineDateOut, "lastOnlineAt">,
    ({ lastOnlineAt, ...userModel }) => ({ ...mapModelToEntity(userModel), lastOnlineAt }),
  );
}

export { PrismaUsersRepository };
