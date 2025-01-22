/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html,css,js,mjs,cjs,jsx,ts,mts,cts,tsx}": ["prettier --write"],
};

export default config;
