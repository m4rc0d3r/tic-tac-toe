import type { either as e } from "fp-ts";

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
} from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { SessionFieldsInUniqueConstraints } from "~/core";

abstract class SessionsRepository {
  abstract createOne(
    params: CreateOneIn,
  ): Promise<e.Either<UniqueKeyViolationError<SessionFieldsInUniqueConstraints>, CreateOneOut>>;
  abstract updateOne(
    params: UpdateOneIn,
  ): Promise<
    e.Either<
      UniqueKeyViolationError<SessionFieldsInUniqueConstraints> | NotFoundError,
      UpdateOneOut
    >
  >;
  abstract findOne(params: FindOneIn): Promise<e.Either<NotFoundError, FindOneOut>>;
  abstract list(params: ListIn): Promise<ListOut>;
  abstract deleteOne(params: DeleteOneIn): Promise<e.Either<NotFoundError, DeleteOneOut>>;
  abstract delete(params: DeleteIn): Promise<DeleteOut>;
}

export { SessionsRepository };
