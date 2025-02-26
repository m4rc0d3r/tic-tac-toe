import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import type { LanguageCode } from "~/shared/i18n";
import { RESOURCES, SUPPORTED_LANGUAGES } from "~/shared/i18n";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    fallbackLng: "en" satisfies LanguageCode,
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
