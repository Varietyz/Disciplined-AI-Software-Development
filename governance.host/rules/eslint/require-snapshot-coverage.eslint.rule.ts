import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, literalString, locOf, nameOf, nodeAt, nodesAt, walk } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { SNAPSHOT_COVERAGE_EXCLUSIONS } from "../../shared/exclusions/snapshot.exclusions.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const SNAPSHOT_METHOD = "snapshot";
const RESTORE_METHOD = "restore";

const isMethod = function isMethod(node: AstNode, name: string): boolean {
    if (node.type !== "MethodDefinition") {
        return false;
    }
    const key = nodeAt(node, "key");
    return isType(key, "Identifier") && nameOf(key) === name;
};

const methodReferencesField = function methodReferencesField(method: AstNode, fieldName: string): boolean {
    let found = false;
    walk(method, (n) => {
        if (found || n.type !== "MemberExpression" || !isType(nodeAt(n, "object"), "ThisExpression")) {
            return;
        }
        const property = nodeAt(n, "property");
        if (isType(property, "Identifier") && nameOf(property) === fieldName) {
            found = true;
        }
    });
    return found;
};

const calledMethodNames = function calledMethodNames(method: AstNode): Set<string> {
    const names = new Set<string>();
    walk(method, (n) => {
        if (n.type !== "CallExpression") {
            return;
        }
        const callee = nodeAt(n, "callee");
        if (!isType(callee, "MemberExpression") || !isType(nodeAt(callee, "object"), "ThisExpression")) {
            return;
        }
        const property = nodeAt(callee, "property");
        if (isType(property, "Identifier")) {
            names.add(nameOf(property));
        }
    });
    return names;
};

const referencesField = function referencesField(
    method: AstNode | null,
    fieldName: string,
    members: readonly AstNode[],
    seen: Set<AstNode>,
): boolean {
    if (method === null || seen.has(method)) {
        return false;
    }
    seen.add(method);
    if (methodReferencesField(method, fieldName)) {
        return true;
    }
    for (const name of calledMethodNames(method)) {
        const target = members.find((m) => isMethod(m, name)) ?? null;
        if (referencesField(target, fieldName, members, seen)) {
            return true;
        }
    }
    return false;
};

const fieldNameOf = function fieldNameOf(field: AstNode): string | null {
    const key = nodeAt(field, "key");
    if (key === null) {
        return null;
    }
    return isType(key, "Identifier") ? nameOf(key) : literalString(key);
};

const isExcluded = function isExcluded(className: string, fieldName: string): boolean {
    return className !== "" && SNAPSHOT_COVERAGE_EXCLUSIONS.has(`${className}.${fieldName}`);
};

interface Persisted {
    cls: string;
    members: AstNode[];
    restore: AstNode;
    snapshot: AstNode;
}

const persistedShapeOf = function persistedShapeOf(view: AstNode): Persisted | null {
    const members = nodesAt(nodeAt(view, "body"), "body");
    const snapshot = members.find((m) => isMethod(m, SNAPSHOT_METHOD));
    const restore = members.find((m) => isMethod(m, RESTORE_METHOD));
    if (snapshot === undefined || restore === undefined) {
        return null;
    }
    const id = nodeAt(view, "id");
    const name = id === null ? "" : nameOf(id);
    return { cls: name === "" ? "<anonymous>" : name, members, restore, snapshot };
};

const uncoveredFields = function uncoveredFields(
    shape: Persisted,
    className: string,
): { field: AstNode; which: string }[] {
    const out: { field: AstNode; which: string }[] = [];
    const fields = shape.members.filter((m) => m.type === "PropertyDefinition" && m["static"] !== true);
    for (const field of fields) {
        const fieldName = fieldNameOf(field);
        if (fieldName === null || isExcluded(className, fieldName)) {
            continue;
        }
        if (!referencesField(shape.snapshot, fieldName, shape.members, new Set())) {
            out.push({ field, which: "snapshot()" });
        }
        if (!referencesField(shape.restore, fieldName, shape.members, new Set())) {
            out.push({ field, which: "restore()" });
        }
    }
    return out;
};

export default {
    create(context: RuleContext): RuleListener {
        const checkClass = function checkClass(view: AstNode): void {
            const shape = persistedShapeOf(view);
            if (shape === null) {
                return;
            }
            const id = nodeAt(view, "id");
            const className = id === null ? "" : nameOf(id);
            for (const hit of uncoveredFields(shape, className)) {
                const payload = { cls: shape.cls, field: fieldNameOf(hit.field) ?? "", which: hit.which };
                context.report({ data: payload, loc: locOf(hit.field), messageId: "missing" });
            }
        };
        return listener({ classDeclaration: checkClass, classExpression: checkClass });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:memento-pattern"] }),
            description:
                "Instance fields on classes with both snapshot() and restore() methods must be referenced in both — or class-qualified-listed in the snapshot exclusions registry.",
        },
        messages: {
            missing:
                "Field '{{cls}}.{{field}}' is not referenced in {{which}}. Either include it in {{which}}, or add '{{cls}}.{{field}}' to SNAPSHOT_COVERAGE_EXCLUSIONS in the snapshot exclusions registry if it is intentionally excluded from persistence.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
