import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { runHalf } from "../runners/conduct.runner.ts";
import { corpusOf, observerResolves } from "../resolvers/conduct.resolver.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const ROSTER = "probe.conduct.md";

const ROWS = [
    "| slug | what a check would need | checkable half |",
    "|---|---|---|",
    "| `a-probe-rule` | the act nothing records | |",
    "| `a-second-probe-rule` | the same | `—` |",
    "",
].join("\n");

const SHORT = ["| slug | what a check would need |", "|---|---|", "| `a-probe-rule` | the act nothing records |", ""].join(
    "\n",
);

function stating(root: string, slug: string, value: string): BranchObservation {
    const outcome = runHalf({
        repoRoot: root,
        target: ROSTER,
        slug,
        value,
        registered: ["board", "surface"],
    });

    const after = readFileSync(resolve(root, ROSTER), "utf8");

    return {
        code: outcome.code,
        states: after.includes(`\`${value}\``) && value.length > 0,
        rows: after.split("\n").filter((line) => line.startsWith("| `")).length,
    };
}

const REGISTERED = new Set(["board", "surface"]);

const KEYED = new Set(["board/staleMarker", "board/duplicateField"]);

function resolving(cell: string): BranchObservation {
    return { resolves: observerResolves(cell, REGISTERED, KEYED) };
}

function resolvingWith(cell: string): BranchObservation {
    return { resolves: observerResolves(cell, REGISTERED, new Set([...KEYED, "proof/unfixturedKind"])) };
}

const RULE_IDS = new Set(["board"]);

const STEP_IDS = new Set(["quality"]);

const COMMANDS = new Set(["surface"]);

const STEP_KINDS = new Set(["proof/unfixturedKind"]);

function corpus(cell: string): BranchObservation {
    return { named: corpusOf(cell, RULE_IDS, STEP_IDS, COMMANDS, KEYED, STEP_KINDS) };
}

const SHARED_COMMANDS = new Set(["surface", "board"]);

function sharedCorpus(cell: string): BranchObservation {
    return { named: corpusOf(cell, RULE_IDS, STEP_IDS, SHARED_COMMANDS, KEYED, STEP_KINDS) };
}

