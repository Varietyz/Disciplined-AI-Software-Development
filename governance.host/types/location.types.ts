export type SegmentTable = Map<string, string[]>;

export interface ComposedKey {
    key: string;
    tail: string;
}

export interface TreeIndex {
    basenames: Set<string>;
    paths: string[];
}

export interface UnresolvedDeclaration {
    file: string;
    value: string;
}
