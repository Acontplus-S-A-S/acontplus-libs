module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    ignores: ["**/node_modules/*", "projects/**/node_modules/*"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "apm",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "apm",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    ignores: ["**/node_modules/*", "projects/**/node_modules/*"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
