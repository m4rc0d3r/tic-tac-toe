import { z } from "zod";

const zCommonDeviceType = z.enum(["desktop", "tablet", "mobile"]);
const COMMON_DEVICE_TYPES = zCommonDeviceType.Values;
type CommonDeviceType = z.infer<typeof zCommonDeviceType>;

const zDevice = z.object({
  type: z.string(),
  vendor: z.string(),
  model: z.string(),
});
type Device = z.infer<typeof zDevice>;

const zCommonDesktopOsName = z.enum(["Windows", "Linux", "macOS"]);
const COMMON_DESKTOP_OS_NAMES = zCommonDesktopOsName.Values;
type CommonDesktopOsName = z.infer<typeof zCommonDesktopOsName>;

const zCommonMobileOsName = z.enum(["Android", "iOS"]);
const COMMON_MOBILE_OS_NAMES = zCommonMobileOsName.Values;
type CommonMobileOsName = z.infer<typeof zCommonMobileOsName>;

const zCommonOsName = z.enum([...zCommonDesktopOsName.options, ...zCommonMobileOsName.options]);
const COMMON_OS_NAMES = zCommonOsName.Values;
type CommonOsName = z.infer<typeof zCommonOsName>;

const zOs = z.object({
  name: z.string(),
  version: z.string(),
});
type Os = z.infer<typeof zOs>;

const zBrowser = z.object({
  name: z.string(),
  version: z.string(),
});
type Browser = z.infer<typeof zBrowser>;

const zTreeLikeParsedUserAgent = z.object({
  device: zDevice,
  os: zOs,
  browser: zBrowser,
});
type TreeLikeParsedUserAgent = z.infer<typeof zTreeLikeParsedUserAgent>;

const zFlatParsedUserAgent = z.object({
  deviceType: zDevice.shape.type,
  deviceVendor: zDevice.shape.vendor,
  deviceModel: zDevice.shape.model,
  osName: zOs.shape.name,
  osVersion: zOs.shape.version,
  browserName: zBrowser.shape.name,
  browserVersion: zBrowser.shape.version,
});
type FlatParsedUserAgent = z.infer<typeof zFlatParsedUserAgent>;

type UserAgentParserFunction = (userAgent: string) => TreeLikeParsedUserAgent;

function mapParsedUserAgent(userAgent: TreeLikeParsedUserAgent): FlatParsedUserAgent;
function mapParsedUserAgent(userAgent: FlatParsedUserAgent): TreeLikeParsedUserAgent;
function mapParsedUserAgent(
  userAgent: TreeLikeParsedUserAgent | FlatParsedUserAgent,
): FlatParsedUserAgent | TreeLikeParsedUserAgent {
  if ("device" in userAgent) {
    const { device, os, browser } = userAgent;
    return {
      deviceType: device.type,
      deviceVendor: device.vendor,
      deviceModel: device.model,
      osName: os.name,
      osVersion: os.version,
      browserName: browser.name,
      browserVersion: browser.version,
    };
  }

  const { deviceType, deviceVendor, deviceModel, osName, osVersion, browserName, browserVersion } =
    userAgent;
  return {
    device: {
      type: deviceType,
      vendor: deviceVendor,
      model: deviceModel,
    },
    os: {
      name: osName,
      version: osVersion,
    },
    browser: {
      name: browserName,
      version: browserVersion,
    },
  };
}

export {
  COMMON_DESKTOP_OS_NAMES,
  COMMON_DEVICE_TYPES,
  COMMON_MOBILE_OS_NAMES,
  COMMON_OS_NAMES,
  mapParsedUserAgent,
  zBrowser,
  zCommonDesktopOsName,
  zCommonDeviceType,
  zCommonMobileOsName,
  zCommonOsName,
  zDevice,
  zFlatParsedUserAgent,
  zOs,
  zTreeLikeParsedUserAgent,
};
export type {
  Browser,
  CommonDesktopOsName,
  CommonDeviceType,
  CommonMobileOsName,
  CommonOsName,
  Device,
  FlatParsedUserAgent,
  Os,
  TreeLikeParsedUserAgent,
  UserAgentParserFunction,
};
