import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  },
  {
    ignores: ["**/dist"],
  },
  pluginJs.configs.recommended,
  {
    rules: {
      eqeqeq: "error",
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...tseslint.configs.disableTypeChecked,
  },
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "import/no-empty-named-blocks": "error",
      "import/no-absolute-path": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],
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
