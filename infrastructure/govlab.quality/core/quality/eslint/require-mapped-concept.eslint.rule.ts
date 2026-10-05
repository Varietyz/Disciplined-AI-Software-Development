import type { Rule } from "eslint";
import { isRegisteredConcept } from "#configuration/quality/generated/canon.generated";

const MESSAGE =
    "Concept '{{concept}}' declared in a rule's canonical is not in the shared quality-relations concept registry. " +
    "Add it to the CONCEPTS registry (the single source) and run `npm run catalog:regenerate` — " +
    "the concept list this rule reads is regenerated from there. An island concept never joins the cross-ecosystem config surface. " +
    "[require_mapped_concept]";

interface ElementNode {
    type?: string;
    value?: unknown;
}

interface PropertyNode {
    type: string;
    key?: { type?: string; name?: string };
    value?: { type?: string; elements?: ElementNode[] };
}

const SELECTORS = ["Property"];

const isPropertyNode = function isPropertyNode(node: unknown): node is PropertyNode {
    return node !== null && typeof node === "object" && "type" in node;
};

const canonicalElements = function canonicalElements(prop: PropertyNode | null): ElementNode[] | null {
    if (prop?.key?.type !== "Identifier" || prop.key.name !== "canonical") {
        return null;
    }
    if (prop.value?.type !== "ArrayExpression") {
        return null;
    }
    return prop.value.elements ?? [];
};

const stringLiteral = function stringLiteral(element: ElementNode): string | null {
    return element.type === "Literal" && typeof element.value === "string" ? element.value : null;
};

const onProperty = function onProperty(context: Rule.RuleContext, node: Rule.Node): void {
    const elements = canonicalElements(isPropertyNode(node) ? node : null);
    if (elements === null) {
        return;
    }
    for (const element of elements) {
        const concept = stringLiteral(element);
        if (concept !== null && !isRegisteredConcept(concept)) {
            context.report({ data: { concept }, messageId: "unmapped", node });
        }
    }
};

export default {
    create(context): Rule.RuleListener {
        const listeners: Rule.RuleListener = {};
        for (const selector of SELECTORS) {
            listeners[selector] = (node: Rule.Node): void => {
                onProperty(context, node);
            };
        }
        return listeners;
    },
    meta: {
        docs: {
            description:
                "Require every rule's canonical concept(s) to be a first-class concept in the shared quality-relations registry",
        },
        messages: { unmapped: MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
