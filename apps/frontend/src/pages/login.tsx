import { zodResolver } from "@hookform/resolvers/zod";
import { zLoginIn } from "@tic-tac-toe/backend";
import { EMPTY_STRING, QUESTION_MARK } from "@tic-tac-toe/core";
import type { Namespace, TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";

import { useAuthStore } from "~/entities/auth";
import type { TrpcErrorCause } from "~/shared/api";
import { trpc } from "~/shared/api";
import { createTsp, TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
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
import { P } from "~/shared/ui/p";
import { Separator } from "~/shared/ui/separator";

function composeErrorMessage<Ns extends Namespace, KPrefix>(
  t: TFunction<Ns, KPrefix>,
  cause: TrpcErrorCause = {
    area: "UNKNOWN",
  },
) {
  const tsp = createTsp(t);
  const { area } = cause;

  return area === "NOT_FOUND"
    ? tsp(TRANSLATION_KEYS.INCORRECT_EMAIL_ADDRESS_AND_OR_PASSWORD)
    : tsp(TRANSLATION_KEYS.UNEXPECTED_ERROR_OCCURRED);
}

function LoginPage() {
  const {
    translation: { t },
    postproc: { tc, ts, tsp },
  } = useTranslation2();

  const navigate = useNavigate();
  const { mutate: login, isPending: isLoginPending } = trpc.auth.login.useMutation();
  const loginLocally = useAuthStore.use.login();

  const form = useForm<z.infer<typeof zLoginIn>>({
    resolver: zodResolver(zLoginIn, {
      errorMap: errorMapForForms(t),
    }),
    defaultValues: {
      email: EMPTY_STRING,
      password: EMPTY_STRING,
    },
  });

  const onSubmit: Parameters<(typeof form)["handleSubmit"]>[0] = (data) => {
    login(data, {
      onSuccess: ({ accessToken, me }) => {
        toast.success(tc(TRANSLATION_KEYS.LOGIN_COMPLETED_SUCCESSFULLY));
        loginLocally(accessToken, me);
        void navigate(ROUTES.home);
      },
      onError: (error) => {
        toast.error(tc(TRANSLATION_KEYS.FAILED_TO_LOGIN), {
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
            <H1>{tc(TRANSLATION_KEYS.SIGNING_IN)}</H1>
          </CardTitle>
          <CardDescription>
            <P>
              {tsp(TRANSLATION_KEYS.SIGN_IN_TO_YOUR_ACCOUNT_TO_ACCESS_YOUR_GAME_HISTORY_AND_MORE)}
            </P>
          </CardDescription>
        </CardHeader>
        <div className="px-6">
          <Separator />
        </div>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
              className="space-y-4"
            >
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc(TRANSLATION_KEYS.EMAIL)}</FormLabel>
                    <FormControl>
                      <Input disabled={isLoginPending} {...field} />
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
                      <Input type="password" disabled={isLoginPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoginPending} className="w-full">
                {tc(TRANSLATION_KEYS.SIGN_IN)}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="px-6">
          <Separator />
        </div>
        <CardFooter className="justify-center pt-6">
          <P>{ts(QUESTION_MARK)(TRANSLATION_KEYS.DONT_HAVE_AN_ACCOUNT_YET)}</P>&nbsp;
          <Link to={ROUTES.registration} className="font-bold text-blue-700">
            {tc(TRANSLATION_KEYS.SIGN_UP)}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export { LoginPage };
