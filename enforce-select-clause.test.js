const { RuleTester } = require("eslint");
const rule = require("./enforce-select-clause");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
});

ruleTester.run(
  "enforce-select-clause", // rule name
  rule,
  {
    valid: [
      {
        code: "trx.selectFrom('name').select(['field']).where('something', '=', something).execute()",
      },
    ],
    invalid: [
      {
        code: "trx.selectFrom('name').where('something', '=', something).execute()",
        errors: 1,
        output: "trx.selectFrom('name').selectAll().where('something', '=', something).execute()",
      },
    ],
  }
);

console.log("All tests passed!");
