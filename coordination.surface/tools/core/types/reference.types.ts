export interface Move {
    readonly from: string;
    readonly to: string;
}

export interface Citation {
    readonly kind: string;
    readonly member: string;
}

export interface Reference {
    readonly raw: string;
    readonly target: string;
    readonly locus: string;
    readonly line: number;
}
