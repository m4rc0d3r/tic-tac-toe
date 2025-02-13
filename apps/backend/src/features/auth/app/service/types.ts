import { z } from "zod";

import { zUser } from "~/core";

const zTokenType = z.enum(["access", "refresh"]);
type TokenType = z.infer<typeof zTokenType>;

const zPayloadToSign = z.object({
  userId: zUser.shape.id,
});
type PayloadToSign = z.infer<typeof zPayloadToSign>;

const zSignedPayload = zPayloadToSign.pick({ userId: true }).extend({
  exp: z.number(),
  iat: z.number(),
});
type SignedPayload = z.infer<typeof zSignedPayload>;

type Token = string;

export { zPayloadToSign, zSignedPayload, zTokenType };
export type { PayloadToSign, SignedPayload, Token, TokenType };
