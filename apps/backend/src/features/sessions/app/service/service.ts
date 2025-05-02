import { getNumberOfBytesToStoreBase64 } from "@tic-tac-toe/core";
import { either as e, function as f } from "fp-ts";
import uid from "uid-safe";

import type { SessionsRepository } from "../ports";
import type {
  CreateOneOut,
  DeleteOneOut,
  DeleteOut,
  FindOneIn,
  FindOneOut,
  ListIn,
  ListOut,
  UpdateOneIn,
  UpdateOneOut,
} from "../ports/repository";
import { isSessionExpired } from "../utils";

import { SessionDeletionError } from "./errors";
import type { CreateOneIn, DeleteIn, DeleteOneIn } from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { Session, SessionFieldsInUniqueConstraints } from "~/core";
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
    if (id === initiatingSessionId) {
      return this.sessionsRepository.deleteOne({
        id,
      });
    }

    const eitherInitiatingSession = await this.canDeleteOthers(initiatingSessionId);
    if (eitherInitiatingSession._tag === "Left") {
      return eitherInitiatingSession;
    }

    return this.sessionsRepository.deleteOne({
      id,
      userId: eitherInitiatingSession.right.userId,
    });
  }

  async delete({
    initiatingSessionId,
  }: DeleteIn): Promise<e.Either<SessionDeletionError, DeleteOut>> {
    const eitherInitiatingSession = await this.canDeleteOthers(initiatingSessionId);
    if (eitherInitiatingSession._tag === "Left") {
      return eitherInitiatingSession;
    }

    return e.right(
      await this.sessionsRepository.delete({
        userId: eitherInitiatingSession.right.userId,
      }),
    );
  }

  private async canDeleteOthers(id: Session["id"]) {
    return f.pipe(
      await this.sessionsRepository.findOne({
        id,
      }),
      e.mapLeft(() => new SessionDeletionError("INITIATING_SESSION_DOES_NOT_EXIST")),
      e.flatMap((session) =>
        f.pipe(
          session,
          e.fromPredicate(
            ({ createdAt }) =>
              Date.now() - createdAt.getTime() >=
              this.config.session.minimumAgeForDestructionOfOthers,
            () => new SessionDeletionError("INITIATING_SESSION_IS_TOO_YOUNG"),
          ),
        ),
      ),
      e.flatMap((session) =>
        f.pipe(
          session,
          e.fromPredicate(
            (session) => !isSessionExpired(session),
            () => new SessionDeletionError("INITIATING_SESSION_HAS_ALREADY_EXPIRED"),
          ),
        ),
      ),
    );
  }
}

export { SessionsService };
