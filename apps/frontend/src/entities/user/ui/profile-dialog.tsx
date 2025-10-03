import { COLON_WITH_SPACE } from "@tic-tac-toe/core";
import type { ComponentProps } from "react";

import { getFullName } from "../lib";
import type { User } from "../model";

import { UserAvatar } from "./avatar";

import { trpc } from "~/shared/api";
import { formatDateTime, TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Spinner } from "~/shared/ui/spinner";

type Props = ComponentProps<typeof Dialog> & {
  userId: User["id"];
  triggerProps?: ComponentProps<typeof DialogTrigger> | undefined;
};

function UserProfileDialog({ userId, triggerProps, open = false, ...props }: Props) {
  const {
    translation: {
      i18n: { language },
    },
    postproc: { tc },
  } = useTranslation2();

  const {
    data: user,
    error: userError,
    isError: isUserError,
    isPending: isUserPending,
  } = trpc.users.getUser.useQuery(
    {
      id: userId ?? 0,
    },
    {
      enabled: open,
    },
  );

  return (
    <Dialog open={open} {...props}>
      {triggerProps && <DialogTrigger {...triggerProps} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tc(TRANSLATION_KEYS.USER_PROFILE)}</DialogTitle>
        </DialogHeader>
        {isUserPending ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner className="size-16" />
          </div>
        ) : isUserError ? (
          <p>{userError.message}</p>
        ) : (
          <div className="flex items-center gap-4">
            <UserAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              avatar={user.avatar}
              className="size-24"
            />
            <div className="flex flex-col gap-1">
              <span className="font-bold">{getFullName(user)}</span>
              <span>{user.nickname}</span>
              <span className="text-muted-foreground italic">
                {[
                  tc(TRANSLATION_KEYS.LAST_ONLINE),
                  formatDateTime(language, new Date(user.lastOnlineAt)),
                ].join(COLON_WITH_SPACE)}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { UserProfileDialog };
