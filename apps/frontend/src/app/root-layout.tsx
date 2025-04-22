import { SPACE } from "@tic-tac-toe/core";
import { GamepadIcon, MenuIcon, Moon, Sun } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

import type { Theme } from "./theming";
import { THEMES, useTheme } from "./theming";

import type { Me } from "~/entities/auth";
import { useAuthStore } from "~/entities/auth";
import { UserAvatar } from "~/entities/user";
import { ClassicGameOptionsDialog } from "~/pages/classic-game";
import { trpc } from "~/shared/api";
import AboutIcon from "~/shared/assets/about.svg?react";
import EnglishFlagIcon from "~/shared/assets/english-flag.svg?react";
import LogoIcon from "~/shared/assets/logo.svg?react";
import UkrainianFlagIcon from "~/shared/assets/ukrainian-flag.svg?react";
import type { LanguageCode } from "~/shared/i18n";
import { SUPPORTED_LANGUAGES, TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { ROUTES } from "~/shared/routing";
import { Button } from "~/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/shared/ui/dropdown-menu";
import { cn } from "~/shared/ui/utils";

function RootLayout() {
  const {
    postproc: { tc },
  } = useTranslation2();
  const navigate = useNavigate();

  type State = ReturnType<(typeof useAuthStore)["getState"]>;
  const { status, me } = {
    status: useAuthStore.use.status(),
    me: useAuthStore.use.me(),
  } as
    | Pick<Extract<State, { status: "UNCERTAIN" | "UNAUTHENTICATED" }>, "status" | "me">
    | Pick<Extract<State, { status: "AUTHENTICATED" }>, "status" | "me">;

  const [isClassicGameOptionsDialogOpen, setIsClassicGameOptionsDialogOpen] = useState(false);

  const menuItems = [
    {
      type: "LINK",
      name: tc(TRANSLATION_KEYS.ABOUT_US),
      Icon: AboutIcon,
      path: ROUTES.about,
    },
    {
      type: "DIALOG",
      name: tc(TRANSLATION_KEYS.PLAY),
      Icon: GamepadIcon,
      Component: ClassicGameOptionsDialog,
      props: {
        open: isClassicGameOptionsDialogOpen,
        onOpenChange: setIsClassicGameOptionsDialogOpen,
        onSubmit: (options) => {
          setIsClassicGameOptionsDialogOpen(false);
          void navigate(ROUTES.classicGame, {
            state: options,
          });
        },
      } satisfies ComponentProps<typeof ClassicGameOptionsDialog>,
    },
  ] as const;

  const authMenuItems = [
    {
      name: tc(TRANSLATION_KEYS.SIGN_IN),
      path: ROUTES.login,
      variant: "ghost" satisfies ComponentProps<typeof Button>["variant"],
    },
    {
      name: tc(TRANSLATION_KEYS.SIGN_UP),
      path: ROUTES.registration,
      variant: "outline" satisfies ComponentProps<typeof Button>["variant"],
    },
  ] as const;

  return (
    <div className="flex h-full flex-col">
      <header>
        <nav>
          <ul className="flex justify-between gap-2 border-b p-2">
            <li className="flex items-center md:hidden">
              <DropdownMenu modal={!isClassicGameOptionsDialogOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {menuItems.map((item, index) => {
                    const { type, name, Icon } = item;
                    return type === "LINK" ? (
                      <DropdownMenuItem key={index} asChild>
                        <Link to={item.path}>
                          <Icon />
                          {name}
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <item.Component
                        key={index}
                        trigger={
                          <DropdownMenuItem>
                            <Icon />
                            {name}
                          </DropdownMenuItem>
                        }
                        {...item.props}
                      />
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link to={ROUTES.home}>
                <LogoIcon className="size-10" />
              </Link>
            </li>
            <li className="hidden items-center md:flex">
              <ul className="flex">
                {menuItems.map((item, index) => {
                  const { type, name } = item;
                  return (
                    <li key={index}>
                      {type === "LINK" ? (
                        <Button asChild variant="link">
                          <Link to={item.path}>{name}</Link>
                        </Button>
                      ) : (
                        <item.Component
                          trigger={<Button variant="link">{name}</Button>}
                          {...item.props}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="flex items-center">
              <ul className="flex gap-2">
                <li className="flex items-center">
                  <ul className="flex gap-1">
                    <li className="flex items-center">
                      <ThemeSwitcher />
                    </li>
                    <li className="flex items-center">
                      <LanguageSwitcher />
                    </li>
                  </ul>
                </li>
                <li className="flex items-center">
                  {status === "AUTHENTICATED" ? (
                    <MeSection data={me} />
                  ) : status === "UNAUTHENTICATED" ? (
                    <ul className="flex gap-1">
                      {authMenuItems.map(({ name, path, variant }, index) => (
                        <li
                          key={path}
                          className={cn(
                            index === authMenuItems.length - 1 && "hidden sm:list-item",
                          )}
                        >
                          <Button asChild variant={variant}>
                            <Link to={path}>{name}</Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <></>
                  )}
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function ThemeSwitcher(props: ComponentProps<typeof DropdownMenu>) {
  const {
    postproc: { tc },
  } = useTranslation2();
  const { theme, setTheme } = useTheme();

  const getThemeName = (value: string) => tc(value.toLocaleUpperCase());

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          {THEMES.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {getThemeName(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageSwitcher(props: ComponentProps<typeof DropdownMenu>) {
  const {
    translation: { i18n },
    postproc: { tc },
  } = useTranslation2();

  const FLAGS_BY_CODE: Record<LanguageCode, typeof EnglishFlagIcon> = {
    en: EnglishFlagIcon,
    uk: UkrainianFlagIcon,
  };

  const getLanguageName = (code: string) =>
    tc(SUPPORTED_LANGUAGES[code as LanguageCode].toLocaleUpperCase(), {
      lng: code,
    });

  const FlagIcon = FLAGS_BY_CODE[i18n.language as LanguageCode];

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <FlagIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={i18n.language}
          onValueChange={(value) => void i18n.changeLanguage(value)}
        >
          {Object.keys(SUPPORTED_LANGUAGES).map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {getLanguageName(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
type MeSectionProps = ComponentProps<typeof DropdownMenu> & {
  data: Me;
};

function MeSection({ data, ...props }: MeSectionProps) {
  const {
    postproc: { tc },
  } = useTranslation2();
  const navigate = useNavigate();

  const { mutate: logout, isPending: isLogoutPending } = trpc.auth.logout.useMutation();
  const logoutLocally = useAuthStore.use.logout();

  const handleLogout = () => {
    logout(void 0, {
      onSuccess: () => {
        toast.success(tc(TRANSLATION_KEYS.LOGOUT_COMPLETED_SUCCESSFULLY));
      },
      onError: () => {
        toast.error(tc(TRANSLATION_KEYS.ERRORS_WHEN_LOGGING_OUT));
      },
      onSettled: () => {
        logoutLocally();
        void navigate(ROUTES.home);
      },
    });
  };

  const { firstName, lastName, avatar } = data;
  const fullName = [firstName, lastName].join(SPACE).trim();

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <UserAvatar firstName={firstName} lastName={lastName} avatar={avatar} />
          {fullName || tc(TRANSLATION_KEYS.NAME_NOT_SPECIFIED)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.settings}>{tc(TRANSLATION_KEYS.SETTINGS)}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={isLogoutPending}>
          {tc(TRANSLATION_KEYS.SIGN_OUT)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { RootLayout };
