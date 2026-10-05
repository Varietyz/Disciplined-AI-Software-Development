import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { basenameOf, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { isType, nameOf, nodeAt, stringAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { opensWith } from "../../shared/manifests/verb.manifest.ts";

const EXEMPT_BASENAME_SUFFIXES = [".test.ts", ".spec.ts"];
const SHOW_VERBS = ["show"];
const NEGATED_OPERATORS = new Set(["!==", "!="]);
const DEFAULTING_OPERATORS = new Set(["??", "||"]);

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(normalizePath(filename));
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const isLiteralValue = function isLiteralValue(node: AstNode | null, value: boolean): boolean {
    return node?.type === "Literal" && node["value"] === value;
};

const flaggedName = function flaggedName(left: AstNode | null): string {
    if (!isType(left, "MemberExpression")) {
        return "";
    }
    const property = nodeAt(left, "property");
    if (!isType(property, "Identifier")) {
        return "";
    }
    const name = nameOf(property);
    return opensWith(name, SHOW_VERBS) ? name : "";
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            binaryExpression(view, node) {
                if (!NEGATED_OPERATORS.has(stringAt(view, "operator"))) {
                    return;
                }
                const name = flaggedName(nodeAt(view, "left"));
                if (name !== "" && isLiteralValue(nodeAt(view, "right"), false)) {
                    context.report({ data: { name }, messageId: "inversePolarity", node });
                }
            },
            logicalExpression(view, node) {
                if (!DEFAULTING_OPERATORS.has(stringAt(view, "operator"))) {
                    return;
                }
                const name = flaggedName(nodeAt(view, "left"));
                if (name !== "" && isLiteralValue(nodeAt(view, "right"), true)) {
                    context.report({ data: { name }, messageId: "inversePolarity", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:principle-of-least-surprise"] }),
            description:
                "`show*` flags must default to HIDE (reader uses `=== true`). Inverse polarity (`!== false`) defaults to SHOW, which is unsafe — adding a new field starts showing across every existing config that doesnt declare it. Either rename to `hide*` (matching the inverse polarity) or invert the reader to `=== true`.",
        },
        messages: {
            inversePolarity:
                "Reader for `{{ name }}` uses `!== false` (defaults to SHOW when undefined). `show*` flags must default to HIDE: use `=== true` (and treat undefined as `not set` = hide). If the field should default to SHOW, rename to `hide*` to match the polarity.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
