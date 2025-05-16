/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  plugins: ["prettier-plugin-jsdoc", "prettier-plugin-sql"],
  language: "postgresql",
  keywordCase: "upper",
  dataTypeCase: "upper",
  functionCase: "lower",
  identifierCase: "lower",
  overrides: [
    {
      files: "*.svg",
      options: {
        plugins: ["@prettier/plugin-xml"],
      },
    },
  ],
};

export default config;
