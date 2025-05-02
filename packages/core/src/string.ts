const EMPTY_STRING = "";
type EmptyString = typeof EMPTY_STRING;

const SPACE = " ";
type Space = typeof SPACE;

const COMMA = ",";
type Comma = typeof COMMA;

const PERIOD = ".";
type Period = typeof PERIOD;

const UNDERSCORE = "_";
type Underscore = typeof UNDERSCORE;

const QUESTION_MARK = "?";
type QuestionMark = typeof QUESTION_MARK;

const COMMA_WITH_SPACE = `${COMMA}${SPACE}`;
type CommaWithSpace = typeof COMMA_WITH_SPACE;

const SLASH = "/";
type Slash = typeof SLASH;

function capitalize<T extends string>(value: T): Capitalize<T> {
  return [value.at(0)?.toLocaleUpperCase(), value.slice(1)].join(EMPTY_STRING) as Capitalize<T>;
}

const BITS_PER_CHARACTER_BASE64 = 6;
const BITS_PER_BYTE = 8;

function getNumberOfBytesToStoreBase64(length: number) {
  return (length * BITS_PER_CHARACTER_BASE64) / BITS_PER_BYTE;
}

export {
  BITS_PER_BYTE,
  BITS_PER_CHARACTER_BASE64,
  capitalize,
  COMMA,
  COMMA_WITH_SPACE,
  EMPTY_STRING,
  getNumberOfBytesToStoreBase64,
  PERIOD,
  QUESTION_MARK,
  SLASH,
  SPACE,
  UNDERSCORE,
};
export type { Comma, CommaWithSpace, EmptyString, Period, QuestionMark, Slash, Space, Underscore };
