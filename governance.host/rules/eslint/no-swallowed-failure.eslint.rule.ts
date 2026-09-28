import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    argumentAt,
    calleeName,
    isType,
    nameOf,
    nodeAt,
    nodesAt,
    walk,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const HANDLER_TYPES: ReadonlySet<string> = new Set(["ArrowFunctionExpression", "FunctionExpression"]);
const REJECTION_SLOTS: ReadonlyMap<string, number> = new Map([
    ["catch", 0],
    ["then", 1],
]);

const throwsIn = function throwsIn(body: AstNode | null): boolean {
    let found = false;
    if (body !== null) {
        walk(body, (node) => {
            found ||= node.type === "ThrowStatement";
        });
    }
    return found;
};

const readsIn = function readsIn(body: AstNode | null, name: string): boolean {
    let found = false;
    if (body !== null) {
        walk(body, (node) => {
            found ||= isType(node, "Identifier") && nameOf(node) === name;
        });
    }
    return found;
};

const dropsFailure = function dropsFailure(binding: AstNode | null, body: AstNode | null): boolean {
    if (throwsIn(body)) {
        return false;
    }
    if (binding === null) {
        return true;
    }
    return isType(binding, "Identifier") && !readsIn(body, nameOf(binding));
};

const rejectionHandlerOf = function rejectionHandlerOf(call: AstNode): AstNode | null {
    const callee = nodeAt(call, "callee");
    const slot = REJECTION_SLOTS.get(calleeName(call));
    if (!isType(callee, "MemberExpression") || slot === undefined) {
        return null;
    }
    const handler = argumentAt(call, slot);
    return handler !== null && HANDLER_TYPES.has(handler.type) ? handler : null;
};

export default {
    create(context: RuleContext): RuleListener {
        return listener({
            callExpression(view, node) {
                const handler = rejectionHandlerOf(view);
                if (handler === null) {
                    return;
                }
                const [binding = null] = nodesAt(handler, "params");
                if (dropsFailure(binding, nodeAt(handler, "body"))) {
                    context.report({ messageId: "droppedRejection", node });
                }
            },
            catchClause(view, node) {
                if (dropsFailure(nodeAt(view, "param"), nodeAt(view, "body"))) {
                    context.report({ messageId: "droppedFailure", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:unobservable-failure"],
                enforces: ["architecture:error-handling"],
            }),
            description:
                "A caught failure is rethrown or used. A catch clause or rejection handler that neither throws nor reads what it caught turns a defect into silence, and silence cannot be fixed.",
        },
        messages: {
            droppedFailure:
                "This catch drops the failure it caught: it neither rethrows nor reads the error. Rethrow it with context, report it through the module's reporter with the error attached, or remove the catch so the failure surfaces.",
            droppedRejection:
                "This rejection handler drops the failure it received: it neither rethrows nor reads the reason. Take the reason as a parameter and report it with the error attached, rethrow it, or let the rejection propagate.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
