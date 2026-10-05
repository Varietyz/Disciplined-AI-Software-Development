import type { Construct, ConstructNode } from "#types/construct.types";
import { isConstructInit } from "#core/predicates/construct.predicate";

const isConstructNode = function isConstructNode(value: unknown): value is ConstructNode {
    return typeof value === "object" && value !== null && "type" in value;
};

export const asConstructNode = function asConstructNode(value: unknown): ConstructNode | null {
    return isConstructNode(value) ? value : null;
};

const namedConstruct = function namedConstruct(node: ConstructNode): Construct[] {
    const { id } = node;
    if (id && typeof id.name === "string") {
        return [{ name: id.name, node: id }];
    }
    return [];
};

const variableConstructs = function variableConstructs(node: ConstructNode): Construct[] {
    const out: Construct[] = [];
    for (const decl of node.declarations ?? []) {
        const { id } = decl;
        if (id?.type === "Identifier" && typeof id.name === "string" && isConstructInit(decl.init)) {
            out.push({ name: id.name, node: id });
        }
    }
    return out;
};

export const constructsOf = function constructsOf(declaration: ConstructNode | null | undefined): Construct[] {
    if (!declaration) {
        return [];
    }
    if (declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration") {
        return namedConstruct(declaration);
    }
    if (declaration.type === "VariableDeclaration") {
        return variableConstructs(declaration);
    }
    return [];
};

export const collectLocalConstructs = function collectLocalConstructs(body: ConstructNode[]): Set<string> {
    const names = new Set<string>();
    for (const statement of body) {
        const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
        for (const construct of constructsOf(declaration)) {
            names.add(construct.name);
        }
    }
    return names;
};
