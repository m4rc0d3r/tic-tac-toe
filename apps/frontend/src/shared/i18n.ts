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
  "LOGOUT_COMPLETED_SUCCESSFULLY",
  "ERRORS_WHEN_LOGGING_OUT",
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
  "LIGHT",
  "DARK",
  "SYSTEM",
  "USER_AVATAR",
  "SETTINGS",
  "CHANGES_SAVED_SUCCESSFULLY",
  "FAILED_TO_SAVE_CHANGES",
  "PERSONAL_INFORMATION",
  "LOGIN_DETAILS",
  "SAVE",
  "CURRENT",
  "YOU_MUST_ENTER_YOUR_CURRENT_PASSWORD_TO_MAKE_CHANGES",
  "INCORRECT_CURRENT_PASSWORD",
  "ACCEPTABLE_IMAGE_FORMATS",
  "RESET",
  "INVALID_IMAGE_FORMAT_ONLY_FORMATS_ARE_ACCEPTED",
  "PLAY",
  "YOU_WON",
  "YOU_LOST",
  "THE_GAME_ENDED_IN_A_DRAW",
  "VICTORY",
  "DRAW",
  "DEFEAT",
  "PLAY_AGAIN",
  "GO_TO_THE_MAIN_PAGE",
  "GAME_CREATION",
  "CHANGING_GAME_SETTINGS",
  "APPLY",
  "SPECIFY_THE_DESIRED_GAME_PARAMETERS",
  "MY_PLAYER_ICON",
  "WHO_MAKES_THE_FIRST_MOVE",
  "TIME_PER_MOVE",
  "TIME_PER_PLAYER",
  "I",
  "OPPONENT",
  "SHOULD_BE_ONE_OF_OPTIONS",
  "OR",
  "CREATE",
  "NEXT_GAME_PARAMETERS",
  "CHANGE",
  "TIME_REMAINING",
  "I_HAVE",
  "OPPONENT_HAS",
  "S",
  "THE_GAME_STARTS_IN_N",
  "HISTORY_OF_COMPLETED_GAMES",
  "OPPONENT_PLAYER_ICON",
  "MOVES_FIRST",
  "RESULT",
  "N_IN_A_ROW",
  "TIME_IS_UP",
  "DURATION",
  "MUST_BE_A_NUMBER",
  "MUST_BE_GREATER_THAN_N",
  "MUST_BE_AT_LEAST_N",
  "SHOULD_NOT_EXCEED_N",
  "MUST_BE_LESS_THAN_N",
  "MUST_BE_A_MULTIPLE_OF_N",
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
      [TRANSLATION_KEYS.LOGOUT_COMPLETED_SUCCESSFULLY]: "logout completed successfully",
      [TRANSLATION_KEYS.ERRORS_WHEN_LOGGING_OUT]: "errors occurred while logging out",
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
      [TRANSLATION_KEYS.LIGHT]: "light",
      [TRANSLATION_KEYS.DARK]: "dark",
      [TRANSLATION_KEYS.SYSTEM]: "system",
      [TRANSLATION_KEYS.USER_AVATAR]: "user avatar",
      [TRANSLATION_KEYS.SETTINGS]: "settings",
      [TRANSLATION_KEYS.CHANGES_SAVED_SUCCESSFULLY]: "changes saved successfully",
      [TRANSLATION_KEYS.FAILED_TO_SAVE_CHANGES]: "failed to save changes",
      [TRANSLATION_KEYS.PERSONAL_INFORMATION]: "personal information",
      [TRANSLATION_KEYS.LOGIN_DETAILS]: "login details",
      [TRANSLATION_KEYS.SAVE]: "save",
      [TRANSLATION_KEYS.CURRENT]: "current",
      [TRANSLATION_KEYS.YOU_MUST_ENTER_YOUR_CURRENT_PASSWORD_TO_MAKE_CHANGES]:
        "you must enter your current password to make changes",
      [TRANSLATION_KEYS.INCORRECT_CURRENT_PASSWORD]: "incorrect current password",
      [TRANSLATION_KEYS.ACCEPTABLE_IMAGE_FORMATS]: "acceptable image formats",
      [TRANSLATION_KEYS.RESET]: "reset",
      [TRANSLATION_KEYS.INVALID_IMAGE_FORMAT_ONLY_FORMATS_ARE_ACCEPTED]:
        "invalid image format, only {{formats}} are accepted",
      [TRANSLATION_KEYS.PLAY]: "play",
      [TRANSLATION_KEYS.YOU_WON]: "you won",
      [TRANSLATION_KEYS.YOU_LOST]: "you lost",
      [TRANSLATION_KEYS.THE_GAME_ENDED_IN_A_DRAW]: "the game ended in a draw",
      [TRANSLATION_KEYS.VICTORY]: "victory",
      [TRANSLATION_KEYS.DRAW]: "draw",
      [TRANSLATION_KEYS.DEFEAT]: "defeat",
      [TRANSLATION_KEYS.PLAY_AGAIN]: "play again",
      [TRANSLATION_KEYS.GO_TO_THE_MAIN_PAGE]: "go to the main page",
      [TRANSLATION_KEYS.GAME_CREATION]: "game creation",
      [TRANSLATION_KEYS.CHANGING_GAME_SETTINGS]: "changing game settings",
      [TRANSLATION_KEYS.APPLY]: "apply",
      [TRANSLATION_KEYS.SPECIFY_THE_DESIRED_GAME_PARAMETERS]: "specify the desired game parameters",
      [TRANSLATION_KEYS.MY_PLAYER_ICON]: "my player icon",
      [TRANSLATION_KEYS.WHO_MAKES_THE_FIRST_MOVE]: "who makes the first move",
      [TRANSLATION_KEYS.TIME_PER_MOVE]: "time per move",
      [TRANSLATION_KEYS.TIME_PER_PLAYER]: "time per player",
      [TRANSLATION_KEYS.I]: "i",
      [TRANSLATION_KEYS.OPPONENT]: "opponent",
      [TRANSLATION_KEYS.SHOULD_BE_ONE_OF_OPTIONS]: "must be {{options}}",
      [TRANSLATION_KEYS.OR]: "or",
      [TRANSLATION_KEYS.CREATE]: "create",
      [TRANSLATION_KEYS.NEXT_GAME_PARAMETERS]: "next game parameters",
      [TRANSLATION_KEYS.CHANGE]: "change",
      [TRANSLATION_KEYS.TIME_REMAINING]: "time remaining",
      [TRANSLATION_KEYS.I_HAVE]: "i have",
      [TRANSLATION_KEYS.OPPONENT_HAS]: "opponent has",
      [TRANSLATION_KEYS.S]: "s",
      [TRANSLATION_KEYS.THE_GAME_STARTS_IN_N]: "the game starts in {{n}}",
      [TRANSLATION_KEYS.HISTORY_OF_COMPLETED_GAMES]: "history of completed games",
      [TRANSLATION_KEYS.OPPONENT_PLAYER_ICON]: "opponent player icon",
      [TRANSLATION_KEYS.MOVES_FIRST]: "moves first",
      [TRANSLATION_KEYS.RESULT]: "result",
      [TRANSLATION_KEYS.N_IN_A_ROW]: "{{n}} in a row",
      [TRANSLATION_KEYS.TIME_IS_UP]: "time is up",
      [TRANSLATION_KEYS.DURATION]: "duration",
      [TRANSLATION_KEYS.MUST_BE_A_NUMBER]: "must be a number",
      [TRANSLATION_KEYS.MUST_BE_GREATER_THAN_N]: "must be greater than {{n}}",
      [TRANSLATION_KEYS.MUST_BE_AT_LEAST_N]: "must be at least {{n}}",
      [TRANSLATION_KEYS.SHOULD_NOT_EXCEED_N]: "should not exceed {{n}}",
      [TRANSLATION_KEYS.MUST_BE_LESS_THAN_N]: "must be less than {{n}}",
      [TRANSLATION_KEYS.MUST_BE_A_MULTIPLE_OF_N]: "must be a multiple of {{n}}",
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
      [TRANSLATION_KEYS.LOGOUT_COMPLETED_SUCCESSFULLY]: "вихід із системи успішно завершено",
      [TRANSLATION_KEYS.ERRORS_WHEN_LOGGING_OUT]: "під час виходу виникли помилки",
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
      [TRANSLATION_KEYS.LIGHT]: "світла",
      [TRANSLATION_KEYS.DARK]: "темна",
      [TRANSLATION_KEYS.SYSTEM]: "системна",
      [TRANSLATION_KEYS.USER_AVATAR]: "аватар користувача",
      [TRANSLATION_KEYS.SETTINGS]: "налаштування",
      [TRANSLATION_KEYS.CHANGES_SAVED_SUCCESSFULLY]: "зміни успішно збережено",
      [TRANSLATION_KEYS.FAILED_TO_SAVE_CHANGES]: "не вдалося зберегти зміни",
      [TRANSLATION_KEYS.PERSONAL_INFORMATION]: "особиста інформація",
      [TRANSLATION_KEYS.LOGIN_DETAILS]: "дані для входу",
      [TRANSLATION_KEYS.SAVE]: "зберегти",
      [TRANSLATION_KEYS.CURRENT]: "поточний",
      [TRANSLATION_KEYS.YOU_MUST_ENTER_YOUR_CURRENT_PASSWORD_TO_MAKE_CHANGES]:
        "ви повинні ввести свій поточний пароль, щоб внести зміни",
      [TRANSLATION_KEYS.INCORRECT_CURRENT_PASSWORD]: "неправильний поточний пароль",
      [TRANSLATION_KEYS.ACCEPTABLE_IMAGE_FORMATS]: "прийнятні формати зображень",
      [TRANSLATION_KEYS.RESET]: "скинути",
      [TRANSLATION_KEYS.INVALID_IMAGE_FORMAT_ONLY_FORMATS_ARE_ACCEPTED]:
        "недійсний формат зображення, приймаються лише {{formats}}",
      [TRANSLATION_KEYS.PLAY]: "грати",
      [TRANSLATION_KEYS.YOU_WON]: "ви виграли",
      [TRANSLATION_KEYS.YOU_LOST]: "ви програли",
      [TRANSLATION_KEYS.THE_GAME_ENDED_IN_A_DRAW]: "гра завершилася нічиєю",
      [TRANSLATION_KEYS.VICTORY]: "перемога",
      [TRANSLATION_KEYS.DRAW]: "нічия",
      [TRANSLATION_KEYS.DEFEAT]: "поразка",
      [TRANSLATION_KEYS.PLAY_AGAIN]: "зіграти знову",
      [TRANSLATION_KEYS.GO_TO_THE_MAIN_PAGE]: "перейти на головну сторінку",
      [TRANSLATION_KEYS.GAME_CREATION]: "створення гри",
      [TRANSLATION_KEYS.CHANGING_GAME_SETTINGS]: "зміна налаштувань гри",
      [TRANSLATION_KEYS.APPLY]: "застосовувати",
      [TRANSLATION_KEYS.SPECIFY_THE_DESIRED_GAME_PARAMETERS]: "вкажіть бажані параметри гри",
      [TRANSLATION_KEYS.MY_PLAYER_ICON]: "значок мого гравця",
      [TRANSLATION_KEYS.WHO_MAKES_THE_FIRST_MOVE]: "хто робить перший крок",
      [TRANSLATION_KEYS.TIME_PER_MOVE]: "час на хід",
      [TRANSLATION_KEYS.TIME_PER_PLAYER]: "час на гравця",
      [TRANSLATION_KEYS.I]: "я",
      [TRANSLATION_KEYS.OPPONENT]: "опонент",
      [TRANSLATION_KEYS.SHOULD_BE_ONE_OF_OPTIONS]: "має бути {{options}}",
      [TRANSLATION_KEYS.OR]: "або",
      [TRANSLATION_KEYS.CREATE]: "створити",
      [TRANSLATION_KEYS.NEXT_GAME_PARAMETERS]: "параметри наступної гри",
      [TRANSLATION_KEYS.CHANGE]: "змінити",
      [TRANSLATION_KEYS.TIME_REMAINING]: "залишилось часу",
      [TRANSLATION_KEYS.I_HAVE]: "у мене",
      [TRANSLATION_KEYS.OPPONENT_HAS]: "у суперника",
      [TRANSLATION_KEYS.S]: "с",
      [TRANSLATION_KEYS.THE_GAME_STARTS_IN_N]: "гра починається через {{n}}",
      [TRANSLATION_KEYS.HISTORY_OF_COMPLETED_GAMES]: "історія завершених ігор",
      [TRANSLATION_KEYS.OPPONENT_PLAYER_ICON]: "значок гравця суперника",
      [TRANSLATION_KEYS.MOVES_FIRST]: "рухається першим",
      [TRANSLATION_KEYS.RESULT]: "результат",
      [TRANSLATION_KEYS.N_IN_A_ROW]: "{{n}} поспіль",
      [TRANSLATION_KEYS.TIME_IS_UP]: "час вийшов",
      [TRANSLATION_KEYS.DURATION]: "тривалість",
      [TRANSLATION_KEYS.MUST_BE_A_NUMBER]: "має бути числом",
      [TRANSLATION_KEYS.MUST_BE_GREATER_THAN_N]: "має бути більше ніж {{n}}",
      [TRANSLATION_KEYS.MUST_BE_AT_LEAST_N]: "має бути не менше {{n}}",
      [TRANSLATION_KEYS.SHOULD_NOT_EXCEED_N]: "не повинно перевищувати {{n}}",
      [TRANSLATION_KEYS.MUST_BE_LESS_THAN_N]: "має бути менше ніж {{n}}",
      [TRANSLATION_KEYS.MUST_BE_A_MULTIPLE_OF_N]: "має бути кратним {{n}}",
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
