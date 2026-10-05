import { asNode, identName } from "#core/selectors/syntax.selector";
import type { Rule } from "eslint";
import type { SyntaxNode } from "#types/syntax.types";
import { containsAny } from "#core/predicates/filename.predicate";
import { govlabMeta } from "#core/factories/eslint.factory";
import { inHostScope } from "#core/predicates/eslint.predicate";
import { isAlpha } from "@govlab/constants";

const EXCLUDED_FRAGMENTS = ["style-property-helpers.ts"] as const;
const ON_PREFIX_LENGTH = 2;
const ON_PREFIX = "on";

const isOnEventAttribute = function isOnEventAttribute(value: string): boolean {
    if (value.length <= ON_PREFIX_LENGTH) {
        return false;
    }
    if (value.slice(0, ON_PREFIX_LENGTH).toLowerCase() !== ON_PREFIX) {
        return false;
    }
    for (const ch of value.slice(ON_PREFIX_LENGTH)) {
        if (!isAlpha(ch)) {
            return false;
        }
    }
    return true;
};

const setAttributeName = function setAttributeName(call: SyntaxNode): string | null {
    const { callee } = call;
    if (callee?.type !== "MemberExpression" || identName(callee.property) !== "setAttribute") {
        return null;
    }
    const first = call.arguments?.[0];
    return first?.type === "Literal" && typeof first.value === "string" ? first.value : null;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        if (!inHostScope(context) || containsAny(context.filename, EXCLUDED_FRAGMENTS)) {
            return {};
        }
        const onCall = (node: Rule.Node): void => {
            const call = asNode(node);
            if (call === null) {
                return;
            }
            if (identName(call.callee) === "eval") {
                context.report({ messageId: "unsafeEval", node });
                return;
            }
            const attr = setAttributeName(call);
            if (attr !== null && isOnEventAttribute(attr)) {
                context.report({ data: { attr }, messageId: "inlineHandler", node });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["CallExpression", onCall]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["csp"],
        description: 'Forbid inline event handlers (setAttribute("on*", ...)) and eval under strict CSP',
        messages: {
            inlineHandler:
                'Inline event handler detected (setAttribute("{{attr}}", ...)). Bind via EventManager.on() or the DOMFactory Rich API — inline handlers violate strict CSP script-src.',
            unsafeEval:
                "unsafe-eval usage detected (eval(...)). Remove eval and use a safer construct — strict CSP forbids eval.",
        },
        ruleId: "no_inline_events",
    }),
} satisfies Rule.RuleModule;
