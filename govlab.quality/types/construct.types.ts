export interface ConstructNode {
    type: string;
    name?: string;
    method?: boolean;
    id?: ConstructNode | null;
    init?: ConstructNode | null;
    value?: ConstructNode | null;
    callee?: ConstructNode | null;
    declaration?: ConstructNode | null;
    source?: ConstructNode | null;
    local?: ConstructNode;
    exported?: ConstructNode;
    body?: ConstructNode[];
    declarations?: ConstructNode[];
    properties?: ConstructNode[];
    specifiers?: ConstructNode[];
}

export interface Construct {
    name: string;
    node: ConstructNode;
}
