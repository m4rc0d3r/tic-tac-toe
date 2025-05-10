import { EMPTY_STRING } from "~/string";

const OFFSET = 127397;

function getFlagEmoji(countryCode: string) {
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split(EMPTY_STRING)
      .map((value) => OFFSET + value.charCodeAt(0)),
  );
}

export { getFlagEmoji };
