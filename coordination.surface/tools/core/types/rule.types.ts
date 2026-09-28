import type { Finding, Verdict } from "./segment.types.ts";
import type { TaxonomyData } from "./taxonomy.types.ts";

export const STAGES = ["structure", "content", "meta"] as const;

export type Stage = (typeof STAGES)[number];

export const JURISDICTIONS = ["taxonomy", "artifact", "all"] as const;

export type Jurisdiction = (typeof JURISDICTIONS)[number];

export interface RuleContext {
    readonly id: string;
    readonly repoRoot: string;
    readonly taxonomy: TaxonomyData;
    readonly paths: readonly string[];
    readonly read: (path: string) => string;
    readonly exists: (path: string) => boolean;
}

export interface RuleResult {
    readonly findings: readonly Finding[];
    readonly healed: readonly string[];
    readonly derivations?: unknown;
}

export interface RuleDeclaration {
    readonly stage: Stage;
    readonly jurisdiction: Jurisdiction;
    readonly invariant: string;
    readonly extensions: readonly string[];
    readonly kinds: readonly string[];
    readonly heals: boolean;
    readonly reads?: readonly string[];
    readonly readsTree?: string;
    readonly wholeScopeOnly?: boolean;
    readonly dependsOnSlot?: { readonly section: string; readonly name: string };
    readonly check: (context: RuleContext, fix: boolean) => RuleResult;
}

export const DECLARATION_KEYS = [
    "stage",
    "jurisdiction",
    "invariant",
    "extensions",
    "kinds",
    "heals",
    "check",
] as const;

export interface StageResult {
    readonly stage: Stage;
    readonly rule: string;
    readonly invariant: string;
    readonly findings: number;
    readonly healed: number;
    readonly bypassed: boolean;
    readonly elapsed?: number;
}

export interface StepOutcome {
    readonly stage: StageResult;
    readonly findings: readonly Finding[];
}

export interface StepOptions {
    readonly repoRoot: string;
    readonly bypass: readonly string[];
    readonly fix: boolean;
    readonly scanned: number;
    readonly scope: string;
    readonly authoritative: boolean;
}

export interface RegisteredRule {
    readonly declaration: RuleDeclaration;
    readonly id: string;
    readonly path: string;
}

export interface Registry {
    readonly rules: readonly RegisteredRule[];
    readonly findings: readonly Finding[];
}

export interface RuleReport {
    readonly rule: string;
    readonly mechanism?: string;
    readonly stage: Stage;
    readonly invariant: string;
    readonly verdict: Verdict;
    readonly scope: string;
    readonly authoritative: boolean;
    readonly scanned: number;
    readonly healed: readonly string[];
    readonly findings: readonly Finding[];
    readonly derivations?: unknown;
}

export interface StageSummary {
    readonly stage: Stage;
    readonly rule: string;
    readonly invariant: string;
    readonly findings: number;
    readonly healed: number;
    readonly bypassed: boolean;
}

export interface PipelineReport {
    readonly tool: "govern";
    readonly verdict: Verdict;
    readonly registered: number;
    readonly agent: string;
    readonly at: number;
    readonly scope: string;
    readonly authoritative: boolean;
    readonly scanned: number;
    readonly bypassed: boolean;
    readonly mutated: boolean;
    readonly mode: "healing" | "held";
    readonly written: readonly string[];
    readonly escaped: readonly string[];
    readonly unfulfilled: readonly string[];
    readonly stages: readonly StageSummary[];
    readonly reports: readonly string[];
    readonly findings: readonly Finding[];
    readonly moved: readonly string[];
    readonly derivations: Record<string, unknown>;
}

export interface DeclaredRule {
    readonly slug: string;
    readonly gate: string;
    readonly locked: boolean;
    readonly line: number;
}
