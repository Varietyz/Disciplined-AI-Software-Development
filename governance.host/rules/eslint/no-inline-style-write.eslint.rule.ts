import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { MODULE_OPTIONS_SCHEMA, declaredModules } from "../../shared/allowlists/factory.allowlist.ts";
import { argumentAt, isType, literalString, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const PRESENTATION_ACCESSORS = new Set(["style", "attributeStyleMap"]);
const DECLARATION_METHODS = new Set(["setProperty", "removeProperty", "set", "append", "delete", "clear"]);
const ATTRIBUTE_METHODS = new Set(["setAttribute", "setAttributeNS"]);
const PRESENTATION_ATTRIBUTE = "style";
const ATTRIBUTE_NAME_INDEX = new Map([
    ["setAttribute", 0],
    ["setAttributeNS", 1],
]);

const DECLARATION_MODULES: ReadonlySet<string> = new Set<string>();

const isPresentationAccessor = function isPresentationAccessor(node: AstNode | null): boolean {
    return isType(node, "MemberExpression") && PRESENTATION_ACCESSORS.has(nameOf(nodeAt(node, "property")));
};

const isPresentationTarget = function isPresentationTarget(node: AstNode | null): boolean {
    return isPresentationAccessor(node) || isPresentationAccessor(nodeAt(node, "object"));
};

const isDeclarationCall = function isDeclarationCall(node: AstNode): boolean {
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "MemberExpression") || !isPresentationAccessor(nodeAt(callee, "object"))) {
        return false;
    }
    return DECLARATION_METHODS.has(nameOf(nodeAt(callee, "property")));
};

const isPresentationAttributeCall = function isPresentationAttributeCall(node: AstNode): boolean {
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "MemberExpression")) {
        return false;
    }
    const method = nameOf(nodeAt(callee, "property"));
    if (!ATTRIBUTE_METHODS.has(method)) {
        return false;
    }
    const index = ATTRIBUTE_NAME_INDEX.get(method) ?? 0;
    return literalString(argumentAt(node, index)) === PRESENTATION_ATTRIBUTE;
};

export default {
    create(context: RuleContext): RuleListener {
        if (declaredModules(context, DECLARATION_MODULES).has(basenameOf(context.filename))) {
            return {};
        }
        return listener({
            assignmentExpression(view, node) {
                if (isPresentationTarget(nodeAt(view, "left"))) {
                    context.report({ messageId: "presentationWrite", node });
                }
            },
            callExpression(view, node) {
                if (isDeclarationCall(view)) {
                    context.report({ messageId: "presentationWrite", node });
                    return;
                }
                if (isPresentationAttributeCall(view)) {
                    context.report({ messageId: "presentationAttribute", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:secure-by-default"] }),
            description:
                "A presentation value written onto a node itself is refused by a deny-by-default content policy that admits stylesheets only, so the value silently never applies. Declarations belong in a stylesheet the policy admits; which module owns runtime declarations is DATA in the module registry, never a filename written into this rule.",
        },
        messages: {
            presentationAttribute:
                "Setting a node's presentation attribute is refused by a deny-by-default content policy, so the value never applies. Declare the value through the module that owns runtime declarations.",
            presentationWrite:
                "Writing a presentation value onto a node is refused by a deny-by-default content policy that admits stylesheets only, so the value never applies. Declare the value through the module that owns runtime declarations.",
        },
        schema: MODULE_OPTIONS_SCHEMA,
        type: "problem",
    },
} satisfies LocalRule;
