import type { AstNode, ExportedName, SourceLoc } from "../../types/syntax.types.ts";

export const locOf = function locOf(node: AstNode): SourceLoc {
    return node.loc;
};

export const isAstNode = function isAstNode(value: unknown): value is AstNode {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value as { type?: unknown; loc?: unknown };
    return typeof candidate.type === "string" && typeof candidate.loc === "object" && candidate.loc !== null;
};

export const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

export const nodeAt = function nodeAt(node: AstNode | null, key: string): AstNode | null {
    return node === null ? null : asNode(node[key]);
};

export const nodesAt = function nodesAt(node: AstNode | null, key: string): AstNode[] {
    const value = node === null ? undefined : node[key];
    return Array.isArray(value) ? value.filter(isAstNode) : [];
};

export const stringAt = function stringAt(node: AstNode | null, key: string): string {
    const value = node === null ? undefined : node[key];
    return typeof value === "string" ? value : "";
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

export const recordAt = function recordAt(node: AstNode | null, key: string): Record<string, unknown> | null {
    const value = node === null ? undefined : node[key];
    return isRecord(value) ? value : null;
};

export const stringIn = function stringIn(record: Record<string, unknown> | null, key: string): string {
    const value = record === null ? undefined : record[key];
    return typeof value === "string" ? value : "";
};

export const numberAt = function numberAt(node: AstNode | null, key: string): number | null {
    const value = node === null ? undefined : node[key];
    return typeof value === "number" ? value : null;
};

export const booleanAt = function booleanAt(node: AstNode | null, key: string): boolean {
    return node?.[key] === true;
};

export const handlerKey = function handlerKey(type: string): string {
    return type.slice(0, 1).toLowerCase() + type.slice(1);
};

export const typeOf = function typeOf(node: AstNode | null): string {
    return node === null ? "" : node.type;
};

export const isType = function isType(node: AstNode | null, type: string): boolean {
    return node?.type === type;
};

export const literalString = function literalString(node: AstNode | null): string | null {
    if (!isType(node, "Literal")) {
        return null;
    }
    const value = node === null ? undefined : node["value"];
    return typeof value === "string" ? value : null;
};

export const staticTextOf = function staticTextOf(node: AstNode | null): string | null {
    if (node === null) {
        return null;
    }
    if (node.type === "Literal") {
        return literalString(node);
    }
    if (node.type !== "TemplateLiteral" || nodesAt(node, "expressions").length > 0) {
        return null;
    }
    const [part] = nodesAt(node, "quasis");
    return part === undefined ? null : stringIn(recordAt(part, "value"), "cooked");
};

export const nameOf = function nameOf(node: AstNode | null): string {
    if (node === null) {
        return "";
    }
    if (node.type === "Identifier" || node.type === "PrivateIdentifier") {
        return stringAt(node, "name");
    }
    return literalString(node) ?? "";
};

export const calleeName = function calleeName(node: AstNode | null): string {
    const callee = nodeAt(node, "callee");
    if (callee === null) {
        return "";
    }
    if (callee.type === "MemberExpression") {
        return nameOf(nodeAt(callee, "property"));
    }
    return nameOf(callee);
};

export const propertyKeyName = function propertyKeyName(node: AstNode | null): string {
    return nameOf(nodeAt(node, "key"));
};

export const argumentAt = function argumentAt(node: AstNode | null, index: number): AstNode | null {
    return nodesAt(node, "arguments")[index] ?? null;
};

const NAMED_DECLARATIONS = new Set(["FunctionDeclaration", "ClassDeclaration"]);

const declaredNames = function declaredNames(declaration: AstNode | null): ExportedName[] {
    if (declaration === null) {
        return [];
    }
    if (declaration.type === "VariableDeclaration") {
        return nodesAt(declaration, "declarations")
            .filter((d) => isType(nodeAt(d, "id"), "Identifier"))
            .map((d) => ({ name: nameOf(nodeAt(d, "id")), target: d }));
    }
    const id = nodeAt(declaration, "id");
    if (NAMED_DECLARATIONS.has(declaration.type) && isType(id, "Identifier")) {
        return [{ name: nameOf(id), target: declaration }];
    }
    return [];
};

export const exportedNamesOf = function exportedNamesOf(node: AstNode): ExportedName[] {
    const names = declaredNames(nodeAt(node, "declaration"));
    for (const spec of nodesAt(node, "specifiers")) {
        const exported = nodeAt(spec, "exported");
        if (isType(exported, "Identifier")) {
            names.push({ name: nameOf(exported), target: spec });
        }
    }
    return names;
};

const BACK_REFERENCES = new Set(["parent"]);

const membersOf = function membersOf(value: unknown): AstNode[] {
    if (Array.isArray(value)) {
        return value.filter(isAstNode);
    }
    const child = asNode(value);
    return child === null ? [] : [child];
};

const childrenOf = function childrenOf(node: AstNode): AstNode[] {
    return Object.entries(node)
        .filter(([key]) => !BACK_REFERENCES.has(key))
        .flatMap(([, value]) => membersOf(value));
};

export const walk = function walk(root: AstNode, visit: (node: AstNode) => void): void {
    const seen = new Set<AstNode>();
    const stack: AstNode[] = [root];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined || seen.has(node)) {
            continue;
        }
        seen.add(node);
        visit(node);
        stack.push(...childrenOf(node));
    }
};
