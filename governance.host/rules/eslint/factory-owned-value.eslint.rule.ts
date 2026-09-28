import type { LocalRule, RuleContext, RuleListener, RuleNode } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { FACTORY_OWNED_TYPES } from "../../shared/manifests/invariant.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const typeReferenceName = function typeReferenceName(annotation: AstNode | null): string {
    return isType(annotation, "TSTypeReference") ? nameOf(nodeAt(annotation, "typeName")) : "";
};

const declaredAt = function declaredAt(statement: AstNode): string[] {
    const inner = isType(statement, "ExportNamedDeclaration") ? nodeAt(statement, "declaration") : statement;
    if (isType(inner, "FunctionDeclaration")) {
        return [nameOf(nodeAt(inner, "id"))];
    }
    return nodesAt(inner, "declarations").map((declarator) => nameOf(nodeAt(declarator, "id")));
};

export default {
    create(context: RuleContext): RuleListener {
        const declared = new Set<string>();
        const check = function check(typeName: string, value: AstNode | null, raw: RuleNode): void {
            const factory = FACTORY_OWNED_TYPES.get(typeName);
            if (factory === undefined || !isType(value, "ObjectExpression") || declared.has(factory)) {
                return;
            }
            context.report({ data: { factory, type: typeName }, messageId: "literal", node: raw });
        };
        return listener({
            program(view) {
                for (const statement of nodesAt(view, "body")) {
                    for (const name of declaredAt(statement)) {
                        declared.add(name);
                    }
                }
            },
            tSAsExpression(view, raw) {
                check(typeReferenceName(nodeAt(view, "typeAnnotation")), nodeAt(view, "expression"), raw);
            },
            variableDeclarator(view, raw) {
                const annotation = nodeAt(nodeAt(nodeAt(view, "id"), "typeAnnotation"), "typeAnnotation");
                check(typeReferenceName(annotation), nodeAt(view, "init"), raw);
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:factory-pattern", "architecture:invariant"] }),
            description:
                "A value of a type whose invariants a factory owns is built through that factory. An object literal typed or cast as the type skips every check the factory runs, and the result looks valid until something downstream misreads it.",
        },
        messages: {
            literal:
                "A '{{type}}' value is built as an object literal. Build it with '{{factory}}(...)', which checks the invariants the literal skips.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
