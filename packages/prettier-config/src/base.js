/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  plugins: ["prettier-plugin-jsdoc", "prettier-plugin-sql", "prettier-plugin-embed"],
  language: "postgresql",
  keywordCase: "upper",
  dataTypeCase: "upper",
  functionCase: "lower",
  identifierCase: "lower",
  embeddedSqlTags: [
    "this.prisma.$queryRaw",
    "this.prisma.$executeRaw",
    "tx.$queryRaw",
    "tx.$executeRaw",
  ],
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
