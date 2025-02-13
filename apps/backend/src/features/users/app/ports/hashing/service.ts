import type { Hash } from "./types";

abstract class HashingService {
  abstract hash(data: string): Promise<Hash>;
  abstract compare(data: string, hash: Hash): Promise<boolean>;
}

export { HashingService };
