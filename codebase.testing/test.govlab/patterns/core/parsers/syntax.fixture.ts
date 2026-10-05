import type { CstNode } from "@govlab/code-parse";

export const leaf = function leaf(type: string, fields: Readonly<Record<string, CstNode>> = {}): CstNode {
    return {
        child: () => null,
        childCount: 0,
        childForFieldName: (name: string) => fields[name] ?? null,
        isNamed: true,
        startPosition: { column: 0, row: 0 },
        text: type,
        type,
    };
};

export const branch = function branch(type: string, children: readonly CstNode[]): CstNode {
    return { child: (index: number) => children[index] ?? null, childCount: children.length, isNamed: true, type };
};
