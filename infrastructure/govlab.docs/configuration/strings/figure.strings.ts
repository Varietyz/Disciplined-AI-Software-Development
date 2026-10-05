export const KIND_LEGEND: readonly string[] = [
    "green = entry/factory",
    "amber = collaborator",
    "red = decision/gate",
    "blue = hook",
    "purple = registry/store",
    "gray = method",
    "solid arrow = call, thick = hook, dotted = teardown/data",
];

export const DIAGRAM_TITLES = {
    dataFlow: "Data flow",
    dependency: "Dependencies",
    flow: "Logical flow",
    lifecycle: "Lifecycle (npm scripts)",
    sequence: "Orchestration",
    state: "Lifecycle",
    structure: "Structure",
    typeRelationship: "Type relationships",
} as const;

export const DIAGRAM_LEGENDS = {
    dataFlow: "dotted arrow = construction / data dependency",
    dependency: ["dotted arrow = @govlab sibling dependency"],
    lifecycle: ["green = npm script", "amber = tool", "purple = file", "arrow = runs"],
    sequence: ["numbered = call order", "async arrow -) = an awaited call from the entry to a collaborator"],
    state: ["[*] = initial state", "arrow = a transition in the detected transition table"],
    typeRelationship: ["<|.. = extends/implements", "o-- = has-a (property type)", "..> = uses (type alias)"],
} as const;

export const DIAGRAM_DESCRIPTIONS = {
    dataFlow: "construction and data-flow dependency wiring resolved from source",
    flow: "entry to exit call flow with branches, hooks, and teardown",
    lifecycle: "how npm scripts compose the run, build, dev, and test lifecycle",
    sequence: "ordered awaited collaborator calls from the entry",
    state: "states and transitions detected from the status union and transition table",
    structure: "factory, collaborators, and registries",
    typeRelationship:
        "exported type relationships resolved from source: realization = extends/implements, aggregation = has-a, dependency = uses",
} as const;

export const dataFlowTitle = function dataFlowTitle(module: string): string {
    return `${module} data flow`;
};

export const flowTitle = function flowTitle(module: string, caption: string): string {
    return `${module} flow: ${caption}`;
};

export const lifecycleTitle = function lifecycleTitle(module: string): string {
    return `${module} npm-script lifecycle`;
};

export const orchestrationTitle = function orchestrationTitle(module: string): string {
    return `${module} orchestration`;
};

export const stateTitle = function stateTitle(module: string): string {
    return `${module} lifecycle`;
};

export const structureTitle = function structureTitle(module: string): string {
    return `${module} structure`;
};

export const typeRelationshipTitle = function typeRelationshipTitle(module: string): string {
    return `${module} type relationships`;
};

export const truncationNote = function truncationNote(budget: number, total: number): string {
    return `showing ${budget} of ${total} data edges (budget)`;
};

export const moreNodes = function moreNodes(count: number): string {
    return `plus ${count} more`;
};

export const chartsHeading = function chartsHeading(module: string): string {
    return `# ${module} — architecture charts`;
};

export const legendLine = function legendLine(legend: readonly string[]): string {
    return `Legend: ${legend.join(" - ")}`;
};

export const SOURCES_SUMMARY = "<details><summary>Node sources</summary>";

export const SOURCES_TABLE_HEAD: readonly string[] = ["| Node | Source |", "| --- | --- |"];

export const SOURCES_CLOSE = "</details>";
