import { zodResolver } from "@hookform/resolvers/zod";
import { zRegisterIn } from "@tic-tac-toe/backend";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";

import { useAuthStore } from "~/entities/auth";
import type { TrpcErrorCause } from "~/shared/api";
import { trpc } from "~/shared/api";
import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
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
import { P } from "~/shared/ui/p";
import { Separator } from "~/shared/ui/separator";

function composeErrorMessage(
  cause: TrpcErrorCause = {
    area: "UNKNOWN",
  },
) {
  const { area, paths } = cause;

  return area === "UNIQUE_KEY_VIOLATION"
    ? `The ${listWithConjunction(paths)} ${paths.length === 1 ? "is" : "are"} already taken by another user.`
    : "An unexpected error occurred.";
}

function RegistrationPage() {
  const {
    postproc: { tc, ts, tsp },
  } = useTranslation2();

  const navigate = useNavigate();
  const { mutate: register, isPending: isRegistrationPending } = trpc.auth.register.useMutation();
  const loginLocally = useAuthStore.use.login();

  const form = useForm<z.infer<typeof zRegisterIn>>({
    resolver: zodResolver(zRegisterIn, {
      errorMap: errorMapForForms,
    }),
    defaultValues: {
      email: "",
      nickname: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit: Parameters<(typeof form)["handleSubmit"]>[0] = (data) => {
    register(data, {
      onSuccess: ({ accessToken, me }) => {
        toast.success("Registration completed successfully.");
        loginLocally(accessToken, me);
        void navigate(ROUTES.home);
      },
      onError: (error) => {
        toast.error("Failed to register.", {
          description: composeErrorMessage(error.shape?.cause),
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
            <P>
              {tsp(
                TRANSLATION_KEYS.CREATE_ACCOUNT_TO_GET_THE_ABILITY_TO_STORE_YOUR_GAME_HISTORY_AND_MORE,
              )}
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
        <div className="px-6">
          <Separator />
        </div>
        <CardFooter className="justify-center pt-6">
          <P>{ts("?")(TRANSLATION_KEYS.DO_YOU_ALREADY_HAVE_ACCOUNT)}</P>&nbsp;
          <Link to={ROUTES.login} className="font-bold text-blue-700">
            {tc(TRANSLATION_KEYS.SIGN_IN)}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export { RegistrationPage };
