import type { Finding } from "./segment.types.ts";

export interface UnreadInterval {
    readonly keys: readonly string[];
    readonly agents: readonly string[];
    readonly earliest: number;
    readonly latest: number;
}

export type Verdict = "first-seen" | "not-comparable" | "relocated" | "shortened" | "unchanged";

export interface Extent {
    readonly lifetime: string;
    readonly anchors: readonly string[];
    readonly mark: string;
}

export interface Retained {
    readonly range: string;
    readonly anchorKinds: readonly string[];
    readonly surfaces: Readonly<Record<string, Extent>>;
}

export interface Measured {
    readonly current: Map<string, Extent>;
    readonly frozen: Set<string>;
    readonly frozenAnchors: Set<string>;
}

export interface Judgment {
    readonly path: string;
    readonly verdict: Verdict;
    readonly finding: Finding | null;
    readonly renamed: string | null;
    readonly memberless: boolean;
}

export interface Comparison {
    readonly carried: Retained;
    readonly current: ReadonlyMap<string, Extent>;
    readonly findings: Finding[];
    readonly memberless: string[];
    readonly renamed: string[];
    readonly retained: Retained | null;
    readonly surfaces: Record<string, Extent>;
    readonly verdicts: Record<string, Verdict>;
}
