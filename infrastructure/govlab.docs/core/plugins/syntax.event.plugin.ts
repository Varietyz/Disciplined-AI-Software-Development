import type { CalleeParts, Recognizer } from "#types/code.types";
import { hookLabel } from "#configuration/strings/graph.strings";
import ts from "typescript";

const LISTENER_METHOD = "addEventListener";
const SUBSCRIBE_METHODS: ReadonlySet<string> = new Set(["add", "on"]);
const EVENT_OWNERS: readonly string[] = ["event", "manager", "bus"];

const ownerName = function ownerName(target: ts.Expression): string {
    if (ts.isIdentifier(target)) {
        return target.text;
    }
    return ts.isPropertyAccessExpression(target) ? target.name.text : "";
};

const calleeParts = function calleeParts(node: ts.CallExpression): CalleeParts | null {
    if (!ts.isPropertyAccessExpression(node.expression)) {
        return null;
    }
    return { method: node.expression.name.text, owner: ownerName(node.expression.expression).toLowerCase() };
};

const isHookCall = function isHookCall(parts: CalleeParts): boolean {
    if (parts.method === LISTENER_METHOD) {
        return true;
    }
    return SUBSCRIBE_METHODS.has(parts.method) && EVENT_OWNERS.some((owner) => parts.owner.includes(owner));
};

const eventName = function eventName(node: ts.CallExpression, method: string): string {
    const [first] = node.arguments;
    return first && ts.isStringLiteralLike(first) ? first.text : method;
};

export const recognizer: Recognizer = {
    classify(node, context) {
        if (!ts.isCallExpression(node)) {
            return null;
        }
        const parts = calleeParts(node);
        if (parts === null || !isHookCall(parts)) {
            return null;
        }
        const event = eventName(node, parts.method);
        const id = context.mkNodeId(node);
        return {
            edges: [{ from: context.currentId, kind: "hook-register", label: event, to: id }],
            nodes: [{ id, kind: "hook", label: hookLabel(event), source: context.sourceOf(node) }],
        };
    },
    emits: { edges: ["hook-register"], nodes: ["hook"] },
    name: "event-hook",
};
