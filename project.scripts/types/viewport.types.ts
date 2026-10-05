export interface ViewportOptions {
    readonly outDir: string;
    readonly routes: readonly string[];
    readonly browser: string | null;
    readonly width: number;
    readonly height: number;
    readonly settleMs: number;
    readonly timeoutMs: number;
    readonly software: boolean;
}

export interface ViewportRules {
    readonly inputMinPx: number;
    readonly textMinPx: number;
    readonly targetMinPx: number;
    readonly tolerancePx: number;
    readonly scrollRootId: string;
    readonly scrollPauseMs: number;
    readonly hiddenSelector: string;
    readonly drawingSelector: string;
    readonly fieldSelector: string;
    readonly targetSelector: string;
    readonly inlineSelector: string;
    readonly cuttingOverflow: readonly string[];
}

export interface ViewportAudit {
    readonly viewport: number;
    readonly scrollsSideways: boolean;
    readonly overflow: readonly string[];
    readonly inputs: readonly string[];
    readonly text: readonly string[];
    readonly targets: readonly string[];
    readonly clipped: readonly string[];
}

export interface LayoutFindings {
    readonly overflow: readonly string[];
    readonly clipped: readonly string[];
    readonly text: readonly string[];
}

export interface ControlFindings {
    readonly inputs: readonly string[];
    readonly targets: readonly string[];
}

export type ProbePage = Pick<Window, "document" | "getComputedStyle" | "innerWidth">;

export interface ViewportProbe {
    readonly pixelsOf: (value: string) => number;
    readonly describeElement: (element: Element) => string;
    readonly countedEntries: (keys: readonly string[]) => readonly string[];
    readonly isAuditable: (page: ProbePage, rules: ViewportRules, element: Element) => boolean;
    readonly escapesScreen: (page: ProbePage, rules: ViewportRules, element: Element) => boolean;
    readonly widestDescendant: (element: Element) => Element | null;
    readonly clippedEntry: (
        page: ProbePage,
        rules: ViewportRules,
        probe: ViewportProbe,
        element: Element,
    ) => string | null;
    readonly smallTextEntry: (
        page: ProbePage,
        rules: ViewportRules,
        probe: ViewportProbe,
        element: Element,
    ) => string | null;
    readonly layoutFindings: (page: ProbePage, rules: ViewportRules, probe: ViewportProbe) => LayoutFindings;
    readonly controlFindings: (page: ProbePage, rules: ViewportRules, probe: ViewportProbe) => ControlFindings;
}

export interface BuiltSite {
    readonly origin: string;
    readonly close: () => void;
}

export interface ViewportResult {
    readonly route: string;
    readonly audit: ViewportAudit;
}
