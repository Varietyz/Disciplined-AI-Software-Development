export interface MemberConfig {
    extendsBase: boolean;
    member: string;
    present: boolean;
}

export interface TypescriptStats {
    baseOptions: number;
    covered: number;
    members: MemberConfig[];
    strictFlags: [string, boolean][];
    target: string;
    total: number;
    uncovered: string[];
}
