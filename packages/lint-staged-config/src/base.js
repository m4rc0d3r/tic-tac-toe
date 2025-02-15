import { runEslint, runPrettier, runStylelint, runSyncpackFormat } from "./commands.js";
import { JS_GLOB } from "./globs.js";

/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{json,md,yaml,yml,html}": [runPrettier()],
  "*.css": [runStylelint(), runPrettier()],
  [JS_GLOB]: [runEslint(), runPrettier()],
  "**/package.json": async (files) => [await runSyncpackFormat(files)],
};

export default config;
