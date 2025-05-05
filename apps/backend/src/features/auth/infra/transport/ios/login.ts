import type { z } from "zod";

import { zRegisterOut } from "./register";

import { zFullyRegisteredUser } from "~/core";

const zLoginIn = zFullyRegisteredUser.pick({
  email: true,
  password: true,
});
type LoginIn = z.infer<typeof zLoginIn>;

const zLoginOut = zRegisterOut;
type LoginOut = z.infer<typeof zLoginOut>;

export { zLoginIn, zLoginOut };
export type { LoginIn, LoginOut };
