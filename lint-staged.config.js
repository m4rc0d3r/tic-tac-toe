/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html,css}": ["prettier --write"],
  "*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}": ["eslint --fix", "prettier --write"],
};

export default config;
