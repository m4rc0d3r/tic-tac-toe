import { createPageSchema, zPageOptions } from "@tic-tac-toe/core";
import { z } from "zod";

import { zFindOneWithLastOnlineDateOut } from "./find-one-with-last-online-date";

const MINIMUM_NICKNAME_PREFIX_LENGTH = 2;

const zListByNicknameIn = z.object({
  nicknamePrefix: z.string().trim().min(MINIMUM_NICKNAME_PREFIX_LENGTH),
  pageOptions: zPageOptions,
});
type ListByNicknameIn = z.infer<typeof zListByNicknameIn>;

const zListByNicknameOut = createPageSchema(zFindOneWithLastOnlineDateOut);
type ListByNicknameOut = z.infer<typeof zListByNicknameOut>;

export { MINIMUM_NICKNAME_PREFIX_LENGTH, zListByNicknameIn, zListByNicknameOut };
export type { ListByNicknameIn, ListByNicknameOut };
