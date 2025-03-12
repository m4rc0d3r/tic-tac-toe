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

function capitalize<T extends string>(value: T): Capitalize<T> {
  return [value.at(0)?.toLocaleUpperCase(), value.slice(1)].join(EMPTY_STRING) as Capitalize<T>;
}

export {
  capitalize,
  COMMA,
  COMMA_WITH_SPACE,
  EMPTY_STRING,
  PERIOD,
  QUESTION_MARK,
  SPACE,
  UNDERSCORE,
};
export type { Comma, CommaWithSpace, EmptyString, Period, QuestionMark, Space, Underscore };
