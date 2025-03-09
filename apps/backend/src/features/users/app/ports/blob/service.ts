import type { either as e } from "fp-ts";

import type { BlobNotFoundError } from "./errors";

abstract class BlobService {
  abstract upload(data: File): Promise<string>;
  abstract delete(url: string): Promise<e.Either<BlobNotFoundError, void>>;
}

export { BlobService };
