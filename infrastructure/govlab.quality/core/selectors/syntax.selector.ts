import type { SyntaxNode } from "#types/syntax.types";

const isSyntaxNode = function isSyntaxNode(value: unknown): value is SyntaxNode {
    return value !== null && typeof value === "object" && "type" in value;
};

export const asNode = function asNode(value: unknown): SyntaxNode | null {
    return isSyntaxNode(value) ? value : null;
};

export const identName = function identName(node?: SyntaxNode): string | null {
    return node?.type === "Identifier" && typeof node.name === "string" ? node.name : null;
};

export const propKeyName = function propKeyName(prop: SyntaxNode): string | null {
    if (prop.computed === true) {
        return null;
    }
    const { key } = prop;
    return identName(key) ?? (key?.type === "Literal" && typeof key.value === "string" ? key.value : null);
};
