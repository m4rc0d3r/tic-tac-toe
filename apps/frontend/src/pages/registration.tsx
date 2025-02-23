import { zodResolver } from "@hookform/resolvers/zod";
import { zRegisterIn } from "@tic-tac-toe/backend";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";

import { useAuthStore } from "~/entities/auth";
import type { TrpcErrorCause } from "~/shared/api";
import { trpc } from "~/shared/api";
import { listWithConjunction } from "~/shared/lib/text";
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
  const navigate = useNavigate();
  const { mutate: register, isPending: isRegistrationPending } = trpc.auth.register.useMutation();
  const loginLocally = useAuthStore.use.login();

  const form = useForm<z.infer<typeof zRegisterIn>>({
    resolver: zodResolver(zRegisterIn),
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
            <H1>Signing up</H1>
          </CardTitle>
          <CardDescription>
            <P>Create an account to get the ability to store your game history and more.</P>
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
                    <FormLabel>Nickname</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>First name</FormLabel>
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
                    <FormLabel>Last name</FormLabel>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={isRegistrationPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isRegistrationPending} className="w-full">
                Sign up
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="px-6">
          <Separator />
        </div>
        <CardFooter className="justify-center pt-6">
          <P>Do you already have an account?</P>&nbsp;
          <Link to={ROUTES.login} className="font-bold text-blue-700">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export { RegistrationPage };
