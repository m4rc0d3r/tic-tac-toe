import { EMPTY_STRING } from "@tic-tac-toe/core";
import { UserIcon } from "lucide-react";
import type { ComponentProps } from "react";

import type { User } from "../model";

import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";

type Props = ComponentProps<typeof Avatar> & {
  fallbackClassName?: string | undefined;
} & Pick<User, "firstName" | "lastName" | "avatar">;

function UserAvatar({ firstName, lastName, avatar, ...props }: Props) {
  const {
    postproc: { tc },
  } = useTranslation2();

  const initials = [firstName, lastName]
    .map((value) => value.charAt(0).toLocaleUpperCase())
    .join(EMPTY_STRING);

  return (
    <Avatar {...props}>
      <AvatarImage
        src={avatar || undefined}
        alt={tc(TRANSLATION_KEYS.USER_AVATAR)}
        className="object-cover"
      />
      <AvatarFallback>{initials || <UserIcon className="size-3/4" />}</AvatarFallback>
    </Avatar>
  );
}

export { UserAvatar };
