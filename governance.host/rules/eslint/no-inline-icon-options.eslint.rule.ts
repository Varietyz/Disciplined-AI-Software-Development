import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, literalString, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const ICON_SHAPE_KEYS = ["viewBox", "children"];

const EXEMPT_BASENAME_SUFFIXES = [concernSuffix("icons"), ".test.ts", ".spec.ts"];

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const propertyKeys = function propertyKeys(objectExpr: AstNode): Set<string> {
    const found = new Set<string>();
    for (const prop of nodesAt(objectExpr, "properties")) {
        if (prop.type !== "Property") {
            continue;
        }
        const key = nodeAt(prop, "key");
        const keyName = isType(key, "Identifier") ? nameOf(key) : literalString(key);
        if (keyName !== null && keyName !== "") {
            found.add(keyName);
        }
    }
    return found;
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            objectExpression(view, node) {
                const keys = propertyKeys(view);
                if (!ICON_SHAPE_KEYS.every((required) => keys.has(required))) {
                    return;
                }
                context.report({ messageId: "inlineIconOpts", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "An object literal carrying the structural signature of declarative asset data is banned outside the modules declared to hold it. Such data has a review axis of its own — whoever owns the asset set reviews it as a set, not scattered through the code that happens to consume each piece. This fires only where that shape actually occurs, so a project with no such assets never sees it. Tests and the declaring modules are exempt.",
        },
        messages: {
            inlineIconOpts:
                "An object literal here carries the structural signature of declarative asset data. Move it into the module declared for that concern and import it by name — the set is reviewed and audited as a set, which is impossible once its members are inlined at their call sites.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
