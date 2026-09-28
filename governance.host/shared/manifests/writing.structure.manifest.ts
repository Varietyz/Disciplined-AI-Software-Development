import type { CanonRule } from "../../types/writing.types.ts";

export const STRUCTURE_RULES: readonly CanonRule[] = [
    {
        bans: [],
        checks: [],
        conditions: ["a title is linked only at its first mention on a page"],
        examples: [
            {
                rejected:
                    "Narrowing is where a correct check silently loses its subject, and it is the point where a check matches a shape has to stay true.",
                repaired:
                    "…so after every change to its scope I run the original case again, as described in A check matches a shape.",
                why: "The section title is grammar in the sentence.",
            },
        ],
        gate: null,
        id: "prose.section-mentions",
        rule: 'A section title in a sentence takes a phrase such as "as described in …" and is never part of the grammar.',
        why: "Without the link styling the sentence does not parse.",
    },
    {
        bans: ["a connector that only rephrases", "a connector where the relation is already obvious"],
        checks: [],
        conditions: [
            "a section may open with one sentence stating its topic, as navigation",
            "addition: in addition, also, another",
            "contrast: however, on the other hand, in contrast",
            "cause: because, since, as a result",
            "consequence: therefore, so, for this reason",
            "sequence: first, then, after this, finally",
            "example: for example, such as",
            "reference back: as described in, as shown in",
        ],
        examples: [
            {
                rejected:
                    "Code runs, but nothing holds its structure. The constraints are ones a check can decide: a file size limit, a closed set of names, a direction for dependencies, and a fixed grammar for folders and file names.",
                repaired: null,
                why: "The developer rejected the post as jumping from concept to concept with no flow and no transition.",
            },
        ],
        gate: null,
        id: "prose.transitions",
        rule: "When the relation between two paragraphs is not obvious, a connector names it.",
        why: "An implicit relation is left for the reader to infer.",
    },
    {
        bans: [
            "an intro that states the section's principle",
            "a visible label marking a lesson part on the methodology and architecture pages",
        ],
        checks: [
            { detection: "check", enforcedIn: ["prose"], id: "field-mood" },
            { detection: "check", enforcedIn: ["prose"], id: "no-field-restatement" },
        ],
        conditions: [
            'the principle opens with "For this reason…"',
            'the decision describes the ruling and carries "…rather than…"',
            'the application opens with "In practice, …" and describes rather than orders',
            'the validation opens with "To check this, …"',
            "the boundary states a limit",
            "a field marked imperative in LESSON_FIELD_MOODS never opens with an article, a pronoun or a subordinator",
        ],
        examples: [
            {
                rejected:
                    "The principle restates the decision in general terms, and the decision restates the principle as an order.",
                repaired: "The principle names the mechanism. The decision names the choice between two alternatives.",
                why: "Each field repeats the other.",
            },
        ],
        gate: "local/strings-lesson-fields, local/strings-composition",
        id: "prose.lesson-fields",
        rule: "Each lesson field answers its own question in its fixed voice.",
        why: "The fields flow into one paragraph, so a repeat reads as an echo.",
    },
    {
        bans: [
            '"<cite>x</cite> draws" or any odd verb with the figure as subject',
            'a figure referred to by position ("below", "on the right")',
            'a hand-written ordinal ("Figure 2")',
        ],
        checks: [],
        conditions: ["a diagram or code block is introduced in the text before it appears"],
        examples: [],
        gate: "local/strings-derived-numbering",
        id: "prose.cite",
        rule: 'A figure is named by its caption as "as shown in <cite>x</cite>" or "<cite>x</cite> shows…".',
        why: "Position changes between desktop and mobile, and the number is derived.",
    },
    {
        bans: [],
        checks: [],
        conditions: [
            "the chapter opening says what it covers, why the developer needs it, how it follows the chapter before, and closes with the sections in order",
            "a section runs through the situation, the idea, how it works, who does what, when to use it and how to check it",
            "a page opens with an overview of its parts and the order they are read in",
        ],
        examples: [],
        gate: null,
        id: "prose.shape",
        rule: "A page, a chapter and a section each follow the shape their content fits, and each part is marked.",
        why: "The reader always knows which part is being read.",
    },
];
