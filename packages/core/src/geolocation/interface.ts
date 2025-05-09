import type { either as e } from "fp-ts";
import { z } from "zod";

import type { OperationalErrorOptions } from "~/error-handling";
import { OperationalError } from "~/error-handling";

const MINIMUM_LATITUDE = -90;
const MAXIMUM_LATITUDE = 90;
const MINIMUM_LONGITUDE = -180;
const MAXIMUM_LONGITUDE = 180;

const zLatitude = z.number().min(MINIMUM_LATITUDE).max(MAXIMUM_LATITUDE);
type Latitude = z.infer<typeof zLatitude>;

const zLongitude = z.number().min(MINIMUM_LONGITUDE).lt(MAXIMUM_LONGITUDE);
type Longitude = z.infer<typeof zLongitude>;

const zGeocoordinates = z.object({
  latitude: zLatitude,
  longitude: zLongitude,
});
type Geocoordinates = z.infer<typeof zGeocoordinates>;

const zGeolocation = z.object({
  coordinates: zGeocoordinates,
  country: z.object({
    code: z.string(),
    name: z.string(),
  }),
  city: z.string(),
});
type Geolocation = z.infer<typeof zGeolocation>;

type GetGeolocationByIp = (ip: string) => Promise<e.Either<GeolocationByIpError, Geolocation>>;

const INVALID_IP = "INVALID_IP";
const RESERVED_RANGE = "RESERVED_RANGE";
const IP_NOT_FOUND = "IP_NOT_FOUND";
const UNKNOWN = "UNKNOWN";

const zReason = z.enum([INVALID_IP, RESERVED_RANGE, IP_NOT_FOUND, UNKNOWN]);
type Reason = z.infer<typeof zReason>;

class GeolocationByIpError extends OperationalError {
  constructor(
    readonly reason: Reason,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    switch (this.reason) {
      case INVALID_IP: {
        this.message = "The specified IP address does not match the IP format.";
        break;
      }
      case RESERVED_RANGE: {
        this.message = "The specified IP address belongs to a reserved range";
        break;
      }
      case IP_NOT_FOUND: {
        this.message = "The specified IP address was not found in the database.";
        break;
      }
      case UNKNOWN: {
        this.message = "An unexpected error occurred.";
        break;
      }
      default: {
        this.message = "Unable to obtain information for the specified IP.";
      }
    }
  }
}

export {
  GeolocationByIpError,
  MAXIMUM_LATITUDE,
  MAXIMUM_LONGITUDE,
  MINIMUM_LATITUDE,
  MINIMUM_LONGITUDE,
  zGeolocation,
  zReason as zGetGeolocationByIpErrorReason,
  zLatitude,
  zLongitude,
};
export type {
  Geocoordinates,
  Geolocation,
  GetGeolocationByIp,
  Reason as GetGeolocationByIpErrorReason,
  Latitude,
  Longitude,
};
