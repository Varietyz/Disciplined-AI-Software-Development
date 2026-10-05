import type { LocalRule, RuleContext, RuleListener, RuleNode } from "../../types/rule.types.ts";
import { asNode, isType, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { VALIDATING_CLASSES } from "../../shared/manifests/invariant.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const isMethodCallOn = function isMethodCallOn(member: AstNode | null, object: AstNode, method: string): boolean {
    return (
        isType(member, "MemberExpression") &&
        nodeAt(member, "object") === object &&
        nameOf(nodeAt(member, "property")) === method &&
        isType(nodeAt(member, "parent"), "CallExpression")
    );
};

const bindingIsValidated = function bindingIsValidated(
    context: RuleContext,
    view: AstNode,
    raw: RuleNode,
    method: string,
): boolean {
    const declarator = nodeAt(view, "parent");
    if (!isType(declarator, "VariableDeclarator") || nodeAt(declarator, "init") !== view || raw.parent === null) {
        return false;
    }
    return context.sourceCode.getDeclaredVariables(raw.parent).some((variable) =>
        variable.references.some((reference) => {
            const identifier = asNode(reference.identifier);
            return identifier !== null && isMethodCallOn(nodeAt(identifier, "parent"), identifier, method);
        }),
    );
};

export default {
    create(context: RuleContext): RuleListener {
        return listener({
            newExpression(view, raw) {
                const method = VALIDATING_CLASSES.get(nameOf(nodeAt(view, "callee")));
                if (method === undefined) {
                    return;
                }
                if (
                    isMethodCallOn(nodeAt(view, "parent"), view, method) ||
                    bindingIsValidated(context, view, raw, method)
                ) {
                    return;
                }
                context.report({ data: { method }, messageId: "unvalidated", node: raw });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:invariant"] }),
            description:
                "An instance of a class that checks its invariants in a separate method is validated before it is used. Construction alone runs none of the checks, so an unvalidated instance is indistinguishable from a valid one until something downstream misreads it.",
        },
        messages: {
            unvalidated:
                "This instance is constructed without its validation method '{{method}}' running on it. Call '{{method}}()' on the new instance, chained or on the binding it is assigned to, before the instance leaves the construction site.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
