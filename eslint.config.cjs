const { configs: reactRecommended } = require("eslint-plugin-react");
const { configs: jsxA11yRecommended } = require("eslint-plugin-jsx-a11y");
const { configs: importRecommended } = require("eslint-plugin-import");
const { configs: reactHooksRecommended } = require("eslint-plugin-react-hooks");
const prettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: ["node_modules/**", "build/**", "dist/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        React: true,
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "jsx-a11y": require("eslint-plugin-jsx-a11y"),
      import: require("eslint-plugin-import"),
      "react-hooks": require("eslint-plugin-react-hooks"),
    },
    rules: {},
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactRecommended.recommended,
  jsxA11yRecommended.recommended,
  importRecommended.recommended,
  reactHooksRecommended.recommended,
  prettier,
];
