const enforceWhereClauseRule = require("eslint-plugin-kysely-rules/enforce-where-clause");
const enforceSelectClauseRule = require("eslint-plugin-kysely-rules/enforce-select-clause");

const plugin = {
  rules: {
    "enforce-where-clause": enforceWhereClauseRule,
    "enforce-select-clause": enforceSelectClauseRule,
  },
};
module.exports = plugin;
