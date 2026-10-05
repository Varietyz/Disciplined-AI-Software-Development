export const FINDING_KINDS = {
    callCycle: "call-cycle",
    crossConcern: "cross-concern",
    deadCode: "dead-code",
    duplicate: "duplicate-definition",
    importCycle: "import-cycle",
} as const;

export const REMEDY: ReadonlyMap<string, string> = new Map([
    [
        FINDING_KINDS.callCycle,
        "invert a dependency to break the cycle (extract an interface / event / dispatch table) — dependency-inversion",
    ],
    [
        FINDING_KINDS.importCycle,
        "re-home shared code or add a shared abstraction so the module graph stays a DAG — zero_cross_module_reachin",
    ],
    [FINDING_KINDS.duplicate, "single-source the definition and re-export it — single-source-of-truth"],
    [FINDING_KINDS.deadCode, "remove it — no consumer references it — dead-code elimination"],
    [FINDING_KINDS.crossConcern, "split into per-concern collaborators — single-responsibility"],
]);

export const DEAD_DETAIL = "module-level, not exported, never referenced beyond its declaration — dead code";

export const cycleDetail = function cycleDetail(count: number, members: string): string {
    return `mutual-recursion cycle among ${count} definitions: ${members}`;
};

export const importCycleDetail = function importCycleDetail(count: number, members: string): string {
    return `import cycle across ${count} modules: ${members}`;
};

export const duplicateDetail = function duplicateDetail(count: number, files: string): string {
    return `identical definition in ${count} files: ${files}`;
};

export const crossConcernDetail = function crossConcernDetail(count: number): string {
    return `calls into ${count} distinct concerns — a cross-concern orchestrator`;
};

export const MEMBER_ARROW = " → ";
