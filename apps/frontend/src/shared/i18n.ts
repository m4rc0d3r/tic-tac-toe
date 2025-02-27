import { capitalize, EMPTY_STRING, UNDERSCORE } from "@tic-tac-toe/core";
import type { FlatNamespace, KeyPrefix, Namespace, TFunction } from "i18next";
import type { $Tuple } from "node_modules/react-i18next/helpers";
import type { FallbackNs, UseTranslationOptions, UseTranslationResponse } from "react-i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const zCase = z.enum(["genitive"]);
const CASES = zCase.Values;
type Case = z.infer<typeof zCase>;

const zPlural = z.enum(["one", "other"]);
const PLURALS = zPlural.Values;
type Plural = z.infer<typeof zPlural>;

const zGender = z.enum(["male", "female"]);
const GENDERS = zGender.Values;
type Gender = z.infer<typeof zGender>;

function tk<C extends Case, G extends Gender, P extends Plural>(
  name: string,
  opts?: Partial<{
    case_: C;
    gender: G;
    plural: P;
  }>,
) {
  const { case_ = EMPTY_STRING, gender = EMPTY_STRING, plural = EMPTY_STRING } = opts ?? {};
  return [name, case_, gender, plural].filter((value) => value).join(UNDERSCORE);
}

const TRANSLATION_KEYS = z.enum([
  "ENGLISH",
  "UKRAINIAN",
  "WELCOME_TO_HOME_PAGE",
  "WELCOME_TO_ABOUT_US_PAGE",
  "ABOUT_US",
  "SIGN_IN",
  "SIGN_UP",
  "SIGN_OUT",
  "NAME_NOT_SPECIFIED",
  "SIGNING_UP",
  "CREATE_ACCOUNT_TO_GET_THE_ABILITY_TO_STORE_YOUR_GAME_HISTORY_AND_MORE",
  "NICKNAME",
  "EMAIL",
  "FIRST_NAME",
  "LAST_NAME",
  "PASSWORD",
  "DO_YOU_ALREADY_HAVE_ACCOUNT",
  "SIGNING_IN",
  "SIGN_IN_TO_YOUR_ACCOUNT_TO_ACCESS_YOUR_GAME_HISTORY_AND_MORE",
  "DONT_HAVE_AN_ACCOUNT_YET",
  "DOES_NOT_MATCH_FORMAT",
  "MUST_CONTAIN_STRING",
  "STARTING_AT_POSITION_N",
  "MUST_START_WITH_STRING",
  "MUST_END_WITH_STRING",
  "INCORRECT_NUMBER_OF_CHARACTERS_MUST_BE_EXACTLY_N",
  "NOT_ENOUGH_CHARACTERS_AT_LEAST_N_REQUIRED",
  "UNEXPECTED_ERROR_OCCURRED",
  "DATA_ALREADY_USED_BY_ANOTHER_USER",
  "CONJUNCTION",
  "REGISTRATION_SUCCESSFULLY_COMPLETED",
  "FAILED_TO_REGISTER",
  "INCORRECT_EMAIL_ADDRESS_AND_OR_PASSWORD",
  "LOGIN_COMPLETED_SUCCESSFULLY",
  "FAILED_TO_LOGIN",
]).Values;

