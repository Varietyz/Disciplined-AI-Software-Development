export interface UngatedRow {
    readonly id: string;
    readonly line: number;
}

export interface VenueScope {
    readonly repoRoot: string;
    readonly template: string;
    readonly boardText: string;
    readonly indexText: string;
    readonly agenda: string;
    readonly archive: string;
    readonly open: readonly string[];
}
