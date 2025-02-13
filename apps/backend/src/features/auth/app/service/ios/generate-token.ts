import { z } from "zod";

import { zPayloadToSign } from "../types";

const zGenerateTokenIn = z.object({
  payload: zPayloadToSign,
});
type GenerateTokenIn = z.infer<typeof zGenerateTokenIn>;

export { zGenerateTokenIn };
export type { GenerateTokenIn };
