export interface UnitToken {
    number: string;
    unit: string;
}

export interface CssNode {
    type?: string | undefined;
    name?: string | undefined;
    parent?: CssNode | undefined;
}

export interface ClampParts {
    full: string;
    max: string;
    min: string;
    preferred: string;
}
