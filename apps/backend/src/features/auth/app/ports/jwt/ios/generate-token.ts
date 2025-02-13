import type { Token, TokenType } from "../../../service";
import type { Payload } from "../types";

type GenerateTokenIn<T extends Payload> = {
  type: TokenType;
  payload: T;
};

type GenerateTokenOut<T extends Payload> = {
  token: Token;
  payload: T;
};

export type { GenerateTokenIn, GenerateTokenOut };
