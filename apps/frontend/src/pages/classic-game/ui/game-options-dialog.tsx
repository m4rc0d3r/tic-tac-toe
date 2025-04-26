import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MILLISECONDS_PER_SECOND } from "@tic-tac-toe/core";
import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zfd } from "zod-form-data";

import type { GameOptions } from "./shared";
import {
  convertTimeToSeconds,
  DEFAULT_GAME_OPTIONS,
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

const zGameOptionsForm = zfd.formData(
  zGameOptions
    .pick({
      myPlayerIcon: true,
      whoMakesFirstMove: true,
    })
    .extend({
      timePerMove: zfd.numeric(
        z
          .number()
          .step(0.1)
          .min(MINIMUM_TIME_PER_MOVE_IN_SECONDS)
          .max(MAXIMUM_TIME_PER_MOVE / MILLISECONDS_PER_SECOND)
          .optional()
          .transform((value) =>
            typeof value === "number" ? value * MILLISECONDS_PER_SECOND : value,
          )
          .pipe(zGameOptions.shape.timePerMove),
      ),
      timePerPlayer: zfd.numeric(
        z
          .number()
          .step(0.1)
          .min(MINIMUM_TIME_PER_PLAYER_IN_SECONDS)
          .max(MAXIMUM_TIME_PER_PLAYER / MILLISECONDS_PER_SECOND)
          .optional()
          .transform((value) =>
            typeof value === "number" ? value * MILLISECONDS_PER_SECOND : value,
          )
          .pipe(zGameOptions.shape.timePerPlayer),
      ),
    }),
);
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
      ...DEFAULT_GAME_OPTIONS,
      ...convertTimeToSeconds(DEFAULT_GAME_OPTIONS),
      ...initialValues,
    },
  });

  const formId = useId();

  const handleSubmit: Parameters<(typeof form)["handleSubmit"]>[0] = (data) => {
    onSubmit?.(data);
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
            <FormField
              control={form.control}
              name="myPlayerIcon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc(TRANSLATION_KEYS.MY_PLAYER_ICON)}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(zGameOptions.shape.myPlayerIcon.Values).map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whoMakesFirstMove"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc(TRANSLATION_KEYS.WHO_MAKES_THE_FIRST_MOVE)}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(zGameOptions.shape.whoMakesFirstMove.Values).map((value) => (
                        <SelectItem key={value} value={value}>
                          {tc(TRANSLATION_KEYS[value])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="timePerMove"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc(TRANSLATION_KEYS.TIME_PER_MOVE)}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="timePerPlayer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc(TRANSLATION_KEYS.TIME_PER_PLAYER)}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
