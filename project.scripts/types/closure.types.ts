export interface Atom {
    readonly kind: string;
    readonly text: string;
}

export interface CallEntry {
    readonly file: string;
    readonly fn: string;
    readonly idArg: Atom | null;
}

export interface EventEntry {
    readonly file: string;
    readonly eventArg: Atom | null;
}

export interface ExportEntry {
    readonly file: string;
    readonly name: string;
}

export interface ImportEntry {
    readonly file: string;
    readonly from: string;
    readonly names: readonly string[];
}

export interface SideEffectEntry {
    readonly file: string;
    readonly from: string;
}

export interface FieldEntry {
    readonly name: string;
    readonly optional: boolean;
}

export interface InterfaceEntry {
    readonly file: string;
    readonly name: string;
    readonly fields: readonly FieldEntry[];
}

export interface FileFlags {
    readonly isIds: boolean;
    readonly isStrings: boolean;
    readonly isIcons: boolean;
}

export interface GraphEntries {
    readonly registers: readonly CallEntry[];
    readonly consumers: readonly CallEntry[];
    readonly emits: readonly EventEntry[];
    readonly subscribes: readonly EventEntry[];
    readonly eventActivity: readonly CallEntry[];
    readonly exports: readonly ExportEntry[];
    readonly imports: readonly ImportEntry[];
    readonly externalConsumers: readonly ImportEntry[];
    readonly sideEffectImports: readonly SideEffectEntry[];
    readonly interfaces: readonly InterfaceEntry[];
    readonly idsExports: readonly ExportEntry[];
    readonly stringsExports: readonly ExportEntry[];
    readonly iconsExports: readonly ExportEntry[];
}

export type GraphDelta = Partial<GraphEntries>;

export interface ClosureGraph extends GraphEntries {
    readonly version: number;
}

export interface PatternResolution {
    readonly edges: readonly SideEffectEntry[];
    readonly unmatched: readonly string[];
}

export interface ScanState {
    readonly name: number;
    readonly pattern: number;
    readonly starName: number;
    readonly starPattern: number;
}
