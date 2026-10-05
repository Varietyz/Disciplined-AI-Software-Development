import type { Rule } from "eslint";

export interface WriteNode {
    type: string;
    name?: string;
    value?: unknown;
    computed?: boolean;
    callee?: WriteNode;
    object?: WriteNode;
    property?: WriteNode;
    arguments?: WriteNode[];
    elements?: WriteNode[];
    quasis?: { value?: { cooked?: unknown } }[];
    expressions?: WriteNode[];
    left?: WriteNode;
    right?: WriteNode;
    parent?: WriteNode;
    id?: WriteNode;
    init?: WriteNode;
    argument?: WriteNode;
}

export type InitResolver = (name: string) => WriteNode | null;

export interface WriteOwnership {
    owner: boolean;
    writers: ReadonlySet<string>;
}

export interface WriteSite {
    call: WriteNode;
    node: Rule.Node;
}
