/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html,css}": ["prettier --write"],
  "*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}": [
    "eslint --fix --flag unstable_config_lookup_from_file",
    "prettier --write",
  ],
};

export default config;
