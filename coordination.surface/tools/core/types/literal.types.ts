export interface Literal {
    readonly value: string;
    readonly line: number;
}

export interface Enumeration {
    readonly line: number;
    readonly root: string;
}

export interface Quoted {
    readonly open: number;
    readonly close: number;
    readonly value: string;
}
