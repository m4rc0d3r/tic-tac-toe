import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";

function AboutPage() {
  const {
    postproc: { tsp },
  } = useTranslation2();

  return (
    <p className="flex h-full items-center justify-center">
      {tsp(TRANSLATION_KEYS.WELCOME_TO_ABOUT_US_PAGE)}
    </p>
  );
}

export { AboutPage };
