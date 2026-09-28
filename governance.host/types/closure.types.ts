export interface Atom {
    kind: string;
    text: string;
}

export interface CallEntry {
    file: string;
    fn: string;
    idArg: Atom | null;
}

export interface EventEntry {
    file: string;
    eventArg: Atom | null;
}

export interface ExportEntry {
    file: string;
    name: string;
}

export interface ImportEntry {
    file: string;
    from: string;
    names: string[];
}

export interface SideEffectEntry {
    file: string;
    from: string;
}

export interface InterfaceEntry {
    file: string;
    name: string;
    fields: { name: string; optional: boolean }[];
}

export interface BarrelPattern {
    dir: string;
    suffix: string;
}

export interface ImportEdge {
    names: string[];
    target: string;
}

export type ImportGraph = Map<string, ImportEdge[]>;

export interface Reachable {
    reachableExports: Set<string>;
    reachableFiles: Set<string>;
}

export interface ClosureGraph {
    version: number;
    registers: CallEntry[];
    consumers: CallEntry[];
    emits: EventEntry[];
    subscribes: EventEntry[];
    eventActivity: CallEntry[];
    exports: ExportEntry[];
    imports: ImportEntry[];
    externalConsumers: ImportEntry[];
    sideEffectImports: SideEffectEntry[];
    interfaces: InterfaceEntry[];
    idsExports: ExportEntry[];
    stringsExports: ExportEntry[];
    iconsExports: ExportEntry[];
}
