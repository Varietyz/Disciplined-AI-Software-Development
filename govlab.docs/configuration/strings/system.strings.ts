export const SYSTEM_HEADINGS = {
    context: "System context and trust boundaries",
    data: "Data model",
    deferred: "Runtime boundary (out of scope)",
    deployment: "Deployment topology",
    dispatch: "Declared dynamic dispatch",
    messages: "Cross-process message contract",
    security: "Security decision points",
} as const;

export const SYSTEM_DESCRIPTIONS = {
    context: "components grouped by trust boundary; edges are declared cross-component message flows",
    data: "declared persistence entities and their relations",
    deployment: "declared deployment services and their dependencies",
    dispatch: "declared dispatch tables and the handlers each key resolves to; imperative dispatch is out of scope",
    messages: "declared cross-component message contract; message types, not an executed sequence",
    security: "declared security decision points and the components that enforce them",
} as const;

export const SYSTEM_DOC = {
    lead: "Generated from declared system sources. These are static contract views of what the system declares; they are not runtime-behavioral traces. Where edges exist only in imperative code, the declared subset is shown and the runtime portion is noted as out of scope.",
    summary:
        "The generated static system-architecture views — one section per model slice the system actually declares.",
} as const;

export const RUNTIME_DEFERRED: readonly string[] = [
    "Executed gate stage ordering (the orchestrator sequences it imperatively; only the declared workspace set is shown)",
    "Rule-to-file resolution (every rule globs the tree at lint time)",
    "Registry self-registration edges inside the application member (discovered by import.meta.glob, never declared)",
];

export const DISPATCH_TABLE = "govlab ecosystem router";

export const ENFORCED_BY = "enforced by";

export const systemTitle = function systemTitle(name: string): string {
    return `${name} System Architecture`;
};

export const viewTitle = function viewTitle(name: string, view: string): string {
    return `${name} ${view}`;
};

export const securityLabel = function securityLabel(label: string, decision: string): string {
    return `${label}: ${decision}`;
};

export const SYSTEM_VIEWS = {
    context: "system context",
    data: "data model",
    deployment: "deployment topology",
    dispatch: "declared dynamic dispatch",
    messages: "cross-process message contract",
    security: "security decision points",
} as const;

export const systemHardening = function systemHardening(
    out: string,
    code: string,
    detail: string,
    line: number,
): string {
    return `${out} failed hardening: [${code}] ${detail} (line ${line})`;
};

export const systemRegenerated = function systemRegenerated(out: string): string {
    return `system-charts: regenerated ${out}`;
};

export const systemUpToDate = function systemUpToDate(out: string): string {
    return `system-charts: ${out} up to date`;
};

export const systemWrote = function systemWrote(out: string): string {
    return `system-charts: wrote ${out}`;
};
