export interface JournalRef {
    readonly fingerprint: string;
    readonly json: string;
    readonly kind: string;
    readonly title: string;
}

export interface Tombstone {
    readonly json: string;
    readonly to: string | null;
}

export interface Journal {
    readonly moved: Readonly<Record<string, Tombstone>>;
    readonly refs: Readonly<Record<string, JournalRef>>;
}
