const { RuleTester } = require("eslint");
const rule = require("./enforce-where-clause");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
});

ruleTester.run(
  "enforce-where-clause", // rule name
  rule,
  {
    valid: [
      {
        code: "trx.updateTable('name').set({foo:bar}).where('something', '=', something).execute()",
      },
    ],
    invalid: [
      {
        code: "trx.updateTable('name').set({foo:bar}).execute()",
        errors: 1,
      },
    ],
  }
);

console.log("All tests passed!");
