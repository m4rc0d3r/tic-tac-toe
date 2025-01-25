import base from "@tic-tac-toe/prettier-config/base";

/**
 * @type {import("prettier").Config}
 */
export default {
  ...base,
  plugins: ["prettier-plugin-tailwindcss"],
};
