/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  plugins: ["prettier-plugin-jsdoc"],
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
