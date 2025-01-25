import base from "@tic-tac-toe/lint-staged-config/base";
import { setUpTasksForTypescriptFiles } from "@tic-tac-toe/lint-staged-config/helpers";

export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    {
      glob: "src/**/*.{ts,mts,cts,tsx}",
      pathToConfigFile: "tsconfig.json",
    },
  ]),
};
