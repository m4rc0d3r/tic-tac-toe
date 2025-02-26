const RESOURCES = {
  en: {
    translation: {},
  },
  uk: {
    translation: {},
  },
};

type LanguageCode = keyof typeof RESOURCES;

const SUPPORTED_LANGUAGES: Record<LanguageCode, string> = {
  en: "english",
  uk: "ukrainian",
};

export { RESOURCES, SUPPORTED_LANGUAGES };
export type { LanguageCode };
