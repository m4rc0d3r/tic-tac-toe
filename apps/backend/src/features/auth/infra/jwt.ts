import type { either as e } from "fp-ts";
import { taskEither as te } from "fp-ts";
import jwt from "jsonwebtoken";

import type { GenerateTokenIn, GenerateTokenOut, Payload, TokenMap } from "../app/ports/jwt";
import { JwtError, JwtExpirationError, JwtService } from "../app/ports/jwt";
import type { CheckTokenIn, Token } from "../app/service";

import type { Config } from "~/infra";

const REASONS_BY_MESSAGE: Record<string, JwtError["reason"]> = {
  "invalid token": "CONTAINS_INVALID_CHARACTERS",
  "jwt malformed": "MALFORMED",
  "jwt signature is required": "SIGNATURE_REQUIRED",
  "invalid signature": "INVALID_SIGNATURE",
};

class JwtServiceImpl extends JwtService {
  private readonly privateKeys: TokenMap;
  private readonly lifetimes: TokenMap<NonNullable<jwt.SignOptions["expiresIn"]>>;

  constructor(private readonly config: Config) {
    super();
    {
      const {
        access: { secret: access },
        refresh: { secret: refresh },
      } = this.config.authentication.jwt;
      this.privateKeys = {
        access,
        refresh,
      };
    }
    {
      const {
        access: { lifetime: access },
        refresh: { lifetime: refresh },
      } = this.config.authentication.jwt;
      this.lifetimes = {
        access,
        refresh,
      };
    }
  }

  override async generate<T extends Payload, U extends Payload>({
    type,
    payload,
  }: GenerateTokenIn<T>): Promise<GenerateTokenOut<U>> {
    const clonedPayload = globalThis.structuredClone(payload);
    const token = await new Promise<Token>((resolve, reject) =>
      jwt.sign(
        clonedPayload,
        this.privateKeys[type],
        {
          expiresIn: this.lifetimes[type],
          mutatePayload: true,
        },
        (error, encoded) => (error === null ? resolve(encoded!) : reject(error)),
      ),
    );
    return { token, payload: clonedPayload as unknown as U };
  }

  override async check<T extends Payload>({
    type,
    token,
  }: CheckTokenIn): Promise<e.Either<JwtError | JwtExpirationError, T>> {
    return te.tryCatch(
      () =>
        new Promise<T>((resolve, reject) =>
          jwt.verify(token, this.privateKeys[type], (error, decoded) =>
            error === null ? resolve(decoded as T) : reject(error),
          ),
        ),
      (reason) => {
        if (reason instanceof jwt.TokenExpiredError) {
          const { expiredAt } = reason;
          return new JwtExpirationError(expiredAt);
        } else if (reason instanceof jwt.JsonWebTokenError) {
          const jwtReason = REASONS_BY_MESSAGE[reason.message];
          if (!jwtReason) {
            throw reason;
          }
          return new JwtError(jwtReason);
        }
        throw reason;
      },
    )();
  }
}

export { JwtServiceImpl };
