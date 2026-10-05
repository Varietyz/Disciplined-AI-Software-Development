export type FindingSeverity = "error" | "notice";

export interface Finding {
    tool: string;
    ecosystem: string;
    file: string;
    line: number;
    column: number;
    ruleId: string;
    severity: FindingSeverity;
    message: string;
    fixable: boolean;
    advisory: boolean;
    canon?: string[];
    suggestion?: string;
}

export interface RunResult {
    findings: Finding[];
    fixedCount: number;
    output: string;
}

export type PassOutcome = { terminal: false; findings: Finding[] } | { terminal: true; result: RunResult };

export interface SourceLocation {
    column: number;
    file: string;
    line: number;
}

export interface PlacedFinding {
    file: string;
    line: number;
    ruleId: string;
}

export interface AdvisoryFindingInput {
    column: number;
    ecosystem: string;
    file: string;
    line: number;
    message: string;
    ruleId: string;
    tool: string;
}

export interface NoticeSpec {
    advisory: boolean;
    message: string;
    ruleId: string;
    severity: FindingSeverity;
    output?: string;
}
