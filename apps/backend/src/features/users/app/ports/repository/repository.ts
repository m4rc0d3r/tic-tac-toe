import type { either as e } from "fp-ts";

import type { FindOneByIn, FindOneByOut, ListOut } from "../../service";

import type { CreateIn, CreateOut } from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { UserFieldsInUniqueConstraints } from "~/core";

abstract class UsersRepository {
  abstract create(
    params: CreateIn,
  ): Promise<e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints>, CreateOut>>;
  abstract findOneBy(params: FindOneByIn): Promise<e.Either<NotFoundError, FindOneByOut>>;
  abstract list(): Promise<ListOut>;
}

export { UsersRepository };
