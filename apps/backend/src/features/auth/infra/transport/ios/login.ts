import type { z } from "zod";

import { zRegisterOut } from "./register";

import { zUser } from "~/core";

const zLoginIn = zUser.pick({
  email: true,
  password: true,
});
type LoginIn = z.infer<typeof zLoginIn>;

const zLoginOut = zRegisterOut;
type LoginOut = z.infer<typeof zLoginOut>;

export { zLoginIn, zLoginOut };
export type { LoginIn, LoginOut };
