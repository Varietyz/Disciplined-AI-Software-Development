export interface Violation {
    column: number | null;
    line: number | null;
    rule: string;
    severity: string;
    message: string;
    step: string;
}

export interface ViolationsArtifact {
    generatedAt: string;
    label: string;
    stoppedAt: string | null;
    totals: { files: number; violations: number };
    files: Record<string, Violation[]>;
    unparsed: Record<string, string>;
}

export interface ParsedOutput {
    files: Map<string, Violation[]>;
    matched: boolean;
}

export interface StepOutput {
    label: string;
    ok: boolean;
    out: string;
    stage: string;
}

export interface StageTally {
    failed: number;
    passed: number;
    violations: number;
}
