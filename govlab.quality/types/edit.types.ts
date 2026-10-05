import type { Linter } from "eslint";

export interface FixableResult {
    filePath: string;
    messages: readonly { fatal?: boolean | undefined }[];
    output?: string | undefined;
}

export interface SafeFixFs {
    read: (file: string) => string;
    write: (file: string, data: string) => void;
    rename: (from: string, to: string) => void;
    ensureDir: (dir: string) => void;
    remove?: (file: string) => void;
}

export interface SafeFixOptions {
    root: string;
    dryRun?: boolean | undefined;
    backup?: boolean | undefined;
    fs?: SafeFixFs;
}

export interface SafeFixOutcome {
    written: string[];
    skipped: string[];
    pending: string[];
}

export interface FixAction {
    file: string;
    kind: "pending" | "skipped" | "written";
    original?: string;
}

export interface CommitContext {
    file: string;
    fs: SafeFixFs;
    output: string;
    temp: string;
}

export interface CuratedResult {
    errorCount: number;
    messages: Linter.LintMessage[];
}

export interface CuratedSuggestion {
    messageId: string | null;
    pick: "prefix" | "sole";
    prefix: string;
    ruleId: string;
}

export interface RangeFix {
    range: readonly [number, number];
    text: string;
}

export interface CuratedApplyResult {
    appliedCount: number;
    output: string;
}

export interface LineRange {
    end: number;
    start: number;
}
