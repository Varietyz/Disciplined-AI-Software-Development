import type { Rule } from "eslint";

const MESSAGE =
    "Use string methods (indexOf, includes, startsWith, endsWith, split, replaceAll, charCodeAt) or " +
    "AST-based analysis instead of RegExp. Zero regex policy. [no_regex]";

const reportRegexpCall = function reportRegexpCall(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type !== "CallExpression") {
        return;
    }
    if (node.callee.type === "Identifier" && node.callee.name === "RegExp" && node.parent.type !== "NewExpression") {
        context.report({ messageId: "noRegExpFactory", node });
    }
};

const reportRegexLiteral = function reportRegexLiteral(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type === "Literal" && "regex" in node) {
        context.report({ messageId: "noRegexLiteral", node });
    }
};

const reportRegexpNew = function reportRegexpNew(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type === "NewExpression" && node.callee.type === "Identifier" && node.callee.name === "RegExp") {
        context.report({ messageId: "noRegExpConstructor", node });
    }
};

export default {
    create(context): Rule.RuleListener {
        const handlers: [string, (node: Rule.Node) => void][] = [
            [
                "CallExpression",
                (node): void => {
                    reportRegexpCall(context, node);
                },
            ],
            [
                "Literal",
                (node): void => {
                    reportRegexLiteral(context, node);
                },
            ],
            [
                "NewExpression",
                (node): void => {
                    reportRegexpNew(context, node);
                },
            ],
        ];
        return Object.fromEntries(handlers);
    },
    meta: {
        docs: { description: "Disallow all RegExp usage — enforce AST + token-based string processing" },
        messages: {
            noRegExpConstructor: `new RegExp() detected. ${MESSAGE}`,
            noRegExpFactory: `RegExp() factory detected. ${MESSAGE}`,
            noRegexLiteral: `Regex literal detected. ${MESSAGE}`,
        },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
