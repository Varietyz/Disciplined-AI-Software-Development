import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

type FnDecl = Extract<Rule.Node, { type: "FunctionDeclaration" }>;

const usedBeforeDefined = (context: Rule.RuleContext, node: FnDecl): boolean => {
    const declared = context.sourceCode.getDeclaredVariables(node).at(0);
    if (!declared) {
        return false;
    }
    const start = node.range?.[0] ?? 0;
    return declared.references.some((ref) => {
        const { range } = ref.identifier;
        return range ? range[0] < start : false;
    });
};

const isOverloadImplementation = (context: Rule.RuleContext, node: FnDecl): boolean => {
    const declared = context.sourceCode.getDeclaredVariables(node).at(0);
    return declared?.defs.some((def) => ["TSDeclareFunction"].includes(def.node.type)) === true;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onFunction = (node: Rule.Node): void => {
            if (node.type !== "FunctionDeclaration" || node.parent.type === "ExportDefaultDeclaration") {
                return;
            }
            if (isOverloadImplementation(context, node)) {
                return;
            }
            const name = context.sourceCode.getDeclaredVariables(node).at(0)?.name;
            const fix =
                typeof name === "string" && !usedBeforeDefined(context, node)
                    ? (fixer: Rule.RuleFixer): Rule.Fix =>
                          fixer.replaceText(node, `const ${name} = ${context.sourceCode.getText(node)};`)
                    : null;
            context.report({ ...(fix === null ? {} : { fix }), messageId: "expression", node });
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["FunctionDeclaration", onFunction]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["idiomatic-preference"],
        description: "Require a function expression over a function declaration",
        fixable: "code",
        messages: { expression: "Expected a function expression." },
        ruleId: "function_style",
        type: "suggestion",
    }),
} satisfies Rule.RuleModule;