export const CONDUCT_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "conduct.rule",
        branch: "two bare members of the SAME shape drawn from different namespaces — a registered rule id and an entry-point command name — where the value's own form separates a keyed pair from a bare member and cannot separate these two from each other, so the cell resolves and only the entry's prose tells a reader which corpus each came from",
        seed: [],
        exercise: () => corpus("board surface"),
        expect: { named: "board → registered rule, surface → entry-point command" },
    },
    {
        subject: "conduct.rule",
        branch: "a pipeline step id and a certified pair, which must each name their OWN corpus rather than collapsing into one bag — a resolution reporting membership without naming the set it was found in publishes the same word for three different facts",
        seed: [],
        exercise: () => corpus("quality board/staleMarker"),
        expect: { named: "quality → pipeline step, board/staleMarker → certified kind" },
    },
    {
        subject: "conduct.rule",
        branch: "a cell naming which of the four questions the half FAILS, which the ruled form admits as its third value and which the resolution refused — a failing question carries no separator, so it was looked up among registered observers where no check is named for a question, and every not-observed entry would have fired",
        seed: [],
        exercise: () => resolving("empty-population"),
        expect: { resolves: true },
    },
    {
        subject: "conduct.rule",
        branch: "a failing question beside an observer pair, which must NOT resolve — a cell states that a half IS observed or WHICH question it fails and never both, so a mixture is a row claiming its half is measured and unmeasurable at once",
        seed: [],
        exercise: () => resolving("empty-population board/staleMarker"),
        expect: { resolves: false },
    },
    {
        subject: "conduct.rule",
        branch: "a question outside the four, which must not resolve — the set comes from the roster's own instrument rather than from whatever an author reaches for, so a fifth reason invented per awkward entry is refused exactly as an unregistered observer is",
        seed: [],
        exercise: () => resolving("too-hard-to-check"),
        expect: { resolves: false },
    },
    {
        subject: "conduct.rule",
        branch: "a STEP-emitted finding id, which carries the separator and is therefore shaped exactly like a certified kind while being derived from a different place — the resolver sent it to the certifier's map where it is absent, so the PRECISE observer fired and the coarse one passed, which trains an author toward the approximation the cell exists to remove",
        seed: [],
        exercise: () => resolvingWith("proof/unfixturedKind"),
        expect: { resolves: true },
    },
    {
        subject: "conduct.rule",
        branch: "the same step id named in the corpus report, which must say which set it came from — a member admitted into the keyed corpus without naming its origin publishes one word for two derived sets and reintroduces the ambiguity the corpus report exists to remove",
        seed: [],
        exercise: () => corpus("proof/unfixturedKind"),
        expect: { named: "proof/unfixturedKind → pipeline step kind" },
    },
    {
        subject: "conduct.rule",
        branch: "a cell naming a rule-and-kind PAIR, which the flat membership test refused because the pair is one string that is not a registered id — so every cell written in the ruled form fired, and the roster could not be authored at the granularity the observation happens at",
        seed: [],
        exercise: () => resolving("board/staleMarker"),
        expect: { resolves: true },
    },
    {
        subject: "conduct.rule",
        branch: "a pair whose KIND the certifier never keyed, which must NOT resolve — the pair form is not a license, and a cell naming a kind nothing emits is the overstatement the join exists to catch",
        seed: [],
        exercise: () => resolving("board/aKindNobodyEmits"),
        expect: { resolves: false },
    },
    {
        subject: "conduct.rule",
        branch: "a bare id with no separator, which still resolves against the REGISTERED set rather than the keyed one — the member's own shape selects its corpus, so a check observing a half at rule granularity is unaffected and no vocabulary was added to say which corpus a value belongs to",
        seed: [],
        exercise: () => resolving("surface"),
        expect: { resolves: true },
    },
    {
        subject: "conduct.rule",
        branch: "a cell naming TWO pairs, where a half is observed by more than one kind — one pair per cell would leave the second observer in the entry's prose, which is a fact a mechanism joins on demoted to payload",
        seed: [],
        exercise: () => resolving("board/staleMarker board/duplicateField"),
        expect: { resolves: true },
    },
    {
        subject: "conduct.rule",
        branch: "two pairs where the SECOND does not resolve, which must fail — a cell reporting the state of several observers takes the one that cannot be overstated, so a list is not a way to smuggle an unresolvable member past the join",
        seed: [],
        exercise: () => resolving("board/staleMarker board/aKindNobodyEmits"),
        expect: { resolves: false },
    },
    {
        subject: "conduct.rule",
        branch: "a member the FAILING-QUESTION vocabulary carries, which the resolver admits and the corpus report published as unresolved — two mechanisms over one value in one file, where the gate reads clean and the report a reader consults calls the same cell broken, so the correct answer and the published one disagreed on most of the roster",
        seed: [],
        exercise: () => corpus("empty-population"),
        expect: { named: "empty-population → failing question" },
    },
    {
        subject: "conduct.rule",
        branch: "one bare member belonging to TWO derived sets, which must be reported as being in both — a report picking by which test runs first names the wrong corpus for exactly the cells that motivated the disambiguation, and a reader with a wrong answer stops where a reader with none looks",
        seed: [],
        exercise: () => sharedCorpus("board"),
        expect: { named: "board → registered rule and entry-point command" },
    },
    {
        subject: "conduct.runner",
        branch: "a row stating a registered check as what observes its half",
        seed: [{ path: ROSTER, text: ROWS }],
        exercise: (root) => stating(root, "a-probe-rule", "board"),
        expect: { code: 0, states: true, rows: 2 },
    },
    {
        subject: "conduct.runner",
        branch: "a value outside the declared set, which reads as governed and resolves in no count",
        seed: [{ path: ROSTER, text: ROWS }],
        exercise: (root) => stating(root, "a-probe-rule", "a-check-nothing-registers"),
        expect: { code: 2, states: false, rows: 2 },
    },
    {
        subject: "conduct.runner",
        branch: "a row stating the question its half fails, which the roster accepts and the form must write rather than refuse",
        seed: [{ path: ROSTER, text: ROWS }],
        exercise: (root) => stating(root, "a-probe-rule", "subject-is-an-act"),
        expect: { code: 0, states: true, rows: 2 },
    },
    {
        subject: "conduct.runner",
        branch: "a slug the roster does not carry, which would assess a rule the coverage walk never ranges over",
        seed: [{ path: ROSTER, text: ROWS }],
        exercise: (root) => stating(root, "a-rule-nobody-declared", "none"),
        expect: { code: 2, states: false, rows: 2 },
    },
    {
        subject: "conduct.runner",
        branch: "a row missing the declared columns, where a form guessing the cell overwrites the evidence with the verdict",
        seed: [{ path: ROSTER, text: SHORT }],
        exercise: (root) => stating(root, "a-probe-rule", "none"),
        expect: { code: 2, states: false, rows: 1 },
    },
];
