export const SEGMENT_KINDS = [
    "frontmatter-open",
    "frontmatter-field",
    "frontmatter-close",
    "heading",
    "field",
    "list-item",
    "fence-open",
    "fence-body",
    "fence-close",
    "table-row",
    "text",
    "blank",
] as const;

export type SegmentKind = (typeof SEGMENT_KINDS)[number];

export const INLINE_KINDS = ["link-target", "inline-code", "import-path"] as const;

export type InlineKind = (typeof INLINE_KINDS)[number];

export interface Span {
    readonly start: number;
    readonly end: number;
    readonly line: number;
}

export interface Inline extends Span {
    readonly kind: InlineKind;
    readonly value: string;
}

export interface Segment extends Span {
    readonly kind: SegmentKind;
    readonly text: string;
    readonly key?: string;
    readonly value?: string;
    readonly depth?: number;
    readonly inlines: readonly Inline[];
}

export interface Document {
    readonly path: string;
    readonly source: string;
    readonly segments: readonly Segment[];
}

export interface SegmentPredicate {
    readonly kind?: SegmentKind;
    readonly keyEquals?: string;
    readonly valueEquals?: string;
    readonly valueStartsWith?: string;
    readonly textContains?: string;
    readonly depthEquals?: number;
    readonly inlineKind?: InlineKind;
    readonly inlineValueContains?: string;
}

export interface SegmentPattern {
    readonly id: string;
    readonly predicates: readonly SegmentPredicate[];
}

export interface Hit {
    readonly patternId: string;
    readonly path: string;
    readonly index: number;
    readonly segments: readonly Segment[];
    readonly span: Span;
}

export interface Edit {
    readonly path: string;
    readonly start: number;
    readonly end: number;
    readonly replacement: string;
    readonly reason: string;
}

export type Verdict = "fail" | "pass";

export const REMEDIATION_ACTIONS = [
    "rename",
    "move",
    "create-folder",
    "declare",
    "delete",
    "split",
    "classify",
    "none",
] as const;

export type RemediationAction = (typeof REMEDIATION_ACTIONS)[number];

export interface Remediation {
    readonly action: RemediationAction;
    readonly from: string | null;
    readonly to: string | null;
    readonly target: string;
    readonly deterministic: boolean;
    readonly decide: string | null;
}

export interface StackFrame {
    readonly check: string;
    readonly resolved: string;
}

export interface Finding {
    readonly rule: string;
    readonly path: string;
    readonly line: number;
    readonly locus: string;
    readonly stack: readonly StackFrame[];
    readonly actual: string;
    readonly expected: string | null;
    readonly remediation: Remediation;
    readonly healed: boolean;
}

export type FindingBuilder = (kind: string, locus: string, actual: string, expected: string, decide: string) => Finding;

export interface HitRecord {
    readonly pattern: string;
    readonly path: string;
    readonly line: number;
    readonly text: string;
}

export interface EditRecord {
    readonly path: string;
    readonly reason: string;
    readonly start: number;
    readonly end: number;
    readonly replacement: string;
}

export interface Coverage {
    readonly roots: readonly string[];
    readonly filesByExtension: Readonly<Record<string, number>>;
}

export interface Report {
    readonly tool: string;
    readonly verdict: Verdict;
    readonly scanned: number;
    readonly findings: readonly Finding[];
    readonly hits: readonly HitRecord[];
    readonly edits: readonly EditRecord[];
    readonly rejected: readonly EditRecord[];
    readonly coverage: Coverage;
}

export type RenameMap = Readonly<Record<string, string>>;

export interface ApplyResult {
    readonly text: string;
    readonly applied: readonly Edit[];
    readonly rejected: readonly Edit[];
}
