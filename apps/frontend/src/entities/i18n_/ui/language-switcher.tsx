import type { ComponentProps } from "react";

import EnglishFlagIcon from "~/shared/assets/english-flag.svg?react";
import UkrainianFlagIcon from "~/shared/assets/ukrainian-flag.svg?react";
import type { LanguageCode } from "~/shared/i18n";
import { SUPPORTED_LANGUAGES, useTranslation2 } from "~/shared/i18n";
import { Button } from "~/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/shared/ui/dropdown-menu";

type Props = ComponentProps<typeof DropdownMenu> & {
  triggerButtonProps?: ComponentProps<typeof Button> | undefined;
};

function LanguageSwitcher({
  triggerButtonProps: {
    variant: triggerButtonVariant = "ghost" satisfies ComponentProps<typeof Button>["variant"],
    size: triggerButtonSize = "icon" satisfies ComponentProps<typeof Button>["size"],
    ...triggerButtonProps
  } = {},
  ...props
}: Props) {
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
        <Button variant={triggerButtonVariant} size={triggerButtonSize} {...triggerButtonProps}>
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

export { LanguageSwitcher };
