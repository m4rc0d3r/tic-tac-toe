import type { either as e } from "fp-ts";

import type {
  GenerateTokenOut,
  JwtError,
  JwtExpirationError,
  JwtService,
  TokenMap,
} from "../ports/jwt";

import type { CheckTokenIn, GenerateTokenIn, RegenerateTokenIn } from "./ios";
import type { PayloadToSign, SignedPayload, TokenType } from "./types";
import { zPayloadToSign } from "./types";

class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens({
    payload,
  }: GenerateTokenIn): Promise<TokenMap<GenerateTokenOut<SignedPayload>>> {
    return {
      access: await this.jwtService.generate({
        type: "access" satisfies Extract<TokenType, "access">,
        payload,
      }),
      refresh: await this.jwtService.generate({
        type: "refresh" satisfies Extract<TokenType, "refresh">,
        payload,
      }),
    };
  }

  async regenerateAccessToken({
    payload,
  }: RegenerateTokenIn): Promise<GenerateTokenOut<SignedPayload>> {
    const payloadWithoutClaims = Object.fromEntries(
      Object.entries(payload).filter(([key]) =>
        Object.keys(zPayloadToSign.keyof().Values).includes(key),
      ),
    ) as PayloadToSign;
    return this.jwtService.generate({
      type: "access" satisfies Extract<TokenType, "access">,
      payload: payloadWithoutClaims,
    });
  }

  async checkToken(
    params: CheckTokenIn,
  ): Promise<e.Either<JwtError | JwtExpirationError, SignedPayload>> {
    return this.jwtService.check(params);
  }
}

export { AuthService };
