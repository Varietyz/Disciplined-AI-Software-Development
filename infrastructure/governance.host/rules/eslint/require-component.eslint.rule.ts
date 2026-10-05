import {
    FACTORY_OPTIONS_SCHEMA,
    RAW_ELEMENT_FACTORIES,
    declaredFactories,
} from "../../shared/allowlists/factory.allowlist.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    argumentAt,
    isType,
    literalString,
    nameOf,
    nodeAt,
    nodesAt,
    recordAt,
    stringIn,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const INTERACTIVE_TAGS = new Set(["button", "input", "select", "option", "textarea"]);

const COMPONENT_SUFFIX = concernSuffix("component");

const isComponentFile = function isComponentFile(filename: string): boolean {
    return basenameOf(filename).endsWith(COMPONENT_SUFFIX);
};

const isRawFactoryCall = function isRawFactoryCall(node: AstNode, factories: ReadonlySet<string>): boolean {
    const callee = nodeAt(node, "callee");
    return isType(callee, "Identifier") && factories.has(nameOf(callee));
};

const literalTag = function literalTag(node: AstNode): string | null {
    const first = argumentAt(node, 0);
    if (first === null) {
        return null;
    }
    const direct = literalString(first);
    if (direct !== null) {
        return direct;
    }
    if (first.type !== "TemplateLiteral" || nodesAt(first, "expressions").length > 0) {
        return null;
    }
    const [part] = nodesAt(first, "quasis");
    return part === undefined ? null : stringIn(recordAt(part, "value"), "cooked");
};

export default {
    create(context: RuleContext): RuleListener {
        const factories = declaredFactories(context, RAW_ELEMENT_FACTORIES);
        if (factories.size === 0 || isComponentFile(context.filename)) {
            return {};
        }
        return listener({
            callExpression(view, node) {
                if (!isRawFactoryCall(view, factories)) {
                    return;
                }
                const tag = literalTag(view);
                if (tag === null || !INTERACTIVE_TAGS.has(tag)) {
                    return;
                }
                context.report({ data: { tag }, messageId: "rawInteractiveTag", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:component-based-architecture"] }),
            description:
                "An interactive control is constructed through the component primitive that owns its shape, never from a raw element factory. The primitives are where accessible naming, keyboard behavior and consistent styling actually live, so a hand-rolled control silently ships without all three. Which functions count as raw element factories is DATA in the element-factory registry rather than a name written into this rule, so the rule is inert until a project declares one — and a shape no primitive covers is a new primitive, never a bypass.",
        },
        messages: {
            rawInteractiveTag:
                "Constructing `{{tag}}` from a raw element factory is banned outside the component layer. Build it through the component primitive that owns this control's shape; if no primitive covers it, add one so every caller inherits the accessible naming, keyboard behavior and styling that reaching past it would skip.",
        },
        schema: FACTORY_OPTIONS_SCHEMA,
        type: "problem",
    },
} satisfies LocalRule;
