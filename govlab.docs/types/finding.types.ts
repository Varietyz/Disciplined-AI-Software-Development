export interface Finding {
    line?: number;
    col?: number;
    detail?: string;
    remediation?: string;
    code?: string;
    expected?: string;
    token?: string;
    message?: string;
    path?: string;
    term?: string;
}

export type Categories = Record<string, Finding[]>;

export interface FindingSpec {
    code: (hit: Finding) => string;
    column: (hit: Finding) => number;
    key: string;
    text: (hit: Finding) => string;
}

export interface DescribedFinding {
    category: string;
    code: string;
    col: number;
    line: number;
    text: string;
}

export interface PerDocEntry {
    all: Categories;
    relDoc: string;
}

export interface NameFinding {
    names: Finding[];
    relDoc: string;
}

export interface CheckResult {
    errors: string[];
    heals: string[];
}

export interface DeadScriptRef {
    path: string;
    script: string;
}
