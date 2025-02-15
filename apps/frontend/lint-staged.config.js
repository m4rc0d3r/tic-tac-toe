import base from "@tic-tac-toe/lint-staged-config/base";
import { runEslint, runPrettier } from "@tic-tac-toe/lint-staged-config/commands";
import { JS_GLOB } from "@tic-tac-toe/lint-staged-config/globs";
import { setUpTasksForTypescriptFiles } from "@tic-tac-toe/lint-staged-config/helpers";

const STEIGER = "steiger";
const STEIGER_COMMAND = [STEIGER, "--fail-on-warnings src"].join(" ");

/** @type {import("lint-staged").Configuration} */
export default {
  ...base,
  [JS_GLOB]: (files) => {
    const listOfFiles = files.join(" ");
    return [STEIGER_COMMAND, runEslint(listOfFiles), runPrettier(listOfFiles)];
  },
  ...setUpTasksForTypescriptFiles([
    {
      glob: "src/**/*.{ts,mts,cts,tsx}",
      pathToConfigFile: "tsconfig.app.json",
      additionalTasks: {
        [STEIGER]: STEIGER_COMMAND,
      },
      sequenceOfExecution: [STEIGER],
    },
    {
      glob: "vite.config.ts",
      pathToConfigFile: "tsconfig.node.json",
    },
  ]),
};
