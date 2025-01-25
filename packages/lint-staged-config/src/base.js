import { runEslint, runPrettier, runStylelint } from "./commands.js";

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html}": [runPrettier()],
  "*.css": [runStylelint(), runPrettier()],
  "*.{js,mjs,cjs,jsx}": [runEslint(), runPrettier()],
};

export default config;
