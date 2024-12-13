# eslint-plugin-kysely-rules

eslint-plugin-kysely-rules is a fork of eslint-plugin-safe-kysely, it adds a new rule to enforce the use of a select clause in the call chain of the selectFrom method.
The original plugin can be found [here](https://www.npmjs.com/package/eslint-plugin-safe-kysely).
If the original plugin get published on github, additions like this one will be made to the original plugin.

eslint-plugin-safe-kysely is an ESLint plugin designed to enhance the safety of database operations in applications using Kysely. It ensures that any call chain containing updateTable or deleteFrom includes a where clause to prevent unintentional data modification or deletion of entire tables.

## Installation

1. Install ESLint (if not already installed):

```bash
npm install eslint --save-dev
```

2. Install eslint-plugin-kysely-rules:

```bash
npm install eslint-plugin-kysely-rules --save-dev
```

## Usage

Add eslint-plugin-kysely-rules to your ESLint configuration:

```json
{
  "plugins": ["kysely-rules"],
  "rules": {
    "kysely-rules/enforce-where-clause": "error",
    "kysely-rules/enforce-select-clause": "warn"
  }
}
```

## Rule: enforce-where-clause

This rule ensures that any updateTable or deleteFrom method calls are followed by a where clause in the call chain. This helps prevent unintended updates or deletions of all rows in a table.

### Example Code

#### Invalid

The following examples will trigger the enforce-where-clause rule:

```javascript
// Missing `where` clause with updateTable
trx.updateTable("table").execute();

// Missing `where` clause with deleteFrom
trx.deleteFrom("table").execute();

// Missing `where` in an async function
async function a(trx) {
  return await trx.updateTable("table").executeFirstOrThrow();
}
```

#### Valid

The following examples pass the enforce-where-clause rule:

```javascript
// Correct usage with where clause
trx
  .updateTable("table")
  .set({ foo: bar })
  .where("something", "=", something)
  .executeFirstOrThrow();

trx.updateTable("table").where({ foo: "bar" }).execute();

async function b(trx) {
  await trx.updateTable("table").where({ foo: bar }).executeFirstOrThrow();
}
```

## Rule: enforce-select-clause

This rule ensures that any selectFrom method calls are followed by a select clause in the call chain.

### Example Code

#### Invalid

The following examples will trigger the enforce-select-clause rule:

```javascript
// Missing `select` or `selectAll` clause with selectFrom
trx.selectFrom("table").execute();
```

#### Valid

The following examples pass the enforce-select-clause rule:

```javascript
// Correct usage with select clause
trx.selectFrom("table").select("field").where("field", "=", "value").execute();

async function b(trx) {
  await trx
    .selectFrom("table")
    .select("field")
    .where("field", "=", "value")
    .executeFirstOrThrow();
}
```
