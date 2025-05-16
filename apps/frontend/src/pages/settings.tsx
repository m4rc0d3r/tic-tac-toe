import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@tic-tac-toe/backend";
import {
  USER_AVATAR_MIME_TYPES,
  zUpdateCredentialsIn as zBaseUpdateCredentialsIn,
  zUpdatePersonalDataIn as zBaseUpdatePersonalDataIn,
} from "@tic-tac-toe/backend";
import type { PageOptions } from "@tic-tac-toe/core";
import {
  capitalize,
  COLON_WITH_SPACE,
  COMMA_WITH_SPACE,
  EMPTY_STRING,
  EXTENSIONS_BY_MIME_TYPE,
  getFlagEmoji,
  isNullish,
  isTruthy,
  isZMimeTypeIssue,
  SPACE,
  zCommonDeviceType,
  zCommonOsName,
} from "@tic-tac-toe/core";
import { getQueryKey } from "@trpc/react-query";
import dayjs from "dayjs";
import dayjsPluginDuration from "dayjs/plugin/duration";
import type { Namespace, TFunction } from "i18next";
import { Ban, Monitor, Smartphone, Tablet, TrashIcon, UserIcon } from "lucide-react";
import type { ComponentProps, ComponentType } from "react";
import { useRef, useState } from "react";
import type { DefaultValues, FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { useAuthStore } from "~/entities/auth";
import type { TrpcErrorCause } from "~/shared/api";
import { trpc, useTrpcMutationState } from "~/shared/api";
import AndroidIcon from "~/shared/assets/android.svg?react";
import ChromeIcon from "~/shared/assets/chrome.svg?react";
import EdgeIcon from "~/shared/assets/edge.svg?react";
import FirefoxIcon from "~/shared/assets/firefox.svg?react";
import IosIcon from "~/shared/assets/ios.svg?react";
import LinuxIcon from "~/shared/assets/linux.svg?react";
import MacosIcon from "~/shared/assets/macos.svg?react";
import OperaIcon from "~/shared/assets/opera.svg?react";
import QuestionIcon from "~/shared/assets/question.svg?react";
import SafariIcon from "~/shared/assets/safari.svg?react";
import WindowsIcon from "~/shared/assets/windows.svg?react";
import {
  createTsp,
  formatDateTime,
  formatDuration,
  TRANSLATION_KEYS,
  useTranslation2,
} from "~/shared/i18n";
import { listWithConjunction } from "~/shared/lib/text";
import { errorMapForForms } from "~/shared/lib/zod";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/shared/ui/card";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "~/shared/ui/pagination";
import { SecretInput } from "~/shared/ui/secret-input";
import { Separator } from "~/shared/ui/separator";
import { Spinner } from "~/shared/ui/spinner";
import { cn } from "~/shared/ui/utils";

dayjs.extend(dayjsPluginDuration);

function composeErrorMessage<Ns extends Namespace, KPrefix>(
  t: TFunction<Ns, KPrefix>,
  language: string,
  cause: TrpcErrorCause = {
    area: "UNKNOWN",
  },
) {
  const tsp = createTsp(t);
  const { area, reason, explanation } = cause;

  if (area === "BAD_REQUEST") {
    if (reason === "INCORRECT_PASSWORD") {
      return tsp(TRANSLATION_KEYS.INCORRECT_CURRENT_PASSWORD);
    } else if (explanation.reason === "INITIATING_SESSION_IS_TOO_YOUNG") {
      const duration = dayjs.duration(
        new Date(explanation.whenItWillBePossible).getTime() - Date.now(),
      );
      return tsp(
        TRANSLATION_KEYS.YOUR_CURRENT_SESSION_WAS_RECENTLY_CREATED_THE_DELETE_FUNCTION_WILL_ONLY_BE_AVAILABLE,
        {
          when: formatDuration(language, {
            days: duration.days(),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
          }),
        },
      );
    }
  } else if (area === "AUTHENTICATION") {
    switch (reason) {
      case "NO_DATA":
      case "DATA_IS_MISSING_FROM_STORAGE":
        return tsp(TRANSLATION_KEYS.FAILED_TO_AUTHENTICATE_YOU);
      case "INCORRECT_DATA":
        return tsp(TRANSLATION_KEYS.YOUR_AUTHENTICATION_DATA_IS_CORRUPTED_OR_INCORRECT);
      case "DATA_IS_EXPIRED":
        return tsp(TRANSLATION_KEYS.YOUR_CURRENT_AUTHENTICATION_SESSION_HAS_ALREADY_EXPIRED);
    }
  } else if (area === "NOT_FOUND") {
    return tsp(TRANSLATION_KEYS.NO_SUCH_SESSION_EXISTS);
  }
  return tsp(TRANSLATION_KEYS.UNEXPECTED_ERROR_OCCURRED);
}

function SettingsPage() {
  const {
    translation: {
      t,
      i18n: { language },
    },
    postproc: { tc, tsp },
  } = useTranslation2();

  const queryClient = useQueryClient();

  const { mutate: updatePersonalData, isPending: isUpdatePersonalDataPending } =
    trpc.users.updatePersonalData.useMutation();
  const { mutate: updateCredentials, isPending: isUpdateCredentialsPending } =
    trpc.users.updateCredentials.useMutation();

  const deleteSessionProcedure = trpc.sessions.deleteOne;
  const { mutate: deleteSession } = deleteSessionProcedure.useMutation({
    onSuccess: (_data, variables) => {
      toast.success(tc(TRANSLATION_KEYS.SESSION_SUCCESSFULLY_TERMINATED));
      if (variables.id === mySessions?.data.find(({ isCurrent }) => isCurrent)?.id) {
        logoutLocally();
      } else {
        void queryClient.invalidateQueries({
          queryKey: getMySessionsQueryKey,
        });
      }
    },
    onError: (error) => {
      handleTrpcError(error, TRANSLATION_KEYS.FAILED_TO_TERMINATE_SESSION);
    },
  });
  const deletingSessionIds = useTrpcMutationState(deleteSessionProcedure, {
    filters: { status: "pending" },
    select: ({ state: { variables } }) => variables?.id,
  });

  const { mutate: deleteMySessions, isPending: isDeleteMySessionsPending } =
    trpc.sessions.deleteMySessions.useMutation();

  const [pageOptions, setPageOptions] = useState<PageOptions>({
    page: 1,
    take: 10,
  });

  const getMySessionsProcedure = trpc.sessions.getMySessions;
  const {
    data: mySessions,
    error: mySessionsError,
    isError: isMySessionsError,
    isPending: isMySessionsPending,
    isPlaceholderData: isMySessionsPlaceholder,
  } = getMySessionsProcedure.useQuery(pageOptions, {
    placeholderData: keepPreviousData,
  });
  const getMySessionsQueryKey = getQueryKey(getMySessionsProcedure, pageOptions);

  const me = useAuthStore.use.me();
  const updateMeLocally = useAuthStore.use.updateMe();
  const logoutLocally = useAuthStore.use.logout();

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
        handleTrpcError(error, TRANSLATION_KEYS.FAILED_TO_SAVE_CHANGES);
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
        handleTrpcError(error, TRANSLATION_KEYS.FAILED_TO_SAVE_CHANGES);
      },
    });
  };

  const handleSessionDelete = (id: Parameters<typeof deleteSession>[0]["id"]) => {
    deleteSession({ id });
  };

  const handleDeleteMySessions = () => {
    deleteMySessions(void 0, {
      onSuccess: () => {
        toast.success(tc(TRANSLATION_KEYS.SESSIONS_SUCCESSFULLY_TERMINATED));
        void queryClient.invalidateQueries({
          queryKey: getMySessionsQueryKey,
        });
      },
      onError: (error) => {
        handleTrpcError(error, TRANSLATION_KEYS.FAILED_TO_TERMINATE_SESSIONS);
      },
    });
  };

  const handleTrpcError = (
    error: { shape?: AppRouter["_def"]["_config"]["$types"]["errorShape"] | null | undefined },
    translationKey: keyof typeof TRANSLATION_KEYS,
  ) => {
    toast.error(tc(translationKey), {
      description: composeErrorMessage(t, language, error.shape?.cause),
    });
    if (error.shape?.cause.area === "AUTHENTICATION") {
      logoutLocally();
    }
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
                        <SecretInput
                          inputProps={{
                            disabled: isUpdateCredentialsPending,
                            ...field,
                          }}
                        />
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
                        <SecretInput
                          inputProps={{
                            disabled: isUpdateCredentialsPending,
                            ...field,
                          }}
                        />
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
      <Card>
        <CardHeader>
          <CardTitle>
            <H1>{tc(TRANSLATION_KEYS.ACTIVE_SESSIONS)}</H1>
          </CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <Separator />
        </div>
        <CardContent className="flex flex-col gap-2">
          <Button
            variant="destructive"
            disabled={isDeleteMySessionsPending}
            onClick={handleDeleteMySessions}
          >
            <Ban />
            {tc(TRANSLATION_KEYS.TERMINATE_ALL_OTHER_SESSIONS)}
          </Button>
          {isMySessionsPending ? (
            <div className="flex items-center justify-center">
              <Spinner className="size-16" />
            </div>
          ) : isMySessionsError ? (
            <p>{mySessionsError.message}</p>
          ) : (
            <>
              <div className="relative flex flex-col gap-2">
                {isMySessionsPlaceholder && (
                  <Spinner className="absolute top-1/2 left-1/2 size-16 -translate-1/2" />
                )}
                {mySessions.data.map((session) => {
                  const { id } = session;
                  return (
                    <SessionCard
                      key={id}
                      session={{ ...session, lastAccessedAt: new Date(session.lastAccessedAt) }}
                      isSessionBeingDeleted={deletingSessionIds.includes(id)}
                      onSessionDelete={() => handleSessionDelete(id)}
                    />
                  );
                })}
              </div>
              <Pagination
                total={mySessions.meta.numberOfItems}
                itemsPerPage={pageOptions.take}
                pageCount={mySessions.meta.numberOfPages}
                currentPage={pageOptions.page}
                onPageChange={(value) => {
                  if (value !== pageOptions.page) {
                    setPageOptions({
                      ...pageOptions,
                      page: value,
                    });
                  }
                }}
              >
                <PaginationContent
                  render={(pages, activePage) =>
                    pages.map((page, index) => (
                      <PaginationItem key={index}>
                        {page.type === "page" ? (
                          <PaginationLink page={page.value} isActive={page.value === activePage} />
                        ) : (
                          <PaginationEllipsis />
                        )}
                      </PaginationItem>
                    ))
                  }
                />
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type Session = Awaited<
  ReturnType<AppRouter["_def"]["procedures"]["sessions"]["getMySessions"]>
>["data"][number];
type SessionCardProps = ComponentProps<typeof Card> & {
  session: Session;
  isSessionBeingDeleted?: boolean | undefined;
  onSessionDelete?: (() => void) | undefined;
};
function SessionCard({
  session,
  isSessionBeingDeleted,
  onSessionDelete,
  ...props
}: SessionCardProps) {
  const {
    translation: {
      t,
      i18n: { language },
    },
    postproc: { tc },
  } = useTranslation2();

  const { ip, geolocation, device, os, browser, lastAccessedAt, isCurrent } = session;

  const ICONS_BY_COMMON_DEVICE_TYPE: Record<string, ComponentType> = {
    [zCommonDeviceType.Values.desktop]: Monitor,
    [zCommonDeviceType.Values.tablet]: ({ className, ...props }: ComponentProps<typeof Tablet>) => (
      <Tablet className={cn("-rotate-90", className)} {...props} />
    ),
    [zCommonDeviceType.Values.mobile]: Smartphone,
  };
  const ICONS_BY_COMMON_OPERATING_SYSTEMS: Record<string, ComponentType> = {
    [zCommonOsName.Values.Windows]: WindowsIcon,
    [zCommonOsName.Values.Linux]: LinuxIcon,
    [zCommonOsName.Values.macOS]: MacosIcon,
    [zCommonOsName.Values.Android]: AndroidIcon,
    [zCommonOsName.Values.iOS]: IosIcon,
  };

  const getIconByBrowser = (name: string) =>
    name.toLowerCase().includes("chrom")
      ? ChromeIcon
      : name.toLowerCase().includes("firefox")
        ? FirefoxIcon
        : name.toLowerCase().includes("opera")
          ? OperaIcon
          : name.toLowerCase().includes("edge")
            ? EdgeIcon
            : name.toLowerCase().includes("safari")
              ? SafariIcon
              : QuestionIcon;

  const DeviceTypeIcon = ICONS_BY_COMMON_DEVICE_TYPE[device?.type ?? EMPTY_STRING] ?? QuestionIcon;
  const OperatingSystemIcon =
    ICONS_BY_COMMON_OPERATING_SYSTEMS[os?.name ?? EMPTY_STRING] ?? QuestionIcon;
  const BrowserIcon = getIconByBrowser(browser?.name ?? EMPTY_STRING);

  const TITLE_PARTS = {
    device: [device?.vendor, device?.model].filter(isTruthy).join(SPACE),
    location: geolocation
      ? [getFlagEmoji(geolocation.country.code), geolocation.country.name, geolocation.city].join(
          SPACE,
        )
      : EMPTY_STRING,
  };

  const TRANSLATION_OF_KEYS_BY_TITLE_KEY: Record<
    keyof typeof TITLE_PARTS,
    keyof typeof TRANSLATION_KEYS
  > = {
    device: "THE_DEVICE_COULD_NOT_BE_RECOGNIZED",
    location: "LOCATION_COULD_NOT_BE_DETERMINED",
  };

  const title = Object.values(TITLE_PARTS).some(isTruthy)
    ? Object.entries(TITLE_PARTS)
        .toSorted(([, { length: a }], [, { length: b }]) => b - a)
        .map(([key, value]) => [
          key,
          value ||
            t(TRANSLATION_KEYS[TRANSLATION_OF_KEYS_BY_TITLE_KEY[key as keyof typeof TITLE_PARTS]]),
        ])
        .map(([, value]) => value)
        .join(COMMA_WITH_SPACE)
    : tc(TRANSLATION_KEYS.NEITHER_THE_DEVICE_NOR_THE_LOCATION_COULD_BE_DETERMINED);

  return (
    <Card {...props}>
      <CardHeader className="flex-grow flex-row justify-between p-4">
        <div
          className="m-auto"
          {...(device && {
            title: capitalize(device.type),
          })}
        >
          <DeviceTypeIcon className="size-16" />
        </div>
        <div className="flex-grow space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <p>
              {[tc(TRANSLATION_KEYS.IP_ADDRESS), ip ?? t(TRANSLATION_KEYS.NOT_RECOGNIZED)].join(
                COLON_WITH_SPACE,
              )}
            </p>
            <p className="flex items-center gap-1">
              {[
                tc(TRANSLATION_KEYS.OPERATING_SYSTEM),
                [os?.name, os?.version].filter(isTruthy).join(SPACE) ??
                  t(TRANSLATION_KEYS.NOT_RECOGNIZED),
              ].join(COLON_WITH_SPACE)}
              <OperatingSystemIcon className="size-6" />
            </p>
            <p className="flex items-center gap-1">
              {[
                tc(TRANSLATION_KEYS.BROWSER),
                [browser?.name, browser?.version].filter(isTruthy).join(SPACE) ??
                  t(TRANSLATION_KEYS.NOT_RECOGNIZED),
              ].join(COLON_WITH_SPACE)}
              <BrowserIcon className="size-6" />
            </p>
            <p>
              {[tc(TRANSLATION_KEYS.LAST_ACCESS), formatDateTime(language, lastAccessedAt)].join(
                COLON_WITH_SPACE,
              )}
            </p>
          </CardDescription>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button variant="destructive" disabled={isSessionBeingDeleted} onClick={onSessionDelete}>
            <Ban />
            {tc(TRANSLATION_KEYS.TERMINATE)}
          </Button>
          {isCurrent && <Badge variant="outline">{tc(TRANSLATION_KEYS.CURRENT_SESSION)}</Badge>}
        </div>
      </CardHeader>
    </Card>
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
