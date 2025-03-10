import { MIME_TYPES, zMimeTypeRefinement } from "@tic-tac-toe/core";
import { File } from "@web-std/file";
import { z } from "zod";

const zAvatarMimeType = z.enum([MIME_TYPES.gif, MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.svg]);

const AVATAR_MIME_TYPES = zAvatarMimeType.Values;

const zAvatarAsFile = z.instanceof(File).superRefine(zMimeTypeRefinement(zAvatarMimeType));

const zAvatar = z.union([z.string().trim().length(0), z.string().url()]);
type Avatar = z.infer<typeof zAvatar>;

export { AVATAR_MIME_TYPES, zAvatar, zAvatarAsFile };
export type { Avatar };
