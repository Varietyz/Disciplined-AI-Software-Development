export interface Significance {
    statistic: number;
    pValue: number;
    significant: boolean;
}

export interface Transition {
    source: string;
    target: string;
    count: number;
}

export interface Uniformity {
    chiSquare: number;
    dof: number;
    pValue: number;
    uniform: boolean;
}

export interface Marginals {
    row: Map<string, number>;
    col: Map<string, number>;
}
