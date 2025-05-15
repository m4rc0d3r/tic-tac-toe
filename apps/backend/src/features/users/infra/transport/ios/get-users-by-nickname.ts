import { createPageSchema } from "@tic-tac-toe/core";
import type { z } from "zod";

import { zGetUserOut } from "./get-user";

const zGetUsersByNicknameOut = createPageSchema(zGetUserOut);
type GetUsersByNickname = z.infer<typeof zGetUsersByNicknameOut>;

export { zGetUsersByNicknameOut };
export type { GetUsersByNickname };
