import { Link } from "react-router";

import { LanguageSwitcher } from "~/entities/i18n_";
import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { ROUTES } from "~/shared/routing";
import { Button } from "~/shared/ui/button";

function NotFoundPage() {
  const {
    postproc: { tc, tsp },
  } = useTranslation2();

  return (
    <div className="flex h-full flex-col p-2">
      <LanguageSwitcher
        triggerButtonProps={{
          variant: "outline",
          className: "self-end",
        }}
      />
      <div className="m-auto flex flex-col gap-2 overflow-auto">
        <p className="text-center text-5xl">{tsp(TRANSLATION_KEYS.SUCH_PAGE_DOES_NOT_EXIST)}</p>
        <Button asChild variant="link">
          <Link to={ROUTES.home}>{tc(TRANSLATION_KEYS.GO_TO_THE_MAIN_PAGE)}</Link>
        </Button>
      </div>
    </div>
  );
}

export { NotFoundPage };
