import type { KindDefinition } from "#types/architecture.types";

export const KIND_TAXONOMY: readonly KindDefinition[] = [
    {
        definitionSignatures: ["a defect where", "a defect in which", "a failure that", "an undesirable"],
        discriminator: "an undesirable, recurring solution or condition that a well-designed system avoids",
        distinguishesFrom:
            "vs quality-attribute — it is a thing to eliminate, not a good property; it is referenced only via conflicts_with",
        kind: "anti-pattern",
    },
    {
        definitionSignatures: ["a measure of", "the rate at which", "the resource or financial"],
        discriminator: "a quantitative measure or rate tracked as a number",
        distinguishesFrom:
            "vs quality-attribute — the measurement itself (Cost, Latency), not the property being measured (Performance)",
        kind: "metric",
    },
    {
        definitionSignatures: [
            "the degree to which",
            "the ease with which",
            "the extent to which",
            "the proportion of time",
        ],
        discriminator: "a desirable property a system exhibits to a degree ('the degree to which…')",
        distinguishesFrom: "vs capability — a property the system has more or less of, not a discrete thing it can do",
        kind: "quality-attribute",
    },
    {
        definitionSignatures: [],
        discriminator: "a normative design rule prescribing how to build ('you should…')",
        distinguishesFrom: "vs constraint — a prescriptive ideal/value, not a hard boundary that must hold",
        kind: "principle",
    },
    {
        definitionSignatures: [
            "predefined conditions",
            "a rule or precondition",
            "a clear assignment of responsibility",
        ],
        discriminator: "a rule or precondition that must hold for correctness or acceptance ('requires that…')",
        distinguishesFrom: "vs principle — a binding boundary/requirement, not a prescriptive ideal",
        kind: "constraint",
    },
    {
        definitionSignatures: ["the ability to", "the ability of", "the capacity to"],
        discriminator: "a discrete ability the system gains ('the ability to…')",
        distinguishesFrom: "vs mechanism — what can be done, not the concrete facility that provides it",
        kind: "capability",
    },
    {
        definitionSignatures: ["the activity of", "the act of", "the practice of"],
        discriminator: "an action or process that is performed ('the activity of …-ing')",
        distinguishesFrom: "vs technique — the doing itself, not the reusable method for doing it",
        kind: "activity",
    },
    {
        definitionSignatures: ["an architecture that", "an architecture isolating", "a design pattern"],
        discriminator: "a named, reusable structural solution to a recurring design problem",
        distinguishesFrom: "vs mechanism — a design-level arrangement of parts, not a concrete runtime facility",
        kind: "pattern",
    },
    {
        definitionSignatures: ["a facility that", "a mechanism that"],
        discriminator: "a concrete facility or means that implements behavior at runtime ('a facility that…')",
        distinguishesFrom: "vs technique — a runtime thing that operates, not a method a person or tool applies",
        kind: "mechanism",
    },
    {
        definitionSignatures: ["a technique for", "a method for"],
        discriminator: "a repeatable method or skill applied to achieve a result ('a technique for…')",
        distinguishesFrom: "vs approach — a specific method, not a broad guiding strategy",
        kind: "technique",
    },
    {
        definitionSignatures: ["an approach in which", "a strategy for", "a paradigm"],
        discriminator: "a broad strategy or paradigm for tackling a class of problems",
        distinguishesFrom: "vs style — a problem-solving strategy, not a convention of expression",
        kind: "approach",
    },
    {
        definitionSignatures: ["a conceptual representation", "an abstraction of"],
        discriminator: "a conceptual representation or abstraction of a domain, data, or behavior ('a model of…')",
        distinguishesFrom: "vs artifact — the conceptual representation, not a concrete produced instance of it",
        kind: "model",
    },
    {
        definitionSignatures: [
            "a formal definition of",
            "a precise, authoritative description",
            "descriptive data about",
        ],
        discriminator: "a concrete produced or consumed thing — a document, schema, or data",
        distinguishesFrom: "vs mechanism — a static thing produced or read, not active behavior",
        kind: "artifact",
    },
    {
        definitionSignatures: ["a convention of"],
        discriminator: "a convention of expression or organization ('a … style')",
        distinguishesFrom: "vs approach — how something is written or arranged, not the strategy for solving",
        kind: "style",
    },
];

export const KIND_DECISION_ORDER: readonly string[] = KIND_TAXONOMY.map((entry) => entry.kind);

export const CANONICAL_KINDS: ReadonlySet<string> = new Set(KIND_DECISION_ORDER);
