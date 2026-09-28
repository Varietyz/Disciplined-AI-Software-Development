import {
    ELEMENT_FACTORY_MODULES,
    MODULE_OPTIONS_SCHEMA,
    declaredModules,
} from "../../shared/allowlists/factory.allowlist.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt, stringAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const DOCUMENT_OBJECT = "document";
const CREATE_METHODS = new Set(["createElement", "createElementNS"]);
const MARKUP_PROPERTY = "innerHTML";
const MARKUP_PARSERS = new Set(["DOMParser", "JSDOM"]);
const ASSIGN_OPERATORS = new Set(["=", "+="]);

const isDocumentCreateElement = function isDocumentCreateElement(node: AstNode): boolean {
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "MemberExpression")) {
        return false;
    }
    const object = nodeAt(callee, "object");
    if (!isType(object, "Identifier") || nameOf(object) !== DOCUMENT_OBJECT) {
        return false;
    }
    const property = nodeAt(callee, "property");
    return isType(property, "Identifier") && CREATE_METHODS.has(nameOf(property));
};

const isMarkupParser = function isMarkupParser(node: AstNode): boolean {
    const callee = nodeAt(node, "callee");
    return isType(callee, "Identifier") && MARKUP_PARSERS.has(nameOf(callee));
};

const isMarkupAssignment = function isMarkupAssignment(node: AstNode): boolean {
    if (!ASSIGN_OPERATORS.has(stringAt(node, "operator"))) {
        return false;
    }
    const left = nodeAt(node, "left");
    if (!isType(left, "MemberExpression")) {
        return false;
    }
    const property = nodeAt(left, "property");
    return isType(property, "Identifier") && nameOf(property) === MARKUP_PROPERTY;
};

export default {
    create(context: RuleContext): RuleListener {
        if (declaredModules(context, ELEMENT_FACTORY_MODULES).has(basenameOf(context.filename))) {
            return {};
        }
        return listener({
            assignmentExpression(view, node) {
                if (isMarkupAssignment(view)) {
                    context.report({ messageId: "innerHtmlAssignment", node });
                }
            },
            callExpression(view, node) {
                if (isDocumentCreateElement(view)) {
                    context.report({ messageId: "rawCreateElement", node });
                }
            },
            newExpression(view, node) {
                if (isMarkupParser(view)) {
                    context.report({ messageId: "rawMarkupParser", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:factory-pattern"] }),
            description:
                "Element construction goes through the one factory module that owns it; the raw platform primitives are banned everywhere else. Which module owns construction is DATA in the element-factory registry, never a filename written into this rule.",
        },
        messages: {
            innerHtmlAssignment:
                "Assigning parsed markup to a live node is banned. Construct the children through the element factory and attach them structurally.",
            rawCreateElement:
                "The raw element-creation primitive is banned outside the factory module that owns it. Construct through the factory.",
            rawMarkupParser:
                "Parsing markup into nodes is banned outside the module that owns it, which also releases every document it parses. Ask that module for the parsed element or document.",
        },
        schema: MODULE_OPTIONS_SCHEMA,
        type: "problem",
    },
} satisfies LocalRule;
