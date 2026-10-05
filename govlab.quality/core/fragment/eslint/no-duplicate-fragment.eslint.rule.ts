import type { Rule, SourceCode } from "eslint";
import { fragmentObject, property, stringValue } from "#core/selectors/context.fragment.selector";
import { isDefineFragmentCall, isRuleNode } from "#core/predicates/context.fragment.predicate";

const WHITESPACE = new Set([" ", "\t", "\n", "\r"]);

const normalize = function normalize(text: string): string {
    let out = "";
    for (const ch of text) {
        if (!WHITESPACE.has(ch)) {
            out += ch;
        }
    }
    return out;
};

interface FragmentBody {
    body: Rule.Node;
    normalized: string;
    id: string;
}

const fragmentBody = function fragmentBody(node: Rule.Node, sourceCode: SourceCode): FragmentBody | null {
    if (!isDefineFragmentCall(node)) {
        return null;
    }
    const object = fragmentObject(node);
    const body = object === null ? null : property(object, "body");
    if (object === null || body === null || !isRuleNode(body)) {
        return null;
    }
    return {
        body,
        id: stringValue(property(object, "id")) ?? "(unnamed)",
        normalized: normalize(sourceCode.getText(body)),
    };
};

export default {
    create(context) {
        const { sourceCode } = context;
        const seen = new Map<string, string>();

        const onCall = function onCall(node: Rule.Node): void {
            const found = fragmentBody(node, sourceCode);
            if (found === null) {
                return;
            }
            const other = seen.get(found.normalized);
            if (typeof other === "string") {
                context.report({ data: { id: found.id, other }, messageId: "duplicate", node: found.body });
            } else {
                seen.set(found.normalized, found.id);
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["CallExpression", onCall]];
        return Object.fromEntries(handlers);
    },

    meta: {
        docs: { description: "Disallow two context fragments with identical (whitespace-normalized) bodies." },
        messages: {
            duplicate:
                "Fragment '{{id}}' has a body identical to '{{other}}'. Collapse the duplication into one fragment (share a param or gate one fragment on a condition). [no_duplicate_fragment]",
        },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
