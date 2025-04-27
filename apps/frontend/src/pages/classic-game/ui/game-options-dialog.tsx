import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MILLISECONDS_PER_SECOND, randomInt } from "@tic-tac-toe/core";
import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zfd } from "zod-form-data";

import type { GameOptions } from "./shared";
import {
  MAXIMUM_TIME_PER_MOVE,
  MAXIMUM_TIME_PER_PLAYER,
  MINIMUM_TIME_PER_MOVE,
  MINIMUM_TIME_PER_PLAYER,
  zGameOptions,
} from "./shared";

import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { errorMapForForms } from "~/shared/lib/zod";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/shared/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/shared/ui/form";
import { Input } from "~/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/ui/select";

const MINIMUM_TIME_PER_MOVE_IN_SECONDS = MINIMUM_TIME_PER_MOVE / MILLISECONDS_PER_SECOND;
const MINIMUM_TIME_PER_PLAYER_IN_SECONDS = MINIMUM_TIME_PER_PLAYER / MILLISECONDS_PER_SECOND;

const zTimeOption = z.enum(["ANY", "UNLIMITED", "SPECIFIC"]);

const zGameOptionsForm = zfd.formData({
  myPlayerIcon: z.enum([...zGameOptions.shape.myPlayerIcon.options, "ANY"]),
  whoMakesFirstMove: z.enum([...zGameOptions.shape.whoMakesFirstMove.options, "ANYONE"]),
  timePerMove: z.object({
    option: zTimeOption,
    specific: zfd.numeric(
      z
        .number()
        .step(0.1)
        .min(MINIMUM_TIME_PER_MOVE_IN_SECONDS)
        .max(MAXIMUM_TIME_PER_MOVE / MILLISECONDS_PER_SECOND)
        .transform((value) => (typeof value === "number" ? value * MILLISECONDS_PER_SECOND : value))
        .pipe(zGameOptions.shape.timePerMove),
    ),
  }),
  timePerPlayer: z.object({
    option: zTimeOption,
    specific: zfd.numeric(
      z
        .number()
        .step(0.1)
        .min(MINIMUM_TIME_PER_PLAYER_IN_SECONDS)
        .max(MAXIMUM_TIME_PER_PLAYER / MILLISECONDS_PER_SECOND)
        .transform((value) => (typeof value === "number" ? value * MILLISECONDS_PER_SECOND : value))
        .pipe(zGameOptions.shape.timePerPlayer),
    ),
  }),
});
type GameOptionsForm = z.infer<typeof zGameOptionsForm>;

type Props = ComponentProps<typeof Dialog> & {
  title?: string | undefined;
  description?: string | undefined;
  okButtonTitle?: string | undefined;
  initialValues?: Partial<GameOptions> | undefined;
  trigger?: ReactNode | undefined;
  onSubmit?: ((options: GameOptions) => void) | undefined;
};

function ClassicGameOptionsDialog({
  title,
  description,
  okButtonTitle,
  initialValues,
  trigger,
  onSubmit,
  ...props
}: Props) {
  const {
    translation: { t },
    postproc: { tc, tsp },
  } = useTranslation2();

  const form = useForm<GameOptionsForm>({
    resolver: zodResolver(zGameOptionsForm, {
      errorMap: errorMapForForms(t),
    }),
    defaultValues: {
      myPlayerIcon: "ANY",
      whoMakesFirstMove: "ANYONE",
      timePerMove: {
        option: "ANY",
        specific: MINIMUM_TIME_PER_MOVE_IN_SECONDS,
      },
      timePerPlayer: {
        option: "ANY",
        specific: MINIMUM_TIME_PER_PLAYER_IN_SECONDS,
      },
    },
  });

  const formId = useId();

  const handleSubmit: Parameters<(typeof form)["handleSubmit"]>[0] = ({
    myPlayerIcon,
    whoMakesFirstMove,
    timePerMove,
    timePerPlayer,
  }) => {
    const getRandomFromList = <T,>(values: T[]) => values[randomInt(0, values.length)]!;
    const getTime = (value: typeof timePerMove) =>
      value.option === "ANY"
        ? Math.round(randomInt(MINIMUM_TIME_PER_MOVE, MAXIMUM_TIME_PER_MOVE, true) / 100) * 100
        : value.option === "UNLIMITED"
          ? undefined
          : value.specific;

    const dataToSubmit: GameOptions = {
      myPlayerIcon:
        myPlayerIcon === "ANY"
          ? getRandomFromList(zGameOptions.shape.myPlayerIcon.options)
          : myPlayerIcon,
      whoMakesFirstMove:
        whoMakesFirstMove === "ANYONE"
          ? getRandomFromList(zGameOptions.shape.whoMakesFirstMove.options)
          : whoMakesFirstMove,
      timePerMove: getTime(timePerMove),
      timePerPlayer: getTime(timePerPlayer),
    };

    onSubmit?.(dataToSubmit);
  };

  return (
    <Dialog {...props}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="overflow-auto">
        <DialogHeader>
          <DialogTitle>{title ?? tc(TRANSLATION_KEYS.GAME_CREATION)}</DialogTitle>
          <DialogDescription>
            {description ?? tsp(TRANSLATION_KEYS.SPECIFY_THE_DESIRED_GAME_PARAMETERS)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}
            className="space-y-4"
          >
            {(
              [
                {
                  name: "myPlayerIcon",
                  label: tc(TRANSLATION_KEYS.MY_PLAYER_ICON),
                  values: Object.values(zGameOptionsForm.innerType().shape.myPlayerIcon.Values).map(
                    (value) => ({
                      value,
                      label: value === "ANY" ? tc(TRANSLATION_KEYS[value]) : value,
                    }),
                  ),
                },
                {
                  name: "whoMakesFirstMove",
                  label: tc(TRANSLATION_KEYS.WHO_MAKES_THE_FIRST_MOVE),
                  values: Object.values(
                    zGameOptionsForm.innerType().shape.whoMakesFirstMove.Values,
                  ).map((value) => ({
                    value,
                    label: tc(TRANSLATION_KEYS[value]),
                  })),
                },
              ] as const
            ).map(({ name, label, values }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {values.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {(
              [
                {
                  name: "timePerMove",
                  label: tc(TRANSLATION_KEYS.TIME_PER_MOVE),
                },
                {
                  name: "timePerPlayer",
                  label: tc(TRANSLATION_KEYS.TIME_PER_PLAYER),
                },
              ] as const
            ).map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select
                      value={field.value.option}
                      onValueChange={(value) => field.onChange({ ...field.value, option: value })}
                    >
                      <FormControl>
                        <div className="flex gap-2">
                          <SelectTrigger className="not-has-[+_*:last-of-type]:w-full">
                            <SelectValue />
                          </SelectTrigger>
                          {field.value.option === "SPECIFIC" && (
                            <Input
                              value={field.value.specific}
                              onChange={(event) =>
                                field.onChange({
                                  ...field.value,
                                  specific: event.target.value,
                                })
                              }
                            />
                          )}
                        </div>
                      </FormControl>
                      <SelectContent>
                        {Object.values(
                          zGameOptionsForm.innerType().shape[name].shape.option.Values,
                        ).map((value) => (
                          <SelectItem key={value} value={value}>
                            {tc(TRANSLATION_KEYS[value])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage fieldValue={field.value} subname="specific" />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => form.reset()}>
              {tc(TRANSLATION_KEYS.RESET)}
            </Button>
            <Button form={formId}>{okButtonTitle ?? tc(TRANSLATION_KEYS.CREATE)}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ClassicGameOptionsDialog };
