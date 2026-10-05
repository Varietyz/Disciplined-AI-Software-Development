export const FINDING_CATEGORIES: readonly string[] = [
    "spine",
    "agentSchema",
    "docStatus",
    "sections",
    "location",
    "conventions",
    "mermaid",
    "syntax",
    "broken",
    "refs",
    "refsResolved",
    "ontologyRefs",
    "slotRefs",
    "smell",
];

export const PINNED_LINE_CATEGORIES: ReadonlySet<string> = new Set(["sections", "location"]);

export const SUMMARY_ORDER = [
    "spine",
    "agentSchema",
    "docStatus",
    "sections",
    "location",
    "name",
    "collision",
    "deadEdge",
    "conventions",
    "mermaid",
    "syntax",
    "broken",
    "refs",
    "refsResolved",
    "ontologyRefs",
    "slotRefs",
    "smell",
] as const;

export const FIRST_POSITION = 1;
