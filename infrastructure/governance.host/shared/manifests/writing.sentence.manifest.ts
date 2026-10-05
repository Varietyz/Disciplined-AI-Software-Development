import type { CanonRule } from "../../types/writing.types.ts";

export const SENTENCE_RULES: readonly CanonRule[] = [
    {
        bans: ['a trailing "of that <noun>" clause', "a repeated subject"],
        checks: [],
        conditions: ["the noun repeats only where a pronoun could point to two things"],
        examples: [
            {
                rejected: "Each layer edge kind is listed with its definition and the topology edges of that kind.",
                repaired: "Each layer edge kind is listed with its definition and the topology edges that carry it.",
                why: '"Kind" comes back in the trailing clause.',
            },
            {
                rejected: "The developer follows the principle unless the developer has a reason to depart from it.",
                repaired: "A principle that applies by default and gives way to a stated reason.",
                why: "The subject comes back, and a definition slot takes the form of its neighbors.",
            },
        ],
        gate: null,
        id: "root.noun-once",
        rule: "A noun is named once per sentence.",
        why: "A repeated noun where a pronoun has one reading sounds generated.",
    },
    {
        bans: ['"that is <term>."', '"this means that"'],
        checks: [{ detection: "check", enforcedIn: ["prose", "document"], id: "no-comment-on-previous" }],
        conditions: ['"This is done by…" adds a mechanism and passes'],
        examples: [
            {
                rejected:
                    "A fix is applied, re-validated and converges, so applying it twice changes nothing. That is idempotency.",
                repaired: "A fix is idempotent: applying it twice changes nothing.",
                why: "The second sentence exists only to hang a label.",
            },
        ],
        gate: "local/strings-composition",
        id: "root.no-comment-on-previous",
        rule: "A sentence never exists to comment on, label or re-explain the sentence before it.",
        why: "A sentence that points back adds no fact.",
    },
    {
        bans: [],
        checks: [
            { detection: "check", enforcedIn: ["prose", "document"], id: "no-restatement" },
            { detection: "review", enforcedIn: [], id: "no-implied-fact" },
        ],
        conditions: [
            "elaboration that unpacks a term into its meaning adds information and passes",
            "the check reports near-verbatim repeats, and review holds paraphrase and implication",
        ],
        examples: [
            {
                rejected: "Every piece of work here has the same shape. Work has one shape, and the shape is the loop.",
                repaired: "Every piece of work passes through the same ten steps.",
                why: "One proposition is said twice.",
            },
            {
                rejected: "Read the output whole. A partial read is not a whole read.",
                repaired: "Read the output whole.",
                why: "The second sentence spells out what the first implies.",
            },
        ],
        gate: "local/strings-composition",
        id: "root.say-it-once",
        rule: "Each proposition is said once, and an implication the reader already drew is not spelled out.",
        why: "A repeated proposition reads as two facts. The reader looks for the difference, finds none, and trusts the rest less.",
    },
    {
        bans: [],
        checks: [{ detection: "check", enforcedIn: [], id: "one-instruction-per-sentence" }],
        conditions: [],
        examples: [
            {
                rejected: "Read the report and fix the first finding, then run the gate again.",
                repaired: "Read the report. Fix the first finding. Run the gate again.",
                why: "Three instructions share one sentence.",
            },
        ],
        gate: "local/strings-sentence-shape",
        id: "root.one-instruction",
        rule: "One sentence carries one instruction.",
        why: "The reader carries out a sentence as one step, so a second instruction in it hides the order and can be skipped.",
    },
    {
        bans: [
            "a fragment",
            "clauses joined by a comma alone",
            "clauses joined by a semicolon",
            "a long dash joining two thoughts",
            "stacked short sentences for rhythm",
        ],
        checks: [
            { detection: "check", enforcedIn: ["document"], id: "no-semicolon" },
            { detection: "check", enforcedIn: ["document"], id: "no-long-dash" },
        ],
        conditions: ["a tagline, a label or a card line may stay a phrase, and a phrase carries no full stop"],
        examples: [
            {
                rejected: "The tooling detects — the model repairs — you verify.",
                repaired: "The tooling detects. The model repairs. You verify.",
                why: "The dash hides a sentence boundary.",
            },
            {
                rejected: "The report is written on every exit path; a present report is not a passing one.",
                repaired: "The report is written on every exit path. A present report is not a passing one.",
                why: "The semicolon joins two sentences.",
            },
            {
                rejected: "The number moved. What changed more is who enforces it.",
                repaired: "The cap rose from 150 to 200 lines, and the line-cap step now enforces it.",
                why: "Two short sentences built for rhythm split one fact.",
            },
        ],
        gate: "local/strings-punctuation",
        id: "root.complete-clauses",
        rule: "Every sentence has a subject and a finite verb, and two clauses are two sentences or joined by a conjunction.",
        why: "A fragment or a spliced clause makes the reader rebuild the sentence.",
    },
    {
        bans: [],
        checks: [{ detection: "check", enforcedIn: ["prose", "document"], id: "sentence-cap" }],
        conditions: [
            "the cap is seeded from the longest sentence the tone baseline measured, and lowered as copy is rewritten",
        ],
        examples: [],
        gate: "local/strings-sentence-shape",
        id: "root.sentence-cap",
        rule: "A sentence stays under the word cap.",
        why: "A long sentence carries a nested clause the reader has to unpack. Shortening is not a repair of any other rule.",
    },
];
