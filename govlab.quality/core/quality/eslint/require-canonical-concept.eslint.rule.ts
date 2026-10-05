import type { Rule } from "eslint";

const MESSAGE =
    "govlabMeta() is missing '{{field}}'. Every @govlab/* rule must declare meta.docs.description and a non-empty " +
    "meta.docs.canonical (its shared quality concept) so the quality-relations ingest registers it with a concept — " +
    "a concept-less rule breaks the SSOT completeness gate. [require_canonical_concept]";

const SELECTORS = ["CallExpression"];

interface PropValue {
    type?: string;
    elements?: unknown[];
}

interface PropNode {
    type: string;
    key?: { type?: string; name?: string };
    value?: PropValue;
}

interface CallNode {
    type: string;
    callee?: { type?: string; name?: string };
    arguments?: { type?: string; properties?: PropNode[] }[];
}

const isCallNode = function isCallNode(node: unknown): node is CallNode {
    return node !== null && typeof node === "object" && "type" in node;
};

const propNamed = function propNamed(properties: PropNode[], name: string): PropNode | null {
    for (const prop of properties) {
        if (prop.type === "Property" && prop.key?.type === "Identifier" && prop.key.name === name) {
            return prop;
        }
    }
    return null;
};

const hasNonEmptyArray = function hasNonEmptyArray(prop: PropNode | null): boolean {
    return prop?.value?.type === "ArrayExpression" && (prop.value.elements?.length ?? 0) > 0;
};

const reportMissing = function reportMissing(context: Rule.RuleContext, node: Rule.Node, properties: PropNode[]): void {
    if (propNamed(properties, "description") === null) {
        context.report({ data: { field: "description" }, messageId: "missing", node });
    }
    if (!hasNonEmptyArray(propNamed(properties, "canonical"))) {
        context.report({ data: { field: "canonical" }, messageId: "missing", node });
    }
};

const onCall = function onCall(context: Rule.RuleContext, node: Rule.Node): void {
    const call: CallNode | null = isCallNode(node) ? node : null;
    if (call?.callee?.type !== "Identifier" || call.callee.name !== "govlabMeta") {
        return;
    }
    const arg = call.arguments?.[0];
    if (arg?.type !== "ObjectExpression") {
        return;
    }
    reportMissing(context, node, arg.properties ?? []);
};

export default {
    create(context): Rule.RuleListener {
        const listeners: Rule.RuleListener = {};
        for (const selector of SELECTORS) {
            listeners[selector] = (node: Rule.Node): void => {
                onCall(context, node);
            };
        }
        return listeners;
    },
    meta: {
        docs: {
            description: "Require meta.docs.description and a non-empty meta.docs.canonical on every govlabMeta rule",
        },
        messages: { missing: MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
