import type { CheckDeclaration } from "@govlab/context";

export interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface CodemodFinding {
    file: string;
    line: number;
    reason: string | null;
}

export interface CodemodSpec<F extends CodemodFinding> {
    checks: CheckDeclaration;
    ruleId: string;
    findings: readonly F[];
    programCount: number;
    editsByFile: (findings: readonly F[]) => Map<string, Edit[]>;
    label: (finding: F) => string;
    appliedNoun: string;
    blockedMessage: (finding: F) => string;
    gateOnBlocked: boolean;
    scopeNoun?: string;
}
