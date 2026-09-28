export interface FieldRoot {
    readonly container?: boolean;
    readonly file: string;
    readonly name: string;
}

export interface FieldScope {
    readonly label: string;
    readonly readerRoots: readonly string[];
    readonly roots: readonly FieldRoot[];
    readonly tsconfig: string;
    readonly typeRoots: readonly string[];
}

export interface FieldEntry {
    readonly file: string;
    readonly key: string;
    readonly line: number;
}

export interface ScopeReach {
    readonly fields: readonly FieldEntry[];
    readonly label: string;
    readonly missingRoots: readonly FieldRoot[];
    readonly read: ReadonlySet<string>;
}
