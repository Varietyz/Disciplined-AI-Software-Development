import type { CstNode, RawNode } from "#types/syntax.types";

const isNamedOf = function isNamedOf(node: RawNode): boolean {
    return typeof node.isNamed === "function" ? node.isNamed() : node.isNamed;
};

const setField = function setField(fields: Map<string, CstNode>, adapted: CstNode | null, field: string | null): void {
    if (adapted !== null && field !== null && field.length > 0) {
        fields.set(field, adapted);
    }
};

export const adaptNode = function adaptNode(node: RawNode): CstNode {
    const kids: (CstNode | null)[] = [];
    const fields = new Map<string, CstNode>();
    const count = node.childCount;
    for (let index = 0; index < count; index += 1) {
        const raw = node.child(index);
        const adapted = raw === null ? null : adaptNode(raw);
        kids.push(adapted);
        setField(fields, adapted, node.fieldNameForChild?.(index) ?? null);
    }
    return {
        child: (index: number): CstNode | null => kids.at(index) ?? null,
        childCount: count,
        childForFieldName: (field: string): CstNode | null => fields.get(field) ?? null,
        endIndex: node.endIndex,
        isNamed: isNamedOf(node),
        startIndex: node.startIndex,
        startPosition: node.startPosition ?? { column: 0, row: 0 },
        text: node.text ?? "",
        type: node.type,
    };
};
