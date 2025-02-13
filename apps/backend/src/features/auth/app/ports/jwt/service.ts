import type { either as e } from "fp-ts";

import type { CheckTokenIn } from "../../service";

import type { JwtError, JwtExpirationError } from "./errors";
import type { GenerateTokenIn, GenerateTokenOut } from "./ios";
import type { Payload } from "./types";

abstract class JwtService {
  abstract generate<T extends Payload, U extends Payload>(
    params: GenerateTokenIn<T>,
  ): Promise<GenerateTokenOut<U>>;
  abstract check<T extends Payload>(
    params: CheckTokenIn,
  ): Promise<e.Either<JwtError | JwtExpirationError, T>>;
}

export { JwtService };
