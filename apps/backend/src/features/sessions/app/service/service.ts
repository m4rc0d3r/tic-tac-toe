import { getNumberOfBytesToStoreBase64 } from "@tic-tac-toe/core";
import { either as e } from "fp-ts";
import uid from "uid-safe";

import type { SessionsRepository } from "../ports";
import type {
  CreateOneOut,
  DeleteIn,
  DeleteOneOut,
  DeleteOut,
  FindOneIn,
  FindOneOut,
  ListIn,
  ListOut,
  UpdateOneIn,
  UpdateOneOut,
} from "../ports/repository";

import { SessionDeletionError } from "./errors";
import type { CreateOneIn, DeleteOneIn } from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { RawSession, SessionFieldsInUniqueConstraints } from "~/core";
import { SESSION_ID_LENGTH } from "~/core";
import type { Config } from "~/infra";

class SessionsService {
  constructor(
    private readonly config: Config,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async createOne(
    params: CreateOneIn,
  ): Promise<e.Either<UniqueKeyViolationError<SessionFieldsInUniqueConstraints>, CreateOneOut>> {
    return this.sessionsRepository.createOne({
      ...params,
      id: await uid(getNumberOfBytesToStoreBase64(SESSION_ID_LENGTH)),
      maximumAge: this.config.session.maximumAge,
    });
  }

  updateOne(
    params: UpdateOneIn,
  ): Promise<
    e.Either<
      UniqueKeyViolationError<SessionFieldsInUniqueConstraints> | NotFoundError,
      UpdateOneOut
    >
  > {
    return this.sessionsRepository.updateOne(params);
  }

  findOne(params: FindOneIn): Promise<e.Either<NotFoundError, FindOneOut>> {
    return this.sessionsRepository.findOne(params);
  }

  list(params: ListIn): Promise<ListOut> {
    return this.sessionsRepository.list(params);
  }

  async deleteOne({
    id,
    initiatingSessionId,
  }: DeleteOneIn): Promise<e.Either<NotFoundError | SessionDeletionError, DeleteOneOut>> {
    const check = await this.canDeleteOthers(initiatingSessionId);
    if (check !== null) {
      return check;
    }

    return this.sessionsRepository.deleteOne({
      id,
    });
  }

  delete(params: DeleteIn): Promise<DeleteOut> {
    return this.sessionsRepository.delete(params);
  }

  private async canDeleteOthers(initiatingSessionId: RawSession["id"]) {
    const eitherInitiatingSession = await this.sessionsRepository.findOne({
      id: initiatingSessionId,
    });
    if (eitherInitiatingSession._tag === "Left") {
      return e.left(new SessionDeletionError("INITIATING_SESSION_DOES_NOT_EXIST"));
    }
    const initiatingSession = eitherInitiatingSession.right;

    if (
      Date.now() - initiatingSession.createdAt.getTime() <
      this.config.session.minimumAgeForDestructionOfOthers
    ) {
      return e.left(new SessionDeletionError("INITIATING_SESSION_IS_TOO_YOUNG"));
    }

    return null;
  }
}

export { SessionsService };
