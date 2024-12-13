"use strict";

// Import the ESLint plugin locally
const eslintKysely = require("./eslint-plugin-kysely-rules");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
    },
    plugins: { "kysely-rules": eslintKysely },
    rules: {
      "kysely-rules/enforce-where-clause": "error",
      "kysely-rules/enforce-select-clause": "warn",
    },
  },
];
