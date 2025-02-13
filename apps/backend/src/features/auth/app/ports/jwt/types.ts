import type { Token } from "../../service";

type Payload = Record<string, unknown>;

type TokenMap<Access = Token, Refresh = Access> = {
  access: Access;
  refresh: Refresh;
};

export type { Payload, TokenMap };
