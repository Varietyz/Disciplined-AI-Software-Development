import type { CanonLayer, FieldMood } from "../../types/writing.types.ts";
import { LAYER_TITLES } from "../strings/writing.strings.ts";
import { SOURCE_RULES } from "./writing.source.manifest.ts";
import { STRUCTURE_RULES } from "./writing.structure.manifest.ts";
import { relativePath } from "@ssot/paths";

export const LESSON_FIELD_MOODS: Readonly<Record<string, FieldMood>> = {
    application: "imperative",
    boundary: "declarative",
    cause: "declarative",
    decision: "declarative",
    failureMode: "declarative",
    principle: "declarative",
    problem: "declarative",
    validation: "imperative",
};

export const PROSE_LAYER: CanonLayer = {
    covers: ["chapters, sections and lesson fields", "section and page intros", "page descriptions and the FAQ"],
    defersTo: [
        {
            covers: "the reference texts quoted trait by trait, and the accepted home-page copy",
            path: `${relativePath("docArch.root")}/guides/author-teaching-copy.web.guide.md`,
        },
        {
            covers: "the voice as measured from the author's published writing",
            path: `${relativePath("docArch.references")}/tone-profile.web.reference.md`,
        },
    ],
    id: "prose",
    intro: "Teaching copy explains a practice to a developer who is learning it.",
    rules: [
        {
            bans: [
                "a dictionary-definition opener in a teaching passage",
                '"the developer" or "the method" as the subject of an explanation',
                "an aphorism as the last sentence",
                "a heading the developer did not write",
            ],
            checks: [],
            conditions: [
                "an opening that introduces a page or a project says what the thing is, concretely",
                "a profile opens on its author and the work they do, and the practice follows as context",
                '"you" for the reader, "I" for the author\'s practice',
                "contractions are allowed",
            ],
            examples: [
                {
                    rejected: "A rule is a constraint the code must satisfy, such as a limit on file length.",
                    repaired: "Telling a model about a rule works for a while.",
                    why: "It opens on a definition and sounds like a system describing itself.",
                },
                {
                    rejected:
                        "A check that has never failed on purpose cannot be told apart from one that is unable to fail.",
                    repaired: "Only then do I know it can tell the two apart.",
                    why: "It closes on a slogan.",
                },
                {
                    rejected:
                        "I build software with an LLM that writes most of the code, and most of my work goes into the method behind it.",
                    repaired:
                        "I design and govern software systems: greenfield builds, legacy modernization, architectural refactoring and automation, in whatever language or domain the system calls for.",
                    why: "A profile opens on the method before its author, and the word most returns within one sentence.",
                },
                {
                    rejected:
                        "Stockfish fits that picture, because it evaluates every position the same way, however the game got there.",
                    repaired: null,
                    why: "The developer rejected the reply as distant.",
                },
                {
                    rejected: "I built Bane's Lab to write down how I work with LLMs that write most of my code.",
                    repaired: "Bane's Lab is about how you can work structurally with LLMs to write your code.",
                    why: "The developer rejected a post for a public audience that is littered with I, where the reader and what they can do should be the subject.",
                },
            ],
            gate: null,
            id: "prose.target-sound",
            rule: "A passage reads as one person explaining their practice to another, tells a failure in time and ends on the plain consequence.",
            why: "The developer rejected the dictionary-definition model as robot-like.",
        },
        {
            bans: ["a term used before the reader can tell what it means", "a term the passage never needs again"],
            checks: [
                { detection: "review", enforcedIn: [], id: "concrete-before-name" },
                { detection: "review", enforcedIn: [], id: "one-new-concept-per-step" },
            ],
            conditions: [
                "a term is made clear by what it does, in the sentence that needs it",
                "the content graph records what each section teaches, so review checks the count against it",
            ],
            examples: [
                {
                    rejected: "A plan is one traversal whose act node produces phases.",
                    repaired:
                        "A plan contains phases, each phase contains tasks, and each level decides whether it may proceed. One pass through that decision is a traversal.",
                    why: "The name comes before the reader has seen the case.",
                },
                {
                    rejected:
                        "The four gates never fold whatever the size: worth is decided before any effort, an operation is admitted before it is trusted, a claim needs evidence before it is committed.",
                    repaired:
                        "Four of the steps are gates. The first asks whether the work is worth doing before the developer starts it.",
                    why: "Three new concepts arrive in one sentence.",
                },
            ],
            gate: null,
            id: "prose.concept-order",
            rule: "A concept appears as a concrete case before it gets its name, and a sentence introduces at most one new concept.",
            why: "A name with nothing to attach to is a word to memorize.",
        },
        {
            bans: [],
            checks: [],
            conditions: ["a slogan is at most the closing summary of an explanation"],
            examples: [
                {
                    rejected: "A rule without a check is a wish.",
                    repaired: null,
                    why: "It states the verdict and stops.",
                },
            ],
            gate: null,
            id: "prose.state-then-explain",
            rule: "A claim is followed by the reasoning that supports it and, where it helps, by the consequence of ignoring it.",
            why: "A declared conclusion leaves the reasoning implicit.",
        },
        {
            bans: ["a closing verdict in place of a limit"],
            checks: [],
            conditions: ["the boundary field states where the lesson stops"],
            examples: [],
            gate: null,
            id: "prose.balance",
            rule: "A practice is described with where it helps and where it does not apply.",
            why: "A claim with no limit reads as a sales line.",
        },
        {
            bans: [],
            checks: [],
            conditions: [
                "a definition is followed by two or three short scenarios in different contexts",
                "an analogy is announced, with what maps to what",
            ],
            examples: [],
            gate: null,
            id: "prose.examples",
            rule: "A concept gets varied examples, and an analogy says that it is one.",
            why: "One instance is mistaken for the concept, and an unannounced analogy reads as a literal claim.",
        },
        {
            bans: [],
            checks: [],
            conditions: [
                "principles and chapters take an expository voice",
                "personal pages, such as the FAQ, take the first person with an example from the author's own work",
            ],
            examples: [],
            gate: null,
            id: "prose.voice-and-check",
            rule: "The voice matches the page, and a validation can be put as guiding questions.",
            why: "A question invites the reader to run the test, while a verdict only tells the result.",
        },
        ...STRUCTURE_RULES,
        ...SOURCE_RULES,
    ],
    title: LAYER_TITLES.prose,
};
