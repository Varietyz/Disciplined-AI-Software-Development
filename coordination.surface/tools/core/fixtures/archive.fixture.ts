import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { surfacePath } from "../../../config/surface.config.ts";
import { runRetire } from "../runners/checklist.runner.ts";

import { closureRefusal, EMPTY_EXTRACTION, extractionRefusal } from "../validators/archive.validator.ts";
import { runCompression } from "../runners/collapse.runner.ts";
import { healRequested } from "../runners/mark.runner.ts";
import { NO_FIX_FLAG } from "../constants/path.constants.ts";
import { openVenues } from "../resolvers/sweep.resolver.ts";
import { stampOf } from "../formatters/board.formatter.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const ITEM = "A-1";

const CLOSURE = `CLOSES ${ITEM} — handled · `;

function closing(kind: string, ref: string | null): BranchObservation {
    const refusal = closureRefusal(ITEM, ref, "C", `${CLOSURE}${ref ?? ""}`, "", kind);

    return {
        refused: refusal !== null,
        namesEmpty: refusal === null ? false : refusal.includes(EMPTY_EXTRACTION),
    };
}

function compressing(extracted: string): BranchObservation {
    return { refused: extractionRefusal("_changelogs.txt", extracted, "") !== null, namesEmpty: false };
}

const PROBE = "probe.rehearsal.md";

const SPAN = "  Flags:   —\n           ┌─── AGENT B-1 ─── kind:artifact at:1 to:A\n           body\n           └─── END AGENT B-1\n";

function rehearsing(root: string, heal: boolean): BranchObservation {
    const absolute = resolve(root, PROBE);
    const outcome = runCompression({
        target: PROBE,
        absolute,
        marker: "B-1",
        agent: "A",
        extracted: "changelog:a-heading-nobody-wrote",
        archive: resolve(root, "_changelogs.txt"),
        changelog: "_changelogs.txt",
        heal,
    });

    return { refused: outcome.code !== 0, intact: readFileSync(absolute, "utf8") === SPAN };
}

const FILED = "## a-heading-somebody-wrote\n\nthe durable half\n";

function honoring(root: string, heal: boolean): BranchObservation {
    const absolute = resolve(root, PROBE);
    const outcome = runCompression({
        target: PROBE,
        absolute,
        marker: "B-1",
        agent: "A",
        extracted: "changelog:a-heading-somebody-wrote",
        archive: resolve(root, "_changelogs.txt"),
        changelog: "_changelogs.txt",
        heal,
    });

    return {
        refused: outcome.code !== 0,
        intact: readFileSync(absolute, "utf8") === SPAN,
        computed: outcome.excised.length > 0,
    };
}

const FLAG = NO_FIX_FLAG;

function flagRead(argv: readonly string[]): BranchObservation {
    return { refused: false, heals: healRequested(argv, FLAG) };
}

const ARCHIVE_ROOT = "surface/_archive/venues/";

const SUFFIX = ".blocking.md";

function openSet(entries: readonly string[]): BranchObservation {
    const open = openVenues(entries, ARCHIVE_ROOT, SUFFIX);
    return { refused: false, open: open.length, names: open.join(",") };
}

const SPENT = "probe.checklist.md";

const DECLARED = "settled.6.blocking.md";

function retiring(
    root: string,
    name: string,
    declares: string,
    live: readonly string[],
    citedBy: readonly string[] = [],
    heal = true,
): BranchObservation {
    const outcome = runRetire({ repoRoot: root, name, declares, live, citedBy, heal });
    const absolute = resolve(root, surfacePath("planning"), SPENT);

    return {
        refused: outcome.code !== 0,
        declares: existsSync(absolute) && readFileSync(absolute, "utf8").includes("DISTRIBUTES:"),
        present: existsSync(absolute),
    };
}

const MARKER = "           ┌─── AGENT A-9 ─── kind:artifact at:5000 to:*";

function prompted(mark: number): BranchObservation {
    return { refused: false, renders: stampOf(MARKER) > mark };
}

