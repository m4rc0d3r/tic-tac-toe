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

const MIME_TYPES = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
} as const;
type MimeType = (typeof MIME_TYPES)[keyof typeof MIME_TYPES];

export {
  COMMA,
  COMMA_WITH_SPACE,
  EMPTY_STRING,
  MIME_TYPES,
  PERIOD,
  QUESTION_MARK,
  SPACE,
  UNDERSCORE,
};
export type {
  Comma,
  CommaWithSpace,
  EmptyString,
  MimeType,
  Period,
  QuestionMark,
  Space,
  Underscore,
};
