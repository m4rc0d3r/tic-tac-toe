import { either as e, function as f } from "fp-ts";
import { z } from "zod";

import type { Geolocation, GetGeolocationByIp } from "../interface";
import { GeolocationByIpError, zGeolocation } from "../interface";

import { sendRequestAndProcessResponse } from "./shared";

const zResponse = z.object({
  countryName: zGeolocation.shape.country.shape.name,
  countryCode: zGeolocation.shape.country.shape.code,
  cityName: zGeolocation.shape.city,
  latitude: zGeolocation.shape.coordinates.shape.latitude,
  longitude: zGeolocation.shape.coordinates.shape.longitude,
});

const URL = "https://freeipapi.com/api/json";

const freeIpApi: GetGeolocationByIp = async (ip) => {
  return f.pipe(
    await sendRequestAndProcessResponse(URL, ip, zResponse),
    e.flatMap((response) => {
      const { countryName, countryCode, latitude, longitude, cityName } = response;
      if (
        [latitude, longitude].every((value) => value === 0) &&
        [countryCode, countryName, cityName].every((value) => value === "-")
      ) {
        return e.left(new GeolocationByIpError("IP_NOT_FOUND"));
      } else {
        return e.right({
          coordinates: {
            latitude,
            longitude,
          },
          country: {
            code: countryCode,
            name: countryName,
          },
          city: cityName,
        } satisfies Geolocation);
      }
    }),
  );
};

export { freeIpApi };