export const ARCHIVE_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "board.formatter",
        branch: "a seat whose items were written AFTER it last rewrote its own record field, which is the one condition under which returning a party its own sentence carries anything — the field goes stale by standing still while its subject moves, so no comparison of the field against itself could ever render it",
        seed: [],
        exercise: () => prompted(4000),
        expect: { refused: false, renders: true },
    },
    {
        subject: "board.formatter",
        branch: "a seat that rewrote the field AFTER its last item, where the prompt would repeat a sentence the reader has already acted on",
        seed: [],
        exercise: () => prompted(6000),
        expect: { refused: false, renders: false },
    },
    {
        subject: "venue.runner",
        branch: "a spent distribution retired by an EDIT at its own path, which is the only spelling available because a pathed citation from a frozen surface pins its target against that target's own declared lifetime",
        seed: [{ path: `${surfacePath("planning")}/${SPENT}`, text: `DISTRIBUTES: ${DECLARED}\n` }],
        exercise: (root) => retiring(root, SPENT, DECLARED, []),
        expect: { refused: false, declares: false, present: true },
    },
    {
        subject: "venue.runner",
        branch: "the same retirement REHEARSED, where a party sees the edit before taking it on a surface whose citers no gate resolves",
        seed: [{ path: `${surfacePath("planning")}/${SPENT}`, text: `DISTRIBUTES: ${DECLARED}\n` }],
        exercise: (root) => retiring(root, SPENT, DECLARED, [], [], false),
        expect: { refused: false, declares: true, present: true },
    },
    {
        subject: "venue.runner",
        branch: "the same surface while its venue is still OPEN, where retiring now removes the surface tracking whether that venue's outcome was ever built",
        seed: [{ path: `${surfacePath("planning")}/${SPENT}`, text: `DISTRIBUTES: ${DECLARED}\n` }],
        exercise: (root) => retiring(root, SPENT, DECLARED, [`surface/${DECLARED}`]),
        expect: { refused: true, declares: true, present: true },
    },
    {
        subject: "venue.runner",
        branch: "a path that is not a planning surface at all, which a form taking any path would accept and which is the escape hatch every other form here refuses",
        seed: [{ path: `${surfacePath("planning")}/${SPENT}`, text: `DISTRIBUTES: ${DECLARED}\n` }],
        exercise: (root) => retiring(root, "probe.model.md", DECLARED, []),
        expect: { refused: true, declares: true, present: true },
    },
    {
        subject: "venue.runner",
        branch: "a planning surface ALREADY retired, which must be refused rather than edited twice — an idempotent-looking second act would rewrite a statement its author wrote",
        seed: [{ path: `${surfacePath("planning")}/${SPENT}`, text: "# a surface distributing nothing\n" }],
        exercise: (root) => retiring(root, SPENT, "", []),
        expect: { refused: true, declares: false, present: true },
    },
    {
        subject: "sweep.resolver",
        branch: "an archived venue reached through a platform-separated path, where normalizing AFTER the exclusion compares two spellings of one root and lets the whole archive through as open discussion",
        seed: [],
        exercise: () => openSet(["surface\\_archive\\venues\\settled.6.blocking.md"]),
        expect: { refused: false, open: 0, names: "" },
    },
    {
        subject: "sweep.resolver",
        branch: "a live venue reached the same way, which the exclusion must NOT swallow — a filter proven only on what it rejects has been shown to reject rather than to discriminate",
        seed: [],
        exercise: () => openSet(["surface\\open.7a.blocking.md"]),
        expect: { refused: false, open: 1, names: "surface/open.7a.blocking.md" },
    },
    {
        subject: "sweep.resolver",
        branch: "an archived venue already spelled canonically, which is the state every platform that needs no normalization produces and where the defect is invisible",
        seed: [],
        exercise: () => openSet([`${ARCHIVE_ROOT}settled.6.blocking.md`]),
        expect: { refused: false, open: 0, names: "" },
    },
    {
        subject: "mark.runner",
        branch: "an irreversible verb's flag read with the rehearsal spelling ABSENT, which is the wiring a live invocation would settle and which a fixture must not invoke for real",
        seed: [],
        exercise: () => flagRead(["node", "board", "--agent", "A", "--closes", "X-1"]),
        expect: { refused: false, heals: true },
    },
    {
        subject: "mark.runner",
        branch: "the same read with the rehearsal spelling PRESENT, made provable by extraction because the act that would prove it is the act it exists to avoid",
        seed: [],
        exercise: () => flagRead(["node", "board", "--agent", "A", "--closes", "X-1", FLAG]),
        expect: { refused: false, heals: false },
    },
    {
        subject: "board.runner",
        branch: "a REHEARSAL of an irreversible removal whose reference does not resolve, where a rehearsal more permissive than the act is silent, is trusted because it ran clean, and is consulted only by the party careful enough to preview",
        seed: [{ path: PROBE, text: SPAN }],
        exercise: (root) => rehearsing(root, false),
        expect: { refused: true, intact: true },
    },
    {
        subject: "board.runner",
        branch: "the same reference on the ACT, which is what the rehearsal above must predict rather than merely be stricter or looser than",
        seed: [{ path: PROBE, text: SPAN }],
        exercise: (root) => rehearsing(root, true),
        expect: { refused: true, intact: true },
    },
    {
        subject: "board.runner",
        branch: "a REHEARSED removal whose reference RESOLVES, so nothing refuses it and the flag is the only thing standing between the caller and a permanent deletion — the pair above proves the flag is honored on a path that refuses either way, which is a comparison two refusals satisfy and neither answers, so this is where a declared exemption from the dry-run guard is actually falsifiable",
        seed: [
            { path: PROBE, text: SPAN },
            { path: "_changelogs.txt", text: FILED },
        ],
        exercise: (root) => honoring(root, false),
        expect: { refused: false, intact: true, computed: true },
    },
    {
        subject: "board.runner",
        branch: "the same resolving reference on the ACT, which MUST remove the span — a check requiring the surface intact in both halves would pass an act that never writes at all, which is the exemption's claim being satisfied by a mechanism that has stopped working",
        seed: [
            { path: PROBE, text: SPAN },
            { path: "_changelogs.txt", text: FILED },
        ],
        exercise: (root) => honoring(root, true),
        expect: { refused: false, intact: false, computed: true },
    },
    {
        subject: "archive.validator",
        branch: "a closure citing a kind that resolves against the tool's own capability surface, which holds from the instant that capability exists and so can never be false for any item's work",
        seed: [],
        exercise: () => closing("artifact", "form:--item"),
        expect: { refused: true, namesEmpty: true },
    },
    {
        subject: "archive.validator",
        branch: "the declared empty reaching the SIBLING removal path, where one verb admitting a vocabulary the other refuses tells a caller that the spelling its own tree introduced does not exist",
        seed: [],
        exercise: () => compressing(EMPTY_EXTRACTION),
        expect: { refused: false, namesEmpty: false },
    },
    {
        subject: "archive.validator",
        branch: "an unresolving extraction on that same sibling path, which the declared empty must not admit",
        seed: [],
        exercise: () => compressing("changelog:a-heading-nobody-wrote"),
        expect: { refused: true, namesEmpty: false },
    },
    {
        subject: "archive.validator",
        branch: "an artifact item carrying nothing durable, closed by a declared empty rather than by a citation that merely resolves",
        seed: [],
        exercise: () => closing("artifact", EMPTY_EXTRACTION),
        expect: { refused: false, namesEmpty: false },
    },
    {
        subject: "archive.validator",
        branch: "an artifact item closed with no reference at all, refused with the declared-empty spelling published",
        seed: [],
        exercise: () => closing("artifact", null),
        expect: { refused: true, namesEmpty: true },
    },
    {
        subject: "archive.validator",
        branch: "an artifact item citing the extraction kind against a heading nobody wrote, which passes the kind constraint and must still fail on resolution",
        seed: [],
        exercise: () => closing("artifact", "changelog:a-heading-nobody-wrote"),
        expect: { refused: true, namesEmpty: false },
    },
    {
        subject: "archive.validator",
        branch: "a judgement item closed with a reference, where there is nothing for one to point at",
        seed: [],
        exercise: () => closing("judgement", EMPTY_EXTRACTION),
        expect: { refused: true, namesEmpty: false },
    },
];
