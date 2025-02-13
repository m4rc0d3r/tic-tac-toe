import bcrypt from "bcrypt";

import type { Hash } from "../app/ports/hashing";
import { HashingService } from "../app/ports/hashing";

import type { Config } from "~/infra";

class BcryptHashingService extends HashingService {
  private readonly numberOfRounds: number;

  constructor(private readonly config: Config) {
    super();
    const { numberOfRounds } = this.config.bcrypt;
    this.numberOfRounds = numberOfRounds;
  }

  override async hash(data: string): Promise<Hash> {
    return await bcrypt.hash(data, this.numberOfRounds);
  }

  override async compare(data: string, hash: Hash): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }
}

export { BcryptHashingService };
