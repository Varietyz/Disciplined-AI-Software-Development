import type { QualityConcept, QualityConcern, QualityData, QualityRule, QualityTool } from "#types/catalog.types";
import type { Finding } from "#types/finding.types";
import type { ProcessEnv } from "#types/tool.types";

export interface Logger {
    warn: (message: string, detail?: unknown) => void;
}

export interface QualityRelationsOptions {
    logger?: Logger;
    data?: QualityData;
}

export interface QualityQueryFilter {
    tool?: string;
    ecosystem?: string;
    numeric?: boolean;
    minValue?: number;
    crossTool?: boolean;
    hasConfigOptions?: boolean;
}

export interface ResolveResult {
    concerns: QualityConcern[];
    rules: QualityRule[];
    rulesByConcern: Record<string, QualityRule[]>;
    values: Record<string, boolean | number>;
    knobPerTool: Record<string, Record<string, string>>;
    tools: QualityTool[];
}

export interface OntologyIssues {
    rulesWithoutConcern: string[];
    danglingRuleConcerns: { rule: string; concern: string }[];
    concernsWithoutValue: string[];
    toolsWithoutEcosystem: string[];
}

export interface QualityRelations {
    concern: (id: string) => QualityConcern | null;
    concerns: () => QualityConcern[];
    rule: (id: string) => QualityRule | null;
    rules: () => QualityRule[];
    tool: (id: string) => QualityTool | null;
    tools: () => QualityTool[];
    concept: (id: string) => QualityConcept | null;
    concepts: () => QualityConcept[];
    ecosystems: () => string[];
    rulesOf: (concernId: string) => QualityRule[];
    query: (filter?: QualityQueryFilter) => QualityConcern[];
    resolve: (concernIds: string[]) => ResolveResult;
    validate: () => OntologyIssues;
}

export interface RuleIndices {
    byRule: Map<string, QualityRule>;
    rulesByConcern: Map<string, QualityRule[]>;
    concernTools: Map<string, Set<string>>;
    concernEcosystems: Map<string, Set<string>>;
}

export interface Indices extends RuleIndices {
    concerns: QualityConcern[];
    rules: QualityRule[];
    tools: QualityTool[];
    concepts: QualityConcept[];
    byConceptId: Map<string, QualityConcept>;
    byConcern: Map<string, QualityConcern>;
    byTool: Map<string, QualityTool>;
}

export type Reporter = "human" | "json";

export interface RunQualityOptions {
    root: string;
    paths?: string[] | undefined;
    ecosystems?: string[] | undefined;
    only?: readonly string[] | undefined;
    fix: boolean;
    reporter: Reporter;
    selectableActive?: string[] | undefined;
    dryRun?: boolean | undefined;
    backup?: boolean | undefined;
    env?: ProcessEnv | undefined;
}

export interface QualityOutcome {
    report: string;
    exitCode: number;
    findings: Finding[];
}

export interface DetectedEcosystem {
    ecosystem: string;
    languageId: string;
}

export type Concern =
    | "actions"
    | "ansible"
    | "clojure"
    | "cpp"
    | "csharp"
    | "dockerfile"
    | "duplication"
    | "elixir"
    | "eslint"
    | "format"
    | "go"
    | "htmlhint"
    | "iac"
    | "install"
    | "java"
    | "kotlin"
    | "lint"
    | "list"
    | "lua"
    | "oxlint"
    | "perl"
    | "php"
    | "python"
    | "r"
    | "ruby"
    | "rust"
    | "scala"
    | "shell"
    | "solidity"
    | "sql"
    | "stylelint"
    | "swift"
    | "unused"
    | "yaml";

export interface ConcernSpec {
    only?: readonly string[];
    ecosystems?: readonly string[];
}

export interface CliArgs {
    concern: Concern;
    paths: string[];
    ecosystems: string[];
    fix: boolean;
    reporter: Reporter;
    dryRun: boolean;
    backup: boolean;
    auto: boolean;
    config: string | null;
}
