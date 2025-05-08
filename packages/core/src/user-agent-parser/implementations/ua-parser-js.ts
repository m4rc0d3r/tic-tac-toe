import { UAParser } from "ua-parser-js";

import type { UserAgentParserFunction } from "../interface";
import { COMMON_DESKTOP_OS_NAMES, COMMON_DEVICE_TYPES, mapParsedUserAgent } from "../interface";

import { EMPTY_STRING } from "~/string";

const uaParserJs: UserAgentParserFunction = (userAgent: string) => {
  const { device, os, browser } = UAParser(userAgent);

  const osName = os.name ?? EMPTY_STRING;
  const osVersion = os.version ?? EMPTY_STRING;

  const deviceType =
    typeof device.type === "string"
      ? device.type
      : Object.keys(COMMON_DESKTOP_OS_NAMES).includes(osName)
        ? COMMON_DEVICE_TYPES.desktop
        : EMPTY_STRING;
  const deviceVendor = device.vendor ?? EMPTY_STRING;
  const deviceModel = device.model ?? EMPTY_STRING;

  const browserName = browser.name ?? EMPTY_STRING;
  const browserVersion = browser.version ?? EMPTY_STRING;

  return mapParsedUserAgent({
    deviceType,
    deviceVendor,
    deviceModel,
    osName,
    osVersion,
    browserName,
    browserVersion,
  });
};

export { uaParserJs };
