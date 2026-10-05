export interface Attribute {
    readonly name: string;
    readonly quote: string;
    readonly value: string | null;
}

export interface Tag {
    readonly attributes: readonly Attribute[];
    readonly name: string;
    readonly selfClosing: boolean;
}
