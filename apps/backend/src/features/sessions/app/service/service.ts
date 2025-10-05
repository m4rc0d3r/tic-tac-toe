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
  UpdateLastAccessDateIn,
  UpdateLastAccessDateOut,
  UpdateOneIn,
  UpdateOneOut,
} from "../ports/repository";
import { isSessionExpired } from "../utils";

import { SessionDeletionError } from "./errors";
import type { CreateOneIn, DeleteOneIn, DeleteOtherUserSessionsIn } from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { EventBus, Session, SessionFieldsInUniqueConstraints } from "~/core";
import { EventName, SESSION_ID_LENGTH } from "~/core";
import type { Config } from "~/infra";

class SessionsService {
  constructor(
    private readonly config: Config,
    private readonly eventBus: EventBus,
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

  updateLastAccessDate(
    params: UpdateLastAccessDateIn,
  ): Promise<e.Either<NotFoundError, UpdateLastAccessDateOut>> {
    return this.sessionsRepository.updateLastAccessDate(params);
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

    const eitherInitiatingSession =
      await this.getSessionOrReasonWhyItCannotDeleteOthers(initiatingSessionId);
    if (eitherInitiatingSession._tag === "Left") {
      return eitherInitiatingSession;
    }

    return f.pipe(
      await this.sessionsRepository.deleteOne({
        id,
        userId: eitherInitiatingSession.right.userId,
      }),
      e.tap(({ id }) =>
        e.right(
          this.eventBus.emit(EventName.sessionTerminated, {
            id,
          }),
        ),
      ),
    );
  }

  async deleteOtherUserSessions({
    initiatingSessionId,
  }: DeleteOtherUserSessionsIn): Promise<e.Either<SessionDeletionError, DeleteOut>> {
    const eitherInitiatingSession =
      await this.getSessionOrReasonWhyItCannotDeleteOthers(initiatingSessionId);
    if (eitherInitiatingSession._tag === "Left") {
      return eitherInitiatingSession;
    }

    const initiatingSession = eitherInitiatingSession.right;

    const sessions = await this.sessionsRepository.delete({
      userId: initiatingSession.userId,
      exceptForSessionId: initiatingSession.id,
    });

    for (const { id } of sessions) {
      this.eventBus.emit(EventName.sessionTerminated, {
        id,
      });
    }

    return e.right(sessions);
  }

  private async getSessionOrReasonWhyItCannotDeleteOthers(id: Session["id"]) {
    return f.pipe(
      await this.sessionsRepository.findOne({
        id,
      }),
      e.mapLeft(() => new SessionDeletionError({ reason: "INITIATING_SESSION_DOES_NOT_EXIST" })),
      e.flatMap((session) =>
        f.pipe(
          session,
          e.fromPredicate(
            ({ createdAt }) =>
              Date.now() - createdAt.getTime() >=
              this.config.session.minimumAgeForDestructionOfOthers,
            ({ createdAt }) =>
              new SessionDeletionError({
                reason: "INITIATING_SESSION_IS_TOO_YOUNG",
                whenItWillBePossible: new Date(
                  createdAt.getTime() + this.config.session.minimumAgeForDestructionOfOthers,
                ),
              }),
          ),
        ),
      ),
      e.flatMap((session) =>
        f.pipe(
          session,
          e.fromPredicate(
            (session) => !isSessionExpired(session),
            () => new SessionDeletionError({ reason: "INITIATING_SESSION_HAS_ALREADY_EXPIRED" }),
          ),
        ),
      ),
    );
  }
}

export { SessionsService };
