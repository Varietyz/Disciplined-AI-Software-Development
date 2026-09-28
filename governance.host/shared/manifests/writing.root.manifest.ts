import type { CanonLayer } from "../../types/writing.types.ts";
import { LAYER_TITLES } from "../strings/writing.strings.ts";
import { SENTENCE_RULES } from "./writing.sentence.manifest.ts";
import { WORD_RULES } from "./writing.word.manifest.ts";
import { relativePath } from "@ssot/paths";

const MANIFESTS = `${relativePath("govlabHost.shared")}/manifests`;

export const ROOT_LAYER: CanonLayer = {
    covers: ["every string in every channel"],
    defersTo: [
        {
            covers: "the openers, filler phrases, indefinite parties and overlap thresholds the composition gate reads",
            path: `${MANIFESTS}/composition.manifest.ts`,
        },
        {
            covers: "the known violations and their one replacement, the retired synonyms and the harness names",
            path: `${MANIFESTS}/vocabulary.manifest.ts`,
        },
    ],
    id: "root",
    intro: "A layer below adds rules for its channel and never loosens these.",
    rules: [
        {
            bans: [],
            checks: [],
            conditions: ["the canon changes between reads, so a read from an earlier session does not count"],
            examples: [],
            gate: null,
            id: "root.read-first",
            rule: "Before writing any string, the model reads the canon whole and checks each sentence against it.",
            why: "From memory, the model applies the version of a rule it remembers, which may not be the version on disk.",
        },
        {
            bans: [],
            checks: [],
            conditions: [
                "the rejected text of an example keeps the words that broke the rule",
                "a new record is walked against the root layer and its own layer before it lands",
            ],
            examples: [
                {
                    rejected: "An arrow in ontology data is written as the arrow sign.",
                    repaired: "Ontology data writes an arrow as the sign →.",
                    why: "The rule itself named its noun twice.",
                },
            ],
            gate: "the writing entry point, which runs the composition analyzer over every record string except rejected text",
            id: "root.canon-conforms",
            rule: "Every record in this canon follows the canon.",
            why: "A record written in the form it bans teaches that form to the next writer who copies it.",
        },
        {
            bans: [
                '"the AI", "an AI" or "the machine" for the model',
                '"the user", "the human", "the person" or "the operator" for the developer',
                "an action given to someone, anyone, nobody or everyone",
                "a passive sentence that hides who acts",
            ],
            checks: [
                { detection: "check", enforcedIn: ["prose", "document"], id: "named-party" },
                { detection: "check", enforcedIn: [], id: "named-agent" },
            ],
            conditions: [
                "legal documents keep their legal parties",
                '"reader" is allowed, because the site uses it as a technical term',
                "first person is correct where the author speaks from their own decisions",
                "the passive is kept for an actor that is unknown or does not matter",
            ],
            examples: [
                {
                    rejected: "A claim about the tree is a lie until someone reads the tree.",
                    repaired:
                        "A claim about the tree is settled only when the model or the developer reads the tree as it is now.",
                    why: "The indefinite pronoun hides which party acts.",
                },
                {
                    rejected: "A file over the cap is rejected.",
                    repaired: "The gate rejects a file over the cap.",
                    why: "The reader cannot tell whether the gate, the developer or the model acts.",
                },
                {
                    rejected: "Only the user calls the stop.",
                    repaired: "Only the developer calls the stop.",
                    why: "The subject names the developer by a banned party name.",
                },
            ],
            gate: "local/strings-composition, local/strings-vocabulary, local/strings-sentence-shape",
            id: "root.named-party",
            rule: "Every action has a named party: the model, the developer or the tooling.",
            why: "Software built with a model has three parties. An indefinite actor hides whose step it is, and the division of labor goes vague.",
        },
        {
            bans: [
                '"I" for two different parties in one piece',
                'one party written as "I" in one sentence and by name in the next',
            ],
            checks: [],
            conditions: [
                "a piece written from the developer's perspective gives every step the model took to the model by name",
                "a quotation keeps the speaker it quotes",
            ],
            examples: [
                {
                    rejected: "I did not open them.",
                    repaired: "The model did not open them.",
                    why: "The review speaks as the developer everywhere else, so this I claims a step the model took.",
                },
            ],
            gate: null,
            id: "root.one-speaker",
            rule: 'A piece keeps one speaker: one party is "I", and every other party is named.',
            why: "When the speaker changes mid-piece, the reader cannot tell who decided, who acted and who is reporting.",
        },
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
                    rejected:
                        "An estimate here is a starting point, and the quote I send after a first call replaces it.",
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
        ...SENTENCE_RULES,
        ...WORD_RULES,
        {
            bans: ["the model framed as doing something reliably"],
            checks: [],
            conditions: [
                "a check, a fixer, a gate or a generator may be described as doing something every time",
                'a validation predicts with "should", and a problem sentence about the model uses "tends to" or "is likely to"',
            ],
            examples: [
                {
                    rejected: "The model reads a request through the fifteen questions before replying.",
                    repaired: "The model is asked to read a request through the fifteen questions before replying.",
                    why: "It states as fact what the model is only asked to do.",
                },
            ],
            gate: null,
            id: "root.model-not-deterministic",
            rule: 'Anything the model is told to do is written as "is asked to…".',
            why: "Determinism comes only from tools outside the model.",
        },
        {
            bans: [],
            checks: [],
            conditions: [
                "ordered steps take a numbered list, parts and properties a bulleted list",
                "each item starts in the same grammatical form",
                "a slot that renders as one paragraph carries a series in one sentence or separate sentences",
            ],
            examples: [],
            gate: null,
            id: "root.lists",
            rule: "More than three items of one kind go into a list, where the slot can carry one.",
            why: "A long series in a sentence hides the items.",
        },
        {
            bans: [
                "a closing line that sums the piece up",
                "a closing line that names its themes after a colon",
                "a closing line that announces what the piece was about",
                "a phrase lifted from the developer's own copy and worn as a sign-off",
            ],
            checks: [],
            conditions: ["the rule holds for copy, posts, notes and descriptions"],
            examples: [],
            gate: null,
            id: "root.end-on-the-fact",
            rule: "An authored piece ends on its last fact.",
            why: "A closing summary repeats what the reader has just read.",
        },
    ],
    title: LAYER_TITLES.root,
};
