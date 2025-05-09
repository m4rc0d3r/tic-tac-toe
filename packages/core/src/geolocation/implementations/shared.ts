import axios from "axios";
import { either as e, function as f, taskEither as te } from "fp-ts";
import { z } from "zod";

import { GeolocationByIpError } from "../interface";

import { SLASH } from "~/string";

async function sendRequestAndProcessResponse<T extends z.ZodSchema>(
  url: string,
  ip: string,
  responseSchema: T,
) {
  const { success, error } = z.string().ip().safeParse(ip);
  return success
    ? f.pipe(
        await te.tryCatch(
          () => axios.get([url, ip].join(SLASH)),
          (reason) =>
            new GeolocationByIpError("UNKNOWN", {
              cause: reason,
            }),
        )(),
        e.map(({ data }) => responseSchema.safeParse(data)),
        e.flatMap(({ success, data, error }) =>
          success
            ? e.right(data as z.infer<T>)
            : e.left(
                new GeolocationByIpError("UNKNOWN", {
                  cause: error,
                }),
              ),
        ),
      )
    : e.left(new GeolocationByIpError("INVALID_IP", { cause: error }));
}

export { sendRequestAndProcessResponse };
