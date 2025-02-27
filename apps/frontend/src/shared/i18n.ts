import { capitalize } from "@tic-tac-toe/core";
import type { FlatNamespace, KeyPrefix, Namespace, TFunction } from "i18next";
import type { $Tuple } from "node_modules/react-i18next/helpers";
import type { FallbackNs, UseTranslationOptions, UseTranslationResponse } from "react-i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const TRANSLATION_KEYS = z.enum(["ENGLISH", "UKRAINIAN"]).Values;

const RESOURCES = {
  en: {
    translation: {
      [TRANSLATION_KEYS.ENGLISH]: "english",
      [TRANSLATION_KEYS.UKRAINIAN]: "ukrainian",
    },
  },
  uk: {
    translation: {
      [TRANSLATION_KEYS.ENGLISH]: "англійська",
      [TRANSLATION_KEYS.UKRAINIAN]: "українська",
    },
  },
};

type LanguageCode = keyof typeof RESOURCES;

const SUPPORTED_LANGUAGES: Record<LanguageCode, string> = {
  en: "english",
  uk: "ukrainian",
};

type TFunctionWithPostprocessor<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
  Result extends string = string,
> = (...args: Parameters<TFunction<FallbackNs<Ns>, KPrefix>>) => Result;

function useTranslation2<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): {
  translation: UseTranslationResponse<FallbackNs<Ns>, KPrefix>;
  postproc: {
    tc: TFunctionWithPostprocessor<FallbackNs<Ns>, KPrefix, Capitalize<string>>;
    ts: (punctuationMark: string) => TFunctionWithPostprocessor<FallbackNs<Ns>, KPrefix>;
    tsp: TFunctionWithPostprocessor<FallbackNs<Ns>, KPrefix>;
  };
} {
  const translation = useTranslation(ns, options);

  const { t } = translation;

  const postproc = {
    tc: createTc(t),
    ts: createTs(t),
    tsp: createTsp(t),
  };

  return {
    translation,
    postproc,
  };
}

function createTc<Ns extends Namespace, KPrefix>(t: TFunction<Ns, KPrefix>) {
  return (...args: Parameters<typeof t>) => capitalize(t(...args));
}

function createTs<Ns extends Namespace, KPrefix>(t: TFunction<Ns, KPrefix>) {
  return (punctuationMark: string) =>
    (...args: Parameters<typeof t>) =>
      [createTc(t)(...args), punctuationMark].join("");
}

function createTsp<Ns extends Namespace, KPrefix>(t: TFunction<Ns, KPrefix>) {
  return (...args: Parameters<typeof t>) => createTs(t)(".")(...args);
}

export {
  createTc,
  createTs,
  createTsp,
  RESOURCES,
  SUPPORTED_LANGUAGES,
  TRANSLATION_KEYS,
  useTranslation2,
};
export type { LanguageCode };
