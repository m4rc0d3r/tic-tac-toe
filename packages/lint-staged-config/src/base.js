import { runEslint, runPrettier } from "./commands.js";

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html,css}": [runPrettier()],
  "*.{js,mjs,cjs,jsx}": [runEslint(), runPrettier()],
};

export default config;
