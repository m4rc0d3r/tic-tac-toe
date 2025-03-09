import { del, put, BlobNotFoundError as VercelBlobNotFoundError } from "@vercel/blob";
import type { either as e } from "fp-ts";
import { function as f, taskEither as te } from "fp-ts";

import { BlobService } from "../app/ports";
import { BlobNotFoundError } from "../app/ports/blob";

import type { Config } from "~/infra";

class VercelBlobService extends BlobService {
  private readonly token: string;

  constructor(private readonly config: Config) {
    super();
    const { blobReadWriteToken } = this.config.vercel;
    this.token = blobReadWriteToken;
  }

  override async upload(data: File): Promise<string> {
    return f.pipe(
      await put(data.name, data, {
        access: "public",
        token: this.token,
      }),
      ({ url }) => url,
    );
  }

  override delete(url: string): Promise<e.Either<BlobNotFoundError, void>> {
    return te.tryCatch(
      () =>
        del(url, {
          token: this.token,
        }),
      (reason) => {
        if (reason instanceof VercelBlobNotFoundError) {
          return new BlobNotFoundError(url);
        }
        throw reason;
      },
    )();
  }
}

export { VercelBlobService };