const RESOURCES = {
  en: {
    translation: {
      [TRANSLATION_KEYS.ENGLISH]: "english",
      [TRANSLATION_KEYS.UKRAINIAN]: "ukrainian",
      [TRANSLATION_KEYS.WELCOME_TO_HOME_PAGE]: "welcome to the home page",
      [TRANSLATION_KEYS.WELCOME_TO_ABOUT_US_PAGE]: "welcome to the page that tells about us",
      [TRANSLATION_KEYS.ABOUT_US]: "about us",
      [TRANSLATION_KEYS.SIGN_IN]: "sign in",
      [TRANSLATION_KEYS.SIGN_UP]: "sign up",
      [TRANSLATION_KEYS.SIGN_OUT]: "sign out",
      [TRANSLATION_KEYS.NAME_NOT_SPECIFIED]: "name not specified",
      [TRANSLATION_KEYS.SIGNING_UP]: "signing up",
      [TRANSLATION_KEYS.CREATE_ACCOUNT_TO_GET_THE_ABILITY_TO_STORE_YOUR_GAME_HISTORY_AND_MORE]:
        "create an account to get the ability to store your game history and more",
      [TRANSLATION_KEYS.NICKNAME]: "nickname",
      [TRANSLATION_KEYS.EMAIL]: "email",
      [TRANSLATION_KEYS.FIRST_NAME]: "first name",
      [TRANSLATION_KEYS.LAST_NAME]: "last name",
      [TRANSLATION_KEYS.PASSWORD]: "password",
      [TRANSLATION_KEYS.DO_YOU_ALREADY_HAVE_ACCOUNT]: "do you already have an account",
      [TRANSLATION_KEYS.SIGNING_IN]: "signing in",
      [TRANSLATION_KEYS.SIGN_IN_TO_YOUR_ACCOUNT_TO_ACCESS_YOUR_GAME_HISTORY_AND_MORE]:
        "sign in to your account to access your game history and more",
      [TRANSLATION_KEYS.DONT_HAVE_AN_ACCOUNT_YET]: "Don't have an account yet",
      [TRANSLATION_KEYS.DOES_NOT_MATCH_FORMAT]: "does not match {{format}} format",
      [TRANSLATION_KEYS.MUST_CONTAIN_STRING]: 'must contain "{{string}}"',
      [TRANSLATION_KEYS.STARTING_AT_POSITION_N]: ", starting at position {{n}}",
      [TRANSLATION_KEYS.MUST_START_WITH_STRING]: 'must start with "{{string}}"',
      [TRANSLATION_KEYS.MUST_END_WITH_STRING]: 'must end with "{{string}}"',
      [TRANSLATION_KEYS.INCORRECT_NUMBER_OF_CHARACTERS_MUST_BE_EXACTLY_N]:
        "incorrect number of characters, must be exactly {{n}}",
      [tk(TRANSLATION_KEYS.NOT_ENOUGH_CHARACTERS_AT_LEAST_N_REQUIRED, { plural: "one" })]:
        "not enough characters, at least {{n}} is required",
      [tk(TRANSLATION_KEYS.NOT_ENOUGH_CHARACTERS_AT_LEAST_N_REQUIRED, { plural: "other" })]:
        "not enough characters, at least {{n}} are required",
      [TRANSLATION_KEYS.UNEXPECTED_ERROR_OCCURRED]: "an unexpected error occurred",
      [tk(TRANSLATION_KEYS.DATA_ALREADY_USED_BY_ANOTHER_USER, { plural: "one" })]:
        "the {{data}} is already taken by another user",
      [tk(TRANSLATION_KEYS.DATA_ALREADY_USED_BY_ANOTHER_USER, { plural: "other" })]:
        "the {{data}} are already taken by another user",
      [TRANSLATION_KEYS.CONJUNCTION]: "and",
      [TRANSLATION_KEYS.REGISTRATION_SUCCESSFULLY_COMPLETED]: "registration successfully completed",
      [TRANSLATION_KEYS.FAILED_TO_REGISTER]: "failed to register",
      [TRANSLATION_KEYS.INCORRECT_EMAIL_ADDRESS_AND_OR_PASSWORD]:
        "incorrect email address and/or password",
      [TRANSLATION_KEYS.LOGIN_COMPLETED_SUCCESSFULLY]: "login completed successfully",
      [TRANSLATION_KEYS.FAILED_TO_LOGIN]: "failed to login",
    },
  },
  uk: {
    translation: {
      [TRANSLATION_KEYS.ENGLISH]: "англійська",
      [TRANSLATION_KEYS.UKRAINIAN]: "українська",
      [TRANSLATION_KEYS.WELCOME_TO_HOME_PAGE]: "ласкаво просимо на головну сторінку",
      [TRANSLATION_KEYS.WELCOME_TO_ABOUT_US_PAGE]:
        "ласкаво просимо на сторінку, яка розповідає про нас",
      [TRANSLATION_KEYS.ABOUT_US]: "про нас",
      [TRANSLATION_KEYS.SIGN_IN]: "увійти",
      [TRANSLATION_KEYS.SIGN_UP]: "зареєструватися",
      [TRANSLATION_KEYS.SIGN_OUT]: "вийти",
      [TRANSLATION_KEYS.NAME_NOT_SPECIFIED]: "ім'я не вказано",
      [TRANSLATION_KEYS.SIGNING_UP]: "реєстрація",
      [TRANSLATION_KEYS.CREATE_ACCOUNT_TO_GET_THE_ABILITY_TO_STORE_YOUR_GAME_HISTORY_AND_MORE]:
        "створіть обліковий запис, щоб зберігати історію ігор і не тільки",
      [TRANSLATION_KEYS.NICKNAME]: "псевдонім",
      [TRANSLATION_KEYS.EMAIL]: "електронна адреса",
      [tk(TRANSLATION_KEYS.EMAIL, { case_: "genitive" })]: "електронної адреси",
      [TRANSLATION_KEYS.FIRST_NAME]: "ім'я",
      [TRANSLATION_KEYS.LAST_NAME]: "прізвище",
      [TRANSLATION_KEYS.PASSWORD]: "пароль",
      [TRANSLATION_KEYS.DO_YOU_ALREADY_HAVE_ACCOUNT]: "ви вже маєте акаунт",
      [TRANSLATION_KEYS.SIGNING_IN]: "вхід",
      [TRANSLATION_KEYS.SIGN_IN_TO_YOUR_ACCOUNT_TO_ACCESS_YOUR_GAME_HISTORY_AND_MORE]:
        "увійдіть у свій обліковий запис, щоб отримати доступ до історії ігор і не тільки",
      [TRANSLATION_KEYS.DONT_HAVE_AN_ACCOUNT_YET]: "у вас ще немає облікового запису",
      [TRANSLATION_KEYS.DOES_NOT_MATCH_FORMAT]: "не відповідає формату {{format}}",
      [TRANSLATION_KEYS.MUST_CONTAIN_STRING]: 'має містити "{{string}}"',
      [TRANSLATION_KEYS.STARTING_AT_POSITION_N]: ", починаючи з позиції {{n}}",
      [TRANSLATION_KEYS.MUST_START_WITH_STRING]: 'має починатися на "{{string}}"',
      [TRANSLATION_KEYS.MUST_END_WITH_STRING]: 'має закінчуватися на "{{string}}"',
      [TRANSLATION_KEYS.INCORRECT_NUMBER_OF_CHARACTERS_MUST_BE_EXACTLY_N]:
        "неправильна кількість символів, має бути рівно {{n}}",
      [TRANSLATION_KEYS.NOT_ENOUGH_CHARACTERS_AT_LEAST_N_REQUIRED]:
        "недостатньо символів, потрібно принаймні {{n}}",
      [tk(TRANSLATION_KEYS.NOT_ENOUGH_CHARACTERS_AT_LEAST_N_REQUIRED, { plural: "one" })]:
        "недостатньо символів, потрібен принаймні {{n}}",
      [TRANSLATION_KEYS.UNEXPECTED_ERROR_OCCURRED]: "сталася неочікувана помилка",
      [TRANSLATION_KEYS.DATA_ALREADY_USED_BY_ANOTHER_USER]:
        "{{data}} вже зайняті іншим користувачем",
      [tk(TRANSLATION_KEYS.DATA_ALREADY_USED_BY_ANOTHER_USER, { gender: "male", plural: "one" })]:
        "{{data}} вже зайнятий іншим користувачем",
      [tk(TRANSLATION_KEYS.DATA_ALREADY_USED_BY_ANOTHER_USER, { gender: "female", plural: "one" })]:
        "{{data}} вже зайнята іншим користувачем",
      [TRANSLATION_KEYS.CONJUNCTION]: "і",
      [TRANSLATION_KEYS.REGISTRATION_SUCCESSFULLY_COMPLETED]: "реєстрацію успішно завершено",
      [TRANSLATION_KEYS.FAILED_TO_REGISTER]: "не вдалося зареєструватися",
      [TRANSLATION_KEYS.INCORRECT_EMAIL_ADDRESS_AND_OR_PASSWORD]:
        "неправильна адреса електронної пошти та/або пароль",

      [TRANSLATION_KEYS.LOGIN_COMPLETED_SUCCESSFULLY]: "вхід успішно завершено",
      [TRANSLATION_KEYS.FAILED_TO_LOGIN]: "не вдалося увійти",
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
      [createTc(t)(...args), punctuationMark].join(EMPTY_STRING);
}

function createTsp<Ns extends Namespace, KPrefix>(t: TFunction<Ns, KPrefix>) {
  return (...args: Parameters<typeof t>) => createTs(t)(".")(...args);
}

export {
  CASES,
  createTc,
  createTs,
  createTsp,
  GENDERS,
  PLURALS,
  RESOURCES,
  SUPPORTED_LANGUAGES,
  TRANSLATION_KEYS,
  useTranslation2,
};
export type { Case, Gender, LanguageCode, Plural };
