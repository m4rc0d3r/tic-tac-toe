import base from "@tic-tac-toe/lint-staged-config/base";
import { setUpTasksForTypescriptFiles } from "@tic-tac-toe/lint-staged-config/helpers";

export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    {
      glob: "src/**/*.{ts,mts,cts,tsx}",
      pathToConfigFile: "tsconfig.app.json",
    },
    {
      glob: "vite.config.ts",
      pathToConfigFile: "tsconfig.node.json",
    },
  ]),
};
