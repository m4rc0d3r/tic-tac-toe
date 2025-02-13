import { runEslint, runPrettier, runStylelint, runSyncpackFormat } from "./commands.js";

/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{json,md,yaml,yml,html}": [runPrettier()],
  "*.css": [runStylelint(), runPrettier()],
  "*.{js,mjs,cjs,jsx}": [runEslint(), runPrettier()],
  "**/package.json": async (files) => [await runSyncpackFormat(files)],
};

export default config;
