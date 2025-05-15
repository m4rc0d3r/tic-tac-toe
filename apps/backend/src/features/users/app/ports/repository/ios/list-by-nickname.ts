import { createPageSchema, zPageOptions } from "@tic-tac-toe/core";
import { z } from "zod";

import { zFindOneWithLastOnlineDateOut } from "./find-one-with-last-online-date";

const zListByNicknameIn = z.object({
  nicknamePrefix: z.string().trim(),
  pageOptions: zPageOptions,
});
type ListByNicknameIn = z.infer<typeof zListByNicknameIn>;

const zListByNicknameOut = createPageSchema(zFindOneWithLastOnlineDateOut);
type ListByNicknameOut = z.infer<typeof zListByNicknameOut>;

export { zListByNicknameIn, zListByNicknameOut };
export type { ListByNicknameIn, ListByNicknameOut };
