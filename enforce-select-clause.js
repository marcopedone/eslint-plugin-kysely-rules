module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensures that any select call chain also includes a 'select' or 'selectAll' clause.",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    const sourceCode = context.sourceCode;

    if (!/selectFrom/.test(sourceCode.text)) {
      // Skip
      return {};
    }

    return {
      ExpressionStatement(node) {
        evaluate(node.expression, sourceCode.getTokens(node));
      },
      AwaitExpression(node) {
        evaluate(node.argument, sourceCode.getTokens(node));
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

    function evaluate(expression, nodes) {
      if (!expression || expression.type !== "CallExpression") {
        return true;
      }

      const hasSelectFrom = hasMethodsInChain(expression, ["selectFrom"]);

      if (hasSelectFrom) {
        const hasSelect = hasMethodsInChain(expression, [
          "select",
          "selectAll",
        ]);

        if (!hasSelect) {
          let closingParenthesisNode = null;
          const selectNodeIndex = nodes.findIndex(
            (token) => token.value === "selectFrom",
          );
          if (selectNodeIndex !== -1) {
            closingParenthesisNode = nodes
              .slice(selectNodeIndex)
              .find((token) => token.value === ")");
          }
          const message = `Call chains containing "selectFrom" must also include a "select" or "selectAll" clause.`;
          context.report({
            node: expression,
            message,
            fix: (fixer) => {
              return fixer.insertTextAfter(
                closingParenthesisNode || nodes[6],
                ".selectAll()",
              );
            },
          });
        }
      }
    }
  },
};
