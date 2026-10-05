import type { CstNode } from "@govlab/code-parse";

export const childNodes = function childNodes(node: CstNode): CstNode[] {
    const out: CstNode[] = [];
    for (let index = 0; index < node.childCount; index += 1) {
        const child = node.child(index);
        if (child !== null) {
            out.push(child);
        }
    }
    return out;
};

export const fieldText = function fieldText(node: CstNode, field: string): string {
    return node.childForFieldName?.(field)?.text ?? "";
};

export const fieldType = function fieldType(node: CstNode, field: string): string | undefined {
    return node.childForFieldName?.(field)?.type;
};

export const lineOf = function lineOf(node: CstNode): number {
    return (node.startPosition?.row ?? 0) + 1;
};
