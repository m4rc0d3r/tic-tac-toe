import type { either as e } from "fp-ts";

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
} from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { UserFieldsInUniqueConstraints } from "~/core";

abstract class UsersRepository {
  abstract create(
    params: CreateIn,
  ): Promise<e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints>, CreateOut>>;
  abstract update(
    params: UpdateIn,
  ): Promise<
    e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints> | NotFoundError, UpdateOut>
  >;
  abstract findOneBy(params: FindOneByIn): Promise<e.Either<NotFoundError, FindOneByOut>>;
  abstract findOneWithLastOnlineDate(
    params: FindOneWithLastOnlineDateIn,
  ): Promise<e.Either<NotFoundError, FindOneWithLastOnlineDateOut>>;
  abstract list(): Promise<ListOut>;
}

export { UsersRepository };
