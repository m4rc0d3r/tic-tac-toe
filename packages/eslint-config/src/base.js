import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  },
  {
    ignores: ["**/dist"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "import/no-empty-named-blocks": "error",
      "import/no-absolute-path": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/exports-last": "error",
      "import/first": "error",
      "import/group-exports": "error",
      "import/newline-after-import": "error",
      "import/no-named-default": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
        },
      ],
    },
  },
  prettierConfig,
];
