import { FOUNDATION_FOLDER, FOUNDATION_PREFIX, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, NodeHandler, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const ALLOWED_BUILTIN_BASES = new Set(["Error", "TypeError", "RangeError", "Map", "Set", "EventTarget", "Array"]);

const isFoundationFile = function isFoundationFile(filename: string): boolean {
    return normalizePath(filename).includes(FOUNDATION_FOLDER);
};

const extendedClassName = function extendedClassName(node: AstNode): string {
    const superClass = nodeAt(node, "superClass");
    if (superClass === null) {
        return "";
    }
    if (superClass.type === "Identifier") {
        return nameOf(superClass);
    }
    if (superClass.type !== "CallExpression") {
        return "";
    }
    const callee = nodeAt(superClass, "callee");
    return isType(callee, "Identifier") ? nameOf(callee) : "";
};

const isAllowedBase = function isAllowedBase(name: string): boolean {
    return name === "" || name.startsWith(FOUNDATION_PREFIX) || ALLOWED_BUILTIN_BASES.has(name);
};

export default {
    create(context: RuleContext): RuleListener {
        if (isFoundationFile(context.filename)) {
            return {};
        }
        const checkClass: NodeHandler = function checkClass(view, node) {
            if (nodeAt(view, "superClass") === null) {
                return;
            }
            const parent = extendedClassName(view);
            if (isAllowedBase(parent)) {
                return;
            }
            const id = nodeAt(view, "id");
            const child = id === null ? "<anonymous>" : nameOf(id);
            const payload = { child, parent };
            context.report({ data: payload, messageId: "businessInheritance", node });
        };
        return listener({ classDeclaration: checkClass, classExpression: checkClass });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:composition-over-inheritance"] }),
            description:
                "Bans `class X extends Y` where Y is neither a foundational base — a class whose name opens with the foundation prefix derived from the declared foundation subject — nor a language built-in. Business logic composes rather than inherits: the foundational contracts are the only legitimate extension targets, and everything else shares behavior through a registry, a factory or a service.",
        },
        messages: {
            businessInheritance:
                "`class {{ child }} extends {{ parent }}` — {{ parent }} is not a foundational base and not a language built-in. Behavior is shared by composition here: lift what is common into a registry, a factory or a service, or move {{ parent }} into a foundational folder if it genuinely is one. Inheritance for reuse couples the child to the parent's whole shape, including the parts it never wanted.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
