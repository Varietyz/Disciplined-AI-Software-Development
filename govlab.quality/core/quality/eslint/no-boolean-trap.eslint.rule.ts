import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

const MIN_BOOL_TRAP = 2;

const isBooleanLiteral = function isBooleanLiteral(arg: { type: string; value?: unknown }): boolean {
    return arg.type === "Literal" && typeof arg.value === "boolean";
};

const booleanLiteralCount = function booleanLiteralCount(args: { type: string; value?: unknown }[]): number {
    let count = 0;
    for (const arg of args) {
        if (isBooleanLiteral(arg)) {
            count += 1;
        }
    }
    return count;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const check = (node: Rule.Node): void => {
            if (node.type !== "CallExpression" && node.type !== "NewExpression") {
                return;
            }
            const count = booleanLiteralCount(node.arguments);
            if (count >= MIN_BOOL_TRAP) {
                context.report({ data: { count: String(count) }, messageId: "booleanTrap", node });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["CallExpression", check],
            ["NewExpression", check],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["boolean-trap"],
        description:
            "Disallow a call or construction passing two or more boolean literal arguments — mandate a named options object",
        messages: {
            booleanTrap:
                "This passes {{count}} boolean literals positionally — a boolean trap: the call site cannot say what each flag means, and adding a flag shifts every position. Pass a single named options object ({ active: true, archived: false }) so each intent is labeled where it is set.",
        },
        ruleId: "boolean_trap",
    }),
} satisfies Rule.RuleModule;
