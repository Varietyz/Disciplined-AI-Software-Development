import type { Rule } from "eslint";
import { compareText } from "#core/comparators/text.comparator";
import { govlabMeta } from "#core/factories/eslint.factory";

const MIN_KEYS = 2;

type ObjExpr = Extract<Rule.Node, { type: "ObjectExpression" }>;
type ObjProp = ObjExpr["properties"][number];

const literalKey = function literalKey(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
        return String(value);
    }
    return "";
};

const staticKey = function staticKey(prop: ObjProp): string | null {
    if (prop.type !== "Property" || prop.computed) {
        return null;
    }
    const { key } = prop;
    if (key.type === "Identifier") {
        return key.name;
    }
    if (key.type === "Literal") {
        return literalKey(key.value);
    }
    return null;
};

const isClean = function isClean(context: Rule.RuleContext, obj: ObjExpr): boolean {
    for (const prop of obj.properties) {
        if (prop.type !== "Property" || prop.computed || prop.kind === "get" || prop.kind === "set") {
            return false;
        }
    }
    return context.sourceCode.getCommentsInside(obj).length === 0;
};

const reorderFix = function reorderFix(context: Rule.RuleContext, obj: ObjExpr) {
    return (fixer: Rule.RuleFixer): Rule.Fix[] => {
        const sorted = [...obj.properties].sort((a, b): number => {
            const ka = staticKey(a) ?? "";
            const kb = staticKey(b) ?? "";
            if (ka < kb) {
                return -1;
            }
            return ka > kb ? 1 : 0;
        });
        return obj.properties.map((prop, index): Rule.Fix =>
            fixer.replaceText(prop, context.sourceCode.getText(sorted[index])),
        );
    };
};

const reportUnsorted = function reportUnsorted(context: Rule.RuleContext, obj: ObjExpr, clean: boolean): void {
    let previous: string | null = null;
    let fixAttached = false;
    for (const prop of obj.properties) {
        const key = staticKey(prop);
        if (key === null) {
            previous = null;
        } else {
            if (previous !== null && compareText(key, previous) < 0) {
                context.report({
                    data: { key, prev: previous },
                    ...(clean && !fixAttached ? { fix: reorderFix(context, obj) } : {}),
                    messageId: "unsorted",
                    node: prop,
                });
                fixAttached = true;
            }
            previous = key;
        }
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onObject = (node: Rule.Node): void => {
            if (node.type !== "ObjectExpression" || node.properties.length < MIN_KEYS) {
                return;
            }
            reportUnsorted(context, node, isClean(context, node));
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["ObjectExpression", onObject]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["sort-order"],
        description:
            "Require object keys sorted ascending; auto-fixed for comment-free objects without spread/computed/accessor keys",
        fixable: "code",
        messages: { unsorted: "Object key '{{key}}' should sort before '{{prev}}'." },
        ruleId: "sort_keys",
        type: "suggestion",
    }),
} satisfies Rule.RuleModule;
