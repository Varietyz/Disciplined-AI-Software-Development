import { fragmentObject, property, stringValue } from "#core/selectors/context.fragment.selector";
import { isDefineFragmentCall, isRuleNode } from "#core/predicates/context.fragment.predicate";
import { isDigit, isLowerAlpha } from "@govlab/constants";
import type { AstNode } from "#types/context.types";
import type { Rule } from "eslint";

const COMPOUND_SEGMENTS = new Set(["and", "or"]);

const isKebabChar = function isKebabChar(ch: string): boolean {
    return isLowerAlpha(ch) || isDigit(ch) || ch === "-";
};

const isKebabCase = function isKebabCase(value: string): boolean {
    if (value.length === 0 || value.startsWith("-") || value.endsWith("-")) {
        return false;
    }
    for (const ch of value) {
        if (!isKebabChar(ch)) {
            return false;
        }
    }
    return true;
};

const hasCompoundSegment = function hasCompoundSegment(value: string): boolean {
    return value.split("-").some((segment) => COMPOUND_SEGMENTS.has(segment));
};

interface ConcernFinding {
    messageId: "compound" | "notKebab" | "notString";
    concern?: string;
    node: AstNode | null;
}

const concernFinding = function concernFinding(object: AstNode): ConcernFinding | null {
    const concernNode = property(object, "concern");
    const concern = stringValue(concernNode);
    if (concern === null) {
        return { messageId: "notString", node: concernNode };
    }
    if (!isKebabCase(concern)) {
        return { concern, messageId: "notKebab", node: concernNode };
    }
    if (hasCompoundSegment(concern)) {
        return { concern, messageId: "compound", node: concernNode };
    }
    return null;
};

export default {
    create(context) {
        const onCall = function onCall(node: Rule.Node): void {
            const object = isDefineFragmentCall(node) ? fragmentObject(node) : null;
            if (object === null) {
                return;
            }
            const finding = concernFinding(object);
            if (finding === null) {
                return;
            }
            const target = isRuleNode(finding.node) ? finding.node : node;
            const data = typeof finding.concern === "string" ? { concern: finding.concern } : {};
            context.report({ data, messageId: finding.messageId, node: target });
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["CallExpression", onCall]];
        return Object.fromEntries(handlers);
    },

    meta: {
        docs: {
            description: "A context fragment declares exactly one kebab-case concern; compound concerns must be split.",
        },
        messages: {
            compound:
                "Fragment concern '{{concern}}' names more than one concern. One concern per fragment — split it. [fragment_single_concern]",
            notKebab:
                "Fragment concern '{{concern}}' must be kebab-case (lowercase letters, digits, hyphens). [fragment_single_concern]",
            notString: "defineContextFragment 'concern' must be a kebab-case string literal. [fragment_single_concern]",
        },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
