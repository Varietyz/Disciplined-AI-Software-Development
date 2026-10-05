export interface ToolKnob {
    knob: string;
    type: string;
    default: boolean | number | string | null;
    threshold: boolean;
}

export interface Exemplar {
    before: string;
    after: string;
    lang: string;
}

export interface QualityConcept {
    id: string;
    dimension: string;
    total: number;
    exemplar?: Exemplar;
}

export interface QualityConcernRecord {
    name: string;
    value: boolean | number;
    severity: string;
    numeric: boolean;
    toolCount: number;
    ruleCount: number;
    valueDerivation?: string;
    knobPerTool?: Record<string, string>;
    configOptions?: string[];
}

export interface QualityRuleRecord {
    name: string;
    tool: string;
    ecosystem: string;
    ruleId: string;
    ruleName: string;
    concern: string;
    category: string;
    url: string;
    canonical?: string[];
    knobs?: ToolKnob[];
}

export interface QualityToolRecord {
    name: string;
    ecosystem: string;
    ruleCount: number;
    knobCount: number;
    detectionOnly: boolean;
}

export interface QualityConcern extends QualityConcernRecord {
    id: string;
}

export interface QualityRule extends QualityRuleRecord {
    id: string;
}

export interface QualityTool extends QualityToolRecord {
    id: string;
}

export interface QualityData {
    concerns: QualityConcernRecord[];
    rules: QualityRuleRecord[];
    tools: QualityToolRecord[];
    concepts: QualityConcept[];
}

export type CatalogRule = Record<string, unknown> & { ruleId: string };

export interface KnobSpec {
    default: unknown;
    knob: string;
    threshold: boolean;
    type?: string;
    fixed?: boolean;
}

export type KnobEntry = [string, string, KnobSpec];

export interface CatalogProduct {
    source: string;
    rules: CatalogRule[];
    summary: Record<string, unknown>;
}

export type ProducerRefresh = "build" | "manual";

export interface CatalogProducer {
    name: string;
    refresh: ProducerRefresh;
    produce: () => Promise<CatalogProduct[]>;
    knobs?: () => Promise<KnobEntry[]>;
}

export interface CatalogRequest {
    rules: readonly string[];
    knobs: readonly string[];
}

export interface CatalogWriter {
    json: (file: string, data: unknown) => Promise<void>;
    text: (file: string, text: string) => Promise<void>;
    markdown: (file: string, text: string) => Promise<void>;
}

export interface ToolTally {
    ecosystem: string;
    rules: number;
    tool: string;
    version: string;
}

export interface ConceptEntry {
    byEcosystem: Record<string, number>;
    byTool: Record<string, number>;
    dimension: string;
    id: string;
    sample: string[];
    tools: number;
    total: number;
    exemplar?: unknown;
}

export interface RuleKnob {
    default: unknown;
    knob: string;
    threshold: boolean;
    type?: string;
}

export interface ConcernControl {
    rules: number;
    severity: string;
    tools: number;
    value: boolean | number;
    valueDerivation?: string;
    knobPerTool?: Record<string, string>;
    configOptions?: string[];
}

export interface CatalogState {
    rules?: CatalogRule[];
    classified?: CatalogRule[];
    catalog?: CatalogRule[];
    concepts?: ConceptEntry[];
    ruleKnobs?: Record<string, RuleKnob[]>;
}

export type CatalogKey = keyof CatalogState;

export interface CatalogStep {
    name: string;
    needs: readonly CatalogKey[];
    gives: readonly CatalogKey[];
    run: (state: CatalogState, writer: CatalogWriter) => Promise<Partial<CatalogState>>;
}
