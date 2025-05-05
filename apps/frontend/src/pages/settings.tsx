import { zodResolver } from "@hookform/resolvers/zod";
import {
  USER_AVATAR_MIME_TYPES,
  zUpdateCredentialsIn as zBaseUpdateCredentialsIn,
  zUpdatePersonalDataIn as zBaseUpdatePersonalDataIn,
} from "@tic-tac-toe/backend";
import {
  COMMA_WITH_SPACE,
  EMPTY_STRING,
  EXTENSIONS_BY_MIME_TYPE,
  isNullish,
  isZMimeTypeIssue,
  SPACE,
} from "@tic-tac-toe/core";
import type { Namespace, TFunction } from "i18next";
import { TrashIcon, UserIcon } from "lucide-react";
import { useRef } from "react";
import type { DefaultValues, FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { useAuthStore } from "~/entities/auth";
import type { TrpcErrorCause } from "~/shared/api";
import { trpc } from "~/shared/api";
import { createTsp, TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { listWithConjunction } from "~/shared/lib/text";
import { errorMapForForms } from "~/shared/lib/zod";
import { Button } from "~/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/shared/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/ui/form";
import { H1 } from "~/shared/ui/h1";
import { Input } from "~/shared/ui/input";
import { Separator } from "~/shared/ui/separator";

function composeErrorMessage<Ns extends Namespace, KPrefix>(
  t: TFunction<Ns, KPrefix>,
  cause: TrpcErrorCause = {
    area: "UNKNOWN",
  },
) {
  const tsp = createTsp(t);
  const { area, reason } = cause;

  return area === "BAD_REQUEST" && reason === "INCORRECT_PASSWORD"
    ? tsp(TRANSLATION_KEYS.INCORRECT_CURRENT_PASSWORD)
    : tsp(TRANSLATION_KEYS.UNEXPECTED_ERROR_OCCURRED);
}

function SettingsPage() {
  const {
    translation: { t },
    postproc: { tc, tsp },
  } = useTranslation2();

  const { mutate: updatePersonalData, isPending: isUpdatePersonalDataPending } =
    trpc.users.updatePersonalData.useMutation();
  const { mutate: updateCredentials, isPending: isUpdateCredentialsPending } =
    trpc.users.updateCredentials.useMutation();

  const me = useAuthStore.use.me();
  const updateMeLocally = useAuthStore.use.updateMe();

  const {
    nickname = EMPTY_STRING,
    firstName = EMPTY_STRING,
    lastName = EMPTY_STRING,
    avatar = EMPTY_STRING,
  } = me ?? {};
  const email = me?.registrationStatus === "FULL" ? me.email : EMPTY_STRING;

  const zUpdatePersonalDataIn = zfd.formData(zBaseUpdatePersonalDataIn.innerType().required());

  const updatePersonalDataForm = useForm<z.infer<typeof zUpdatePersonalDataIn>>({
    resolver: zodResolver(zUpdatePersonalDataIn, {
      errorMap: (issue, ctx) => {
        if (isZMimeTypeIssue(issue)) {
          const {
            params: { cause },
          } = issue;
          if (cause.code === z.ZodIssueCode.invalid_enum_value) {
            const { options } = cause;
            return {
              message: [
                tc(TRANSLATION_KEYS.INVALID_IMAGE_FORMAT_ONLY_FORMATS_ARE_ACCEPTED, {
                  formats: listWithConjunction(
                    options
                      .map((value) =>
                        (EXTENSIONS_BY_MIME_TYPE as Record<string, string>)[value.toString()]
                          ?.slice(1)
                          .toLocaleUpperCase(),
                      )
                      .filter((value) => value !== undefined),
                    t(TRANSLATION_KEYS.CONJUNCTION),
                  ),
                }),
              ].join(SPACE),
            };
          }
        }

        return errorMapForForms(t)(issue, ctx);
      },
    }),
    defaultValues: {
      nickname,
      firstName,
      lastName,
      avatar,
    },
  });

  const onSubmitPersonalData: Parameters<(typeof updatePersonalDataForm)["handleSubmit"]>[0] = (
    data,
  ) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (!isNullish(value)) {
        formData.set(key, value);
      }
    }

    updatePersonalData(formData as unknown as void, {
      onSuccess: (me) => {
        toast.success(tc(TRANSLATION_KEYS.CHANGES_SAVED_SUCCESSFULLY));
        updateMeLocally(me);
        updateDefaultValues(updatePersonalDataForm, me);
      },
      onError: (error) => {
        toast.error(tc(TRANSLATION_KEYS.FAILED_TO_SAVE_CHANGES), {
          description: composeErrorMessage(t, error.shape?.cause),
        });
      },
    });
  };

  const zUpdateCredentialsIn = zBaseUpdateCredentialsIn.extend({
    password: zfd.text(zBaseUpdateCredentialsIn.shape.password),
  });

  const updateCredentialsForm = useForm<z.infer<typeof zUpdateCredentialsIn>>({
    resolver: zodResolver(zUpdateCredentialsIn, {
      errorMap: errorMapForForms(t),
    }),
    defaultValues: {
      email,
      password: EMPTY_STRING,
      currentPassword: EMPTY_STRING,
    },
  });

  const onSubmitCredentials: Parameters<(typeof updateCredentialsForm)["handleSubmit"]>[0] = (
    data,
  ) => {
    updateCredentials(data, {
      onSuccess: (me) => {
        toast.success(tc(TRANSLATION_KEYS.CHANGES_SAVED_SUCCESSFULLY));
        updateMeLocally(me);
        updateDefaultValues(updateCredentialsForm, me);
      },
      onError: (error) => {
        toast.error(tc(TRANSLATION_KEYS.FAILED_TO_SAVE_CHANGES), {
          description: composeErrorMessage(t, error.shape?.cause),
        });
      },
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="2xs:items-stretch flex flex-grow flex-col items-center gap-4 overflow-auto p-4 sm:px-8 md:px-12 lg:px-24">
      <Card>
        <CardHeader>
          <CardTitle>
            <H1>{tc(TRANSLATION_KEYS.PERSONAL_INFORMATION)}</H1>
          </CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <Separator />
        </div>
        <CardContent>
          <Form {...updatePersonalDataForm}>
            <form
              onSubmit={(event) =>
                void updatePersonalDataForm.handleSubmit(onSubmitPersonalData)(event)
              }
              className="space-y-4"
            >
              <FormField
                control={updatePersonalDataForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="group relative place-self-center p-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="auto"
                        disabled={isUpdatePersonalDataPending}
                        className="rounded-full p-2"
                        onClick={() => inputRef.current?.click()}
                      >
                        {field.value ? (
                          <img
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt={tc(TRANSLATION_KEYS.USER_AVATAR)}
                            className="size-18 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="size-18" />
                        )}
                      </Button>
                      {field.value && (
                        <Button
                          variant="destructive"
                          className="absolute top-0 right-0 hidden rounded-full group-hover:inline-flex"
                          onClick={() => {
                            field.onChange(EMPTY_STRING);
                            if (inputRef.current) {
                              inputRef.current.value = EMPTY_STRING;
                            }
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      )}
                      <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept={Object.keys(USER_AVATAR_MIME_TYPES).join(COMMA_WITH_SPACE)}
                        disabled={isUpdatePersonalDataPending}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc(TRANSLATION_KEYS.NICKNAME)}</FormLabel>
                    <FormControl>
                      <Input disabled={isUpdatePersonalDataPending} {...field} />
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
                      <Input disabled={isUpdatePersonalDataPending} {...field} />
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
                      <Input disabled={isUpdatePersonalDataPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isUpdatePersonalDataPending}
                  onClick={() => updatePersonalDataForm.reset()}
                >
                  {tc(TRANSLATION_KEYS.RESET)}
                </Button>
                <Button disabled={isUpdatePersonalDataPending}>{tc(TRANSLATION_KEYS.SAVE)}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {me?.registrationStatus === "FULL" && (
        <Card>
          <CardHeader>
            <CardTitle>
              <H1>{tc(TRANSLATION_KEYS.LOGIN_DETAILS)}</H1>
            </CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <Separator />
          </div>
          <CardContent>
            <Form {...updateCredentialsForm}>
              <form
                onSubmit={(event) =>
                  void updateCredentialsForm.handleSubmit(onSubmitCredentials)(event)
                }
                className="space-y-4"
              >
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tc(TRANSLATION_KEYS.EMAIL)}</FormLabel>
                      <FormControl>
                        <Input disabled={isUpdateCredentialsPending} {...field} />
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
                        <Input type="password" disabled={isUpdateCredentialsPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {[tc(TRANSLATION_KEYS.CURRENT), t(TRANSLATION_KEYS.PASSWORD)].join(SPACE)}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" disabled={isUpdateCredentialsPending} {...field} />
                      </FormControl>
                      <FormDescription>
                        {tsp(TRANSLATION_KEYS.YOU_MUST_ENTER_YOUR_CURRENT_PASSWORD_TO_MAKE_CHANGES)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isUpdateCredentialsPending}
                    onClick={() => updateCredentialsForm.reset()}
                  >
                    {tc(TRANSLATION_KEYS.RESET)}
                  </Button>
                  <Button disabled={isUpdateCredentialsPending}>{tc(TRANSLATION_KEYS.SAVE)}</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function updateDefaultValues<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
  values: Extract<
    UseFormProps<TFieldValues, TContext>["defaultValues"],
    DefaultValues<TFieldValues>
  >,
) {
  const defaultValues = form.formState.defaultValues ?? {};

  const keys = Object.keys(defaultValues);

  if (keys.length === 0) {
    return;
  }

  const newValuesAsEntries = Object.entries(values).filter(([key]) => keys.includes(key));

  if (newValuesAsEntries.length === 0) {
    return;
  }

  const newValues = Object.fromEntries(newValuesAsEntries) as typeof values;

  const newDefaultValues = {
    ...defaultValues,
    ...newValues,
  };

  form.reset(newDefaultValues);
}

export { SettingsPage };
