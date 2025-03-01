import { zodResolver } from "@hookform/resolvers/zod";
import { zRegisterIn } from "@tic-tac-toe/backend";
import { EMPTY_STRING, QUESTION_MARK } from "@tic-tac-toe/core";
import type { Namespace, TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";

import { useAuthStore } from "~/entities/auth";
import type { TrpcErrorCause } from "~/shared/api";
import { trpc } from "~/shared/api";
import { createTsp, GENDERS, TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { listWithConjunction } from "~/shared/lib/text";
import { errorMapForForms } from "~/shared/lib/zod";
import { ROUTES } from "~/shared/routing";
import { Button } from "~/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/shared/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/shared/ui/form";
import { H1 } from "~/shared/ui/h1";
import { Input } from "~/shared/ui/input";
import { Link2 } from "~/shared/ui/link2";
import { P } from "~/shared/ui/p";
import { Separator } from "~/shared/ui/separator";

function composeErrorMessage<Ns extends Namespace, KPrefix>(
  t: TFunction<Ns, KPrefix>,
  cause: TrpcErrorCause = {
    area: "UNKNOWN",
  },
) {
  const tsp = createTsp(t);
  const { area, paths } = cause;

  if (area === "UNIQUE_KEY_VIOLATION") {
    const CONTEXT_BY_FIELD_NAME: Record<string, string> = {
      email: GENDERS.female,
      nickname: GENDERS.male,
    };
    const translatedPaths = paths.map((path) => t(path.toLocaleUpperCase()));
    const data = listWithConjunction(translatedPaths, t(TRANSLATION_KEYS.CONJUNCTION));
    const count = paths.length;

    if (count > 1) {
      return tsp(TRANSLATION_KEYS.DATA_ALREADY_USED_BY_ANOTHER_USER, {
        data,
        count,
      });
    }
    return tsp(TRANSLATION_KEYS.DATA_ALREADY_USED_BY_ANOTHER_USER, {
      data,
      context: CONTEXT_BY_FIELD_NAME[paths[0]],
      count,
    });
  }

  return tsp(TRANSLATION_KEYS.UNEXPECTED_ERROR_OCCURRED);
}

function RegistrationPage() {
  const {
    translation: { t },
    postproc: { tc, ts, tsp },
  } = useTranslation2();

  const navigate = useNavigate();
  const { mutate: register, isPending: isRegistrationPending } = trpc.auth.register.useMutation();
  const loginLocally = useAuthStore.use.login();

  const form = useForm<z.infer<typeof zRegisterIn>>({
    resolver: zodResolver(zRegisterIn, {
      errorMap: errorMapForForms(t),
    }),
    defaultValues: {
      email: EMPTY_STRING,
      nickname: EMPTY_STRING,
      firstName: EMPTY_STRING,
      lastName: EMPTY_STRING,
      password: EMPTY_STRING,
    },
  });

  const onSubmit: Parameters<(typeof form)["handleSubmit"]>[0] = (data) => {
    register(data, {
      onSuccess: ({ accessToken, me }) => {
        toast.success(tc(TRANSLATION_KEYS.REGISTRATION_SUCCESSFULLY_COMPLETED));
        loginLocally(accessToken, me);
        void navigate(ROUTES.home);
      },
      onError: (error) => {
        toast.error(tc(TRANSLATION_KEYS.FAILED_TO_REGISTER), {
          description: composeErrorMessage(t, error.shape?.cause),
        });
      },
    });
  };

  return (
    <div className="flex h-full">
      <Card className="m-auto border-none shadow-none">
        <CardHeader className="items-center">
          <CardTitle>
            <H1>{tc(TRANSLATION_KEYS.SIGNING_UP)}</H1>
          </CardTitle>
          <CardDescription>
            <P className="text-center">
              {tsp(
                TRANSLATION_KEYS.CREATE_ACCOUNT_TO_GET_THE_ABILITY_TO_STORE_YOUR_GAME_HISTORY_AND_MORE,
              )}
            </P>
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <Separator />
        </div>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
              className="space-y-4"
            >
              <FormField
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc(TRANSLATION_KEYS.NICKNAME)}</FormLabel>
                    <FormControl>
                      <Input disabled={isRegistrationPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc(TRANSLATION_KEYS.EMAIL)}</FormLabel>
                    <FormControl>
                      <Input disabled={isRegistrationPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc(TRANSLATION_KEYS.FIRST_NAME)}</FormLabel>
                    <FormControl>
                      <Input disabled={isRegistrationPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc(TRANSLATION_KEYS.LAST_NAME)}</FormLabel>
                    <FormControl>
                      <Input disabled={isRegistrationPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc(TRANSLATION_KEYS.PASSWORD)}</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={isRegistrationPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isRegistrationPending} className="w-full">
                {tc(TRANSLATION_KEYS.SIGN_UP)}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="px-6 pb-6">
          <Separator />
        </div>
        <CardFooter className="justify-center">
          <P>
            {ts(QUESTION_MARK)(TRANSLATION_KEYS.DO_YOU_ALREADY_HAVE_ACCOUNT)}&nbsp;
            <Link2 to={ROUTES.login}>{tc(TRANSLATION_KEYS.SIGN_IN)}</Link2>
          </P>
        </CardFooter>
      </Card>
    </div>
  );
}

export { RegistrationPage };
