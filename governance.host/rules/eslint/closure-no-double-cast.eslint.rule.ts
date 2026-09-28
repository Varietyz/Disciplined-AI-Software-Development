import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const AS_EXPRESSIONS = new Set(["TSAsExpression", "AsExpression"]);
const EXEMPT_BASENAME_SUFFIXES = [".test.ts", ".spec.ts"];

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const isAsExpression = function isAsExpression(node: AstNode | null): boolean {
    return node !== null && AS_EXPRESSIONS.has(node.type);
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            tSAsExpression(view, node) {
                const inner = nodeAt(view, "expression");
                if (!isAsExpression(inner) || !isType(nodeAt(inner, "typeAnnotation"), "TSUnknownKeyword")) {
                    return;
                }
                context.report({ messageId: "doubleCast", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:type-safety"] }),
            description:
                "Bans `expr as unknown as Type` double-casts outside test files. A double cast asserts a relationship the checker refused to accept, so it silences the one signal that the producer's type and the consumer's expectation disagree. Fix the disagreement at its source: narrow what the producer returns, or widen the consumer's constraint so it accepts every variant it genuinely handles.",
        },
        messages: {
            doubleCast:
                "`as unknown as` double-cast bypasses type safety — the checker refused this relationship and the cast overrode it rather than resolving it. Narrow the producer's return type, or loosen the consumer's constraint so the variants it handles are expressible without an assertion. Test files exempt.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
