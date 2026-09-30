import type { CanonRule } from "../../types/writing.types.ts";

export const COMPOSITION_RULES: readonly CanonRule[] = [
    {
        bans: ["rewording a truism"],
        checks: [],
        conditions: [
            "a truism says what the reader already has: what a name means, what the layout shows, what the interaction shows, or what the sentence before said",
            'a trailing "rather than X" or "never X" that only negates what the positive clause already rules out is a truism',
        ],
        examples: [
            {
                rejected: "The commercial license grants full commercial rights for use in commercial products.",
                repaired: "The commercial license covers products, paid services and enterprise applications.",
                why: "The name is said back three times.",
            },
            {
                rejected:
                    "A run stops when saturation, completion and verification all hold, or when it is blocked on something outside it, and never on confidence alone.",
                repaired:
                    "A run stops when saturation, completion and verification all hold, or when it is blocked on something outside it.",
                why: "The stop conditions already exclude confidence.",
            },
            {
                rejected: "The figures you enter stay on this page until you email the estimate yourself.",
                repaired: null,
                why: "The form and its email button already show that nothing is sent until the reader sends it.",
            },
            {
                rejected: "An estimate here is a starting point, and the quote I send after a first call replaces it.",
                repaired: null,
                why: "The word estimate already says it is not a quote, so the sentence is a disclaimer that adds no fact.",
            },
            {
                rejected: "Each one is a single purchase under the terms on the licensing page.",
                repaired: "The licensing page sets the terms for every package.",
                why: "The one-off badge on each package already says it is a single purchase.",
            },
            {
                rejected:
                    "reads the gate artifact back and reports per-stage pass or fail. An absent artifact is reported as absent, never as a pass.",
                repaired:
                    "reads the gate artifact back and reports per-stage pass or fail, or that no gate run was recorded.",
                why: "Reporting an absent thing as absent says the word back, and the trailing never-clause negates what the first clause already rules out.",
            },
            {
                rejected:
                    "The tag follows what the file holds, never a folder-wide rename. A code file that declares one asset location is a unit, and one that declares several is a collection.",
                repaired: null,
                why: "Both sentences are truisms, because the table row above already states the rule. The never-clause also narrates the model's own mistake into a document that states what is true now.",
            },
        ],
        gate: null,
        id: "root.cut-truisms",
        rule: "The model covers each sentence and asks what the reader lost, and a sentence whose loss is nothing is cut.",
        why: "Rewording keeps the truism.",
    },
];
