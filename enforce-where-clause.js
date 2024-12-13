module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensures that any call chain which affects a table also includes a 'where' clause.",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    const sourceCode = context.sourceCode;

    if (!/updateTable|deleteFrom/.test(sourceCode.text)) {
      // Skip
      return {};
    }

    return {
      ExpressionStatement(node) {
        evaluate(node.expression);
      },
      AwaitExpression(node) {
        evaluate(node.argument);
      },
    };

    function hasMethodsInChain(node, methodNames) {
      let current = node;
      let depth = 0;
      const maxDepth = 5;

      while (current && depth <= maxDepth) {
        if (
          current.type === "CallExpression" &&
          current.callee.type === "MemberExpression" &&
          methodNames.includes(current.callee.property.name)
        ) {
          return true;
        }
        if (current.callee && current.callee.object) {
          current = current.callee.object;
          depth += 1;
        } else {
          break;
        }
      }

      return false;
    }

    function evaluate(expression) {
      if (!expression || expression.type !== "CallExpression") {
        return true;
      }

      const hasUpdateOrDelete = hasMethodsInChain(expression, [
        "updateTable",
        "deleteFrom",
      ]);

      if (hasUpdateOrDelete) {
        const hasWhere = hasMethodsInChain(expression, ["where"]);

        if (!hasWhere) {
          const message = `Call chains containing "updateTable" or "deleteFrom" must also include a "where" clause.`;
          context.report({
            node: expression,
            message,
          });
        }
      }
    }
  },
};
