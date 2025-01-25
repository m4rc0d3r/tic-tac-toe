/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-clean-order/error"],
  rules: {
    "at-rule-no-deprecated": [
      true,
      {
        ignoreAtRules: ["apply"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "theme",
          "source",
          "utility",
          "variant",
          "custom-variant",
          "reference",
          "config",
          "plugin",
        ],
      },
    ],
    "declaration-property-value-no-unknown": [
      true,
      {
        ignoreProperties: {
          "/.+/": "/^(--spacing|theme)/",
        },
      },
    ],
    "import-notation": "string",
  },
};
