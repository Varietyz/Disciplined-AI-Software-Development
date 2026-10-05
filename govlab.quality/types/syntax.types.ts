export interface SyntaxNode {
    type: string;
    range?: [number, number];
    name?: string;
    operator?: string;
    value?: unknown;
    computed?: boolean;
    callee?: SyntaxNode;
    object?: SyntaxNode;
    property?: SyntaxNode;
    arguments?: SyntaxNode[];
    properties?: SyntaxNode[];
    elements?: SyntaxNode[];
    key?: SyntaxNode;
    quasis?: { value?: { cooked?: unknown } }[];
    expressions?: SyntaxNode[];
    left?: SyntaxNode;
    right?: SyntaxNode;
    parent?: SyntaxNode;
    id?: SyntaxNode;
    init?: SyntaxNode;
    argument?: SyntaxNode;
}
