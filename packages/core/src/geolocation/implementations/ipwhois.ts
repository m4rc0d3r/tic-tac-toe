import { either as e, function as f } from "fp-ts";
import { z } from "zod";

import type { Geolocation, GetGeolocationByIp, GetGeolocationByIpErrorReason } from "../interface";
import { GeolocationByIpError, zGeolocation, zGetGeolocationByIpErrorReason } from "../interface";

import { sendRequestAndProcessResponse } from "./shared";

const zSharedResponse = z.object({
  country: zGeolocation.shape.country.shape.name,
  country_code: zGeolocation.shape.country.shape.code,
  city: zGeolocation.shape.city,
  latitude: zGeolocation.shape.coordinates.shape.latitude,
  longitude: zGeolocation.shape.coordinates.shape.longitude,
});

const RESPONSE_DISCRIMINATOR_KEY = "success";

const zSuccessfulResponse = zSharedResponse.extend({
  [RESPONSE_DISCRIMINATOR_KEY]: z.literal(true),
});

const INVALID_IP_ADDRESS = "Invalid IP address";
const YOU_VE_HIT_THE_MONTHLY_LIMIT = "You've hit the monthly limit";
const RESERVED_RANGE = "Reserved range";

const zUnsuccessfulResponse = z.object({
  [RESPONSE_DISCRIMINATOR_KEY]: z.literal(false),
  message: z.enum([INVALID_IP_ADDRESS, YOU_VE_HIT_THE_MONTHLY_LIMIT, RESERVED_RANGE]),
});
type UnsuccessfulResponse = z.infer<typeof zUnsuccessfulResponse>;

const zResponse = z.discriminatedUnion(RESPONSE_DISCRIMINATOR_KEY, [
  zSuccessfulResponse,
  zUnsuccessfulResponse,
]);

const URL = "https://ipwho.is";

const ipWhoIs: GetGeolocationByIp = async (ip) => {
  return f.pipe(
    await sendRequestAndProcessResponse(URL, ip, zResponse),
    e.flatMap((response) => {
      const { success } = response;
      if (success) {
        const { success, country, country_code, latitude, longitude, ...rest } = response;
        return e.right({
          coordinates: {
            latitude,
            longitude,
          },
          country: {
            code: country_code,
            name: country,
          },
          ...rest,
        } satisfies Geolocation);
      } else {
        const { message } = response;

        const REASONS_BY_MESSAGES: Record<
          UnsuccessfulResponse["message"],
          GetGeolocationByIpErrorReason
        > = {
          [INVALID_IP_ADDRESS]: zGetGeolocationByIpErrorReason.Values.INVALID_IP,
          [YOU_VE_HIT_THE_MONTHLY_LIMIT]: zGetGeolocationByIpErrorReason.Values.UNKNOWN,
          [RESERVED_RANGE]: zGetGeolocationByIpErrorReason.Values.RESERVED_RANGE,
        };

        const reason = REASONS_BY_MESSAGES[message];

        const args: ConstructorParameters<typeof GeolocationByIpError> = reason
          ? [reason]
          : ["UNKNOWN", { cause: message }];

        return e.left(new GeolocationByIpError(...args));
      }
    }),
  );
};

export { ipWhoIs };
