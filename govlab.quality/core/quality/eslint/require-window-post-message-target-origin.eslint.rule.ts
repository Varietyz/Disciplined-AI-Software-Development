import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

const WINDOW_IDENTIFIERS = new Set(["window", "self", "parent", "top", "opener", "globalThis"]);
const WINDOW_MEMBER_PROPERTIES = new Set(["parent", "top", "opener", "self", "contentWindow"]);
const REQUIRED_ARGUMENT_COUNT = 2;

interface AstNode {
    type?: string;
    name?: string;
    value?: unknown;
    computed?: boolean;
    object?: AstNode;
    property?: AstNode;
    callee?: AstNode;
    arguments?: unknown[];
}

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object";
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

const isFramesAccess = function isFramesAccess(node: AstNode): boolean {
    if (node.type !== "MemberExpression" || node.computed !== true) {
        return false;
    }
    const base = node.object;
    if (base?.type === "Identifier" && base.name === "frames") {
        return true;
    }
    return base?.type === "MemberExpression" && base.property?.name === "frames";
};

const isWindowReceiver = function isWindowReceiver(node: AstNode | null): boolean {
    if (node === null) {
        return false;
    }
    if (node.type === "Identifier") {
        return typeof node.name === "string" && WINDOW_IDENTIFIERS.has(node.name);
    }
    if (node.type === "MemberExpression" && node.computed !== true) {
        return typeof node.property?.name === "string" && WINDOW_MEMBER_PROPERTIES.has(node.property.name);
    }
    return isFramesAccess(node);
};

const isPostMessageOnWindow = function isPostMessageOnWindow(call: ReturnType<typeof asNode>): boolean {
    const callee = asNode(call?.callee ?? null);
    if (callee?.type !== "MemberExpression" || callee.property?.name !== "postMessage") {
        return false;
    }
    return isWindowReceiver(asNode(callee.object ?? null));
};

const checkPostMessage = function checkPostMessage(context: Rule.RuleContext, node: Rule.Node): void {
    const call = asNode(node);
    if (!isPostMessageOnWindow(call)) {
        return;
    }
    const args = call?.arguments ?? [];
    if (args.length < REQUIRED_ARGUMENT_COUNT) {
        context.report({ messageId: "missingTargetOrigin", node });
        return;
    }
    const targetOrigin = asNode(args[1]);
    if (targetOrigin?.type === "Literal" && targetOrigin.value === "*") {
        context.report({ messageId: "wildcardTargetOrigin", node });
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        return Object.fromEntries([
            [
                "CallExpression",
                (node: Rule.Node): void => {
                    checkPostMessage(context, node);
                },
            ],
        ]);
    },
    meta: govlabMeta({
        canonical: ["input-validation"],
        description:
            "A cross-window postMessage (window/self/parent/top/opener/globalThis/contentWindow/frames[]) declares an explicit targetOrigin as its second argument — omitting it broadcasts the message to whatever origin the target window holds, so it can leak to an unintended origin; a same-realm channel (MessagePort/Worker/BroadcastChannel) whose second argument is a transfer list carries no origin and is never flagged",
        messages: {
            missingTargetOrigin:
                "Cross-window postMessage with no explicit targetOrigin. Pass the exact expected origin as the second argument so the message cannot leak to an unintended origin.",
            wildcardTargetOrigin:
                'Cross-window postMessage with a wildcard "*" targetOrigin — this delivers the message to whatever origin the target window currently holds. Replace "*" with the exact expected origin.',
        },
        ruleId: "require_window_post_message_target_origin",
    }),
} satisfies Rule.RuleModule;
