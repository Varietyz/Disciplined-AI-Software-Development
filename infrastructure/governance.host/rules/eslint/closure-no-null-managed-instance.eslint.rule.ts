import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { concernTags } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const pascal = function pascal(tag: string): string {
    return tag
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
};

const MANAGED_TYPE_SUFFIXES = concernTags().map(pascal);

const EXEMPT_BASENAME_SUFFIXES = [".test.ts", ".spec.ts"];

const basenameOf = function basenameOf(path: string): string {
    const norm = path.split("\\").join("/");
    const idx = norm.lastIndexOf("/");
    return idx === -1 ? norm : norm.slice(idx + 1);
};

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const endsWithManagedSuffix = function endsWithManagedSuffix(name: string): boolean {
    return MANAGED_TYPE_SUFFIXES.some((suffix) => name.endsWith(suffix));
};

const typeNameOf = function typeNameOf(typeAnnotation: AstNode | null): string {
    if (!isType(typeAnnotation, "TSTypeReference")) {
        return "";
    }
    const name = nodeAt(typeAnnotation, "typeName");
    if (isType(name, "Identifier")) {
        return nameOf(name);
    }
    return isType(name, "TSQualifiedName") ? nameOf(nodeAt(name, "right")) : "";
};

const isNullLiteral = function isNullLiteral(node: AstNode | null): boolean {
    return node?.type === "Literal" && node["value"] === null;
};

const nullCastTarget = function nullCastTarget(node: AstNode): string {
    if (node.type !== "TSAsExpression") {
        return "";
    }
    const typeName = typeNameOf(nodeAt(node, "typeAnnotation"));
    if (typeName === "" || !endsWithManagedSuffix(typeName)) {
        return "";
    }
    const inner = nodeAt(node, "expression");
    if (isNullLiteral(inner)) {
        return typeName;
    }
    if (!isType(inner, "TSAsExpression") || !isType(nodeAt(inner, "typeAnnotation"), "TSUnknownKeyword")) {
        return "";
    }
    return isNullLiteral(nodeAt(inner, "expression")) ? typeName : "";
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            tSAsExpression(view, node) {
                const typeName = nullCastTarget(view);
                if (typeName !== "") {
                    context.report({ data: { typeName }, messageId: "nullManaged", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:type-safety"] }),
            description:
                "Bans `null as <ManagedType>` and `null as unknown as <ManagedType>` injection. Null in place of a stateful collaborator guarantees a runtime crash the moment any method is called. Type the field as `<Type> | null` and check before access. Which type names count as managed is DERIVED from the declared concern tags, pascal-cased, so a concern added to the taxonomy is covered without a rule edit.",
        },
        messages: {
            nullManaged:
                "Injecting `null` typed as `{{ typeName }}` (a managed/stateful type) bypasses type safety AND will crash at first method call. Type the field as `{{ typeName }} | null` and check before access.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
