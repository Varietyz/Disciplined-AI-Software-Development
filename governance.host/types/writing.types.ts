export type CanonLayerId = "document" | "identifier" | "note" | "output" | "prose" | "root" | "short";

export interface CanonExample {
    readonly rejected: string;
    readonly repaired: string | null;
    readonly why: string;
}

export type CanonCheckId =
    | "concrete-before-name"
    | "field-mood"
    | "named-agent"
    | "named-party"
    | "no-comment-on-previous"
    | "no-field-restatement"
    | "no-filler-phrase"
    | "no-implied-fact"
    | "no-long-dash"
    | "no-praise-vocabulary"
    | "no-restatement"
    | "no-semicolon"
    | "no-unmeasured-numbers"
    | "one-instruction-per-sentence"
    | "one-new-concept-per-step"
    | "one-term-per-concept"
    | "sentence-cap";

export type CanonDetection = "check" | "review";

export interface CanonCheck {
    readonly detection: CanonDetection;
    readonly enforcedIn: readonly CanonLayerId[];
    readonly id: CanonCheckId;
}

export interface CanonRule {
    readonly bans: readonly string[];
    readonly checks: readonly CanonCheck[];
    readonly conditions: readonly string[];
    readonly examples: readonly CanonExample[];
    readonly gate: string | null;
    readonly id: string;
    readonly rule: string;
    readonly why: string;
}

export interface CanonHome {
    readonly covers: string;
    readonly path: string;
}

export interface CanonLayer {
    readonly covers: readonly string[];
    readonly defersTo: readonly CanonHome[];
    readonly id: CanonLayerId;
    readonly intro: string;
    readonly rules: readonly CanonRule[];
    readonly title: string;
}

export type CompositionKind = "comment" | "filler" | "party" | "restatement";

export interface CompositionFinding {
    readonly evidence: string;
    readonly kind: CompositionKind;
    readonly sentence: string;
}

export interface DocumentFinding {
    readonly check: CanonCheckId;
    readonly evidence: string;
    readonly sentence: string;
}

export interface DocumentText {
    readonly at: string;
    readonly text: string;
}

export interface TermRecord {
    readonly canonical: string;
    readonly concept: string;
    readonly synonyms: readonly string[];
}

export interface RenameRules {
    readonly ids: ReadonlyMap<string, string>;
    readonly pathSegments: readonly string[];
    readonly wholeId: boolean;
    readonly words: ReadonlyMap<string, string> | null;
}

export interface RenamedSpan {
    readonly end: number;
    readonly from: string;
    readonly start: number;
    readonly to: string;
}

export type FieldMood = "declarative" | "imperative";

export interface SentenceShape {
    readonly agentlessPassive: boolean;
    readonly joins: number;
    readonly words: number;
}
