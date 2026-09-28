import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { surfacePath, surfacePrefix } from "../../../config/surface.config.ts";
import { AGENDA, VENUE_ARCHIVE } from "../constants/blocking.constants.ts";
import { signOffSection } from "../readers/venue.reader.ts";
import { runSignature } from "../runners/converge.runner.ts";
import { runRaise, runRelocate } from "../runners/venue.runner.ts";
import { runDefer } from "../runners/blocking.runner.ts";
import { runArrive, runInherit } from "../runners/delivery.runner.ts";
import { runRoster } from "../runners/mark.runner.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const VENUE_ROOT = surfacePrefix();

const ANCHOR = `${VENUE_ROOT}/a-first-invariant.6.blocking.md`;

const TEMPLATE = surfacePath("venue_template");

const TEMPLATE_BODY =
    "# a probe venue template\n\n═══════════════════ PROTOCOL (permanent) ═══════════════════\n\nprotocol prose\n\n" +
    "```\n┌─── AGENT <letter> ───\nAgent <letter> — <ACTIVE | INACTIVE>\n  Needs: <need>\n└─── END AGENT <letter>\n```\n";

const SCHEDULE = [
    "| ordinal | invariant | state |",
    "|---|---|---|",
    "| 6 | `a-first-invariant` | archived |",
    "| 7 | `a-scheduled-invariant` | planned |",
    "| 6b | `a-declared-invariant` | planned |",
    "",
].join("\n");

const DECLARING = [
    "# a probe venue",
    "",
    "SUCCESSOR: a-declared-invariant",
    "",
    "## DEFERRED — what this venue leaves open",
    "",
    "- a-carried-clause → a-declared-invariant",
    "",
].join("\n");

const DEFERRING_ELSEWHERE = [
    "# a probe venue",
    "",
    "SUCCESSOR: a-declared-invariant",
    "",
    "## DEFERRED — what this venue leaves open",
    "",
    "- a-carried-clause → a-scheduled-invariant",
    "",
].join("\n");

const DECLARING_SCHEDULED = DECLARING.split("a-declared-invariant").join("a-scheduled-invariant");

const UNDEFERRING = ["# a probe venue", "", "SUCCESSOR: a-scheduled-invariant", ""].join("\n");

const UNDECLARED = ["# a probe venue", "", "## DEFERRED — what this venue leaves open", "", "- a-carried-clause → B", ""].join(
    "\n",
);

const DEFERRING_SECTION = ["# a probe venue", "", "## DEFERRED — what this venue leaves open", "", ""].join("\n");

function marking(root: string): BranchObservation {
    const absolute = resolve(root, VENUE_ROOT, RAISED);
    const outcome = runDefer({ repoRoot: root, target: RAISED, absolute, clause: "—", receiver: "" });
    const body = existsSync(absolute) ? readFileSync(absolute, "utf8") : "";

    return {
        code: outcome.code,
        listed: body.split("\n").some((line) => line.trim() === "- —"),
    };
}

function raising(root: string, declared: string | null): BranchObservation {
    const outcome = runRaise({ repoRoot: root, declared, seats: [] });

    const scheduled = resolve(root, VENUE_ROOT, "a-scheduled-invariant.7.blocking.md");
    const body = existsSync(scheduled) ? readFileSync(scheduled, "utf8") : "";

    return {
        code: outcome.code,
        raised: outcome.raised ?? "",
        carries: body.includes("a-carried-clause"),
        derives: body.includes("no venue defers to a-scheduled-invariant"),
    };
}

const ARCHIVED = `${VENUE_ARCHIVE}a-first-invariant.6.blocking.md`;

const RAISED = "a-scheduled-invariant.7.blocking.md";

const ARGUED = [
    "# a raised venue",
    "",
    "═══════════════════ INHERITED (no venue defers to a-scheduled-invariant) ═══════════════════",
    "",
    "—",
    "",
    "═══════════════════ PROTOCOL (permanent) ═══════════════════",
    "",
    "protocol prose",
    "",
    "┌─── AGENT C ───",
    "Agent C — ACTIVE",
    "  Reading: a position nobody may compose away",
    "└─── END AGENT C",
    "",
].join("\n");

function relocating(root: string): BranchObservation {
    const outcome = runRelocate({ repoRoot: root, name: RAISED });
    const stray = resolve(root, RAISED);
    const landed = resolve(root, VENUE_ROOT, RAISED);

    return {
        code: outcome.code,
        strayGone: !existsSync(stray),
        arrived: existsSync(landed),
        argument: existsSync(landed) ? readFileSync(landed, "utf8").includes("AGENT C") : false,
    };
}

const BOARD = surfacePath("board");

const AGENT_INDEX = surfacePath("agent_index");

const SEATED = [
    "┌─── AGENT A ───",
    "Agent A — ACTIVE",
    "  Owns: a declared concern",
    "└─── END AGENT A",
    "┌─── AGENT C ───",
    "Agent C — ACTIVE",
    "  Owns: a declared concern",
    "└─── END AGENT C",
    "",
].join("\n");

const BOUND = ["| letter | role | state |", "|---|---|---|", "| A | one | ACTIVE |", "| C | two | ACTIVE |", ""].join(
    "\n",
);

const SPACE_MARKED = [
    "# a raised venue",
    "",
    "NOT-READ:        A",
    "READ AND AWAITING: C",
    "",
    "═══════════════════ PROTOCOL (permanent) ═══════════════════",
    "",
    "protocol prose",
    "",
].join("\n");

const COMMA_MARKED = SPACE_MARKED.split("READ AND AWAITING: C").join("READ AND AWAITING: C, A");

const PLACEHOLDERED = [
    "# a raised venue",
    "",
    "NOT-READ:        <one entry per ACTIVE letter, resolved by the RAISE from the live roster>",
    "READ AND AWAITING: C",
    "",
    "═══════════════════ PROTOCOL (permanent) ═══════════════════",
    "",
    "protocol prose",
    "",
].join("\n");

const SEATED_VENUE = [
    "# a raised venue",
    "",
    "A: a colon two characters in, sitting above the block and shadowing a real row",
    "",
    "┌─── AGENT C ───",
    "Agent C — ACTIVE",
    "  Reading: joined",
    "└─── END AGENT C",
    "",
    "═══════════════════ SIGN-OFF ═══════════════════",
    "",
    "<one row per ACTIVE letter, resolved at the raise>",
    "",
].join("\n");

function signing(root: string, agent: string): BranchObservation {
    const absolute = resolve(root, VENUE_ROOT, RAISED);
    const outcome = runSignature({ target: RAISED, absolute, agent, text: "settled" });
    const body = existsSync(absolute) ? readFileSync(absolute, "utf8") : "";

    return {
        code: outcome.code,
        raises: signOffSection(body).some((line) => line.startsWith(`${agent}:`)),
        shadowed: signOffSection(body).some((line) => line.startsWith("A:")),
    };
}

function rostering(root: string): BranchObservation {
    const outcome = runRoster({ repoRoot: root, name: RAISED });
    const landed = resolve(root, VENUE_ROOT, RAISED);
    const body = existsSync(landed) ? readFileSync(landed, "utf8") : "";

    return {
        code: outcome.code,
        unread: body.includes("NOT-READ:        A\n"),
        keepsMark: body.split("\n").some((line) => line.startsWith("READ AND AWAITING:") && line.includes("C")),
        placeholder: body.includes("one entry per ACTIVE letter"),
    };
}

function inheriting(root: string): BranchObservation {
    const outcome = runInherit({ repoRoot: root, name: RAISED });
    const landed = resolve(root, VENUE_ROOT, RAISED);
    const body = existsSync(landed) ? readFileSync(landed, "utf8") : "";

    return {
        code: outcome.code,
        carries: body.includes("a-carried-clause"),
        argument: body.includes("AGENT C"),
        origin: body.includes("from venue 6a"),
    };
}

const PREDECESSOR = "a-first-invariant.6.blocking.md";

const SUCCESSOR = `${VENUE_ROOT}/a-declared-invariant.6b.blocking.md`;

const RECEIVING = [
    "# a raised venue",
    "",
    "═══════════════════ INHERITED (from venue 6) ═══════════════════",
    "",
    "- an-earlier-clause → a-declared-invariant",
    "",
    "═══════════════════ PROTOCOL (permanent) ═══════════════════",
    "",
    "protocol prose",
    "",
].join("\n");

function arriving(root: string): BranchObservation {
    const outcome = runArrive({ absolute: resolve(root, VENUE_ROOT, PREDECESSOR), predecessor: PREDECESSOR });
    const landed = resolve(root, SUCCESSOR);
    const body = existsSync(landed) ? readFileSync(landed, "utf8") : "";

    return {
        code: outcome.code,
        carries: body.includes("a-carried-clause"),
        kept: body.includes("an-earlier-clause"),
    };
}

export const BLOCKING_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "delivery.runner",
        branch: "a predecessor deferring a clause to its declared successor, which the arrive carries into the inherited section",
        seed: [
            { path: `${VENUE_ROOT}/${PREDECESSOR}`, text: DECLARING },
            { path: SUCCESSOR, text: RECEIVING },
        ],
        exercise: (root) => arriving(root),
        expect: { code: 0, carries: true, kept: true },
    },
    {
        subject: "delivery.runner",
        branch: "a predecessor deferring its clause to another invariant, which the arrive holds at its origin",
        seed: [
            { path: `${VENUE_ROOT}/${PREDECESSOR}`, text: DEFERRING_ELSEWHERE },
            { path: SUCCESSOR, text: RECEIVING },
        ],
        exercise: (root) => arriving(root),
        expect: { code: 0, carries: false, kept: true },
    },
    {
        subject: "venue.runner",
        branch: "a raise while an active venue declares no successor, which the raise itself would make impossible to declare",
        seed: [
            { path: ANCHOR, text: UNDECLARED },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, "a-declared-invariant"),
        expect: { code: 2, raised: "", carries: false, derives: false },
    },
    {
        subject: "venue.runner",
        branch: "a venue recording that it defers nothing, written as a list line because a bare marker reaches no collector",
        seed: [{ path: `${VENUE_ROOT}/${RAISED}`, text: DEFERRING_SECTION }],
        exercise: (root) => marking(root),
        expect: { code: 0, listed: true },
    },
    {
        subject: "venue.runner",
        branch: "a venue already deferring a clause, where the absent marker beside it would state two answers to one question",
        seed: [{ path: `${VENUE_ROOT}/${RAISED}`, text: UNDECLARED }],
        exercise: (root) => marking(root),
        expect: { code: 2, listed: false },
    },
    {
        subject: "converge.runner",
        branch: "a seat signing under an argument carrying a colon two characters in, which the reader must not take as a signature",
        seed: [{ path: `${VENUE_ROOT}/${RAISED}`, text: SEATED_VENUE }],
        exercise: (root) => signing(root, "C"),
        expect: { code: 0, raises: true, shadowed: false },
    },
    {
        subject: "converge.runner",
        branch: "a seat holding no record on the venue, which was never convened and has nothing to sign",
        seed: [{ path: `${VENUE_ROOT}/${RAISED}`, text: SEATED_VENUE }],
        exercise: (root) => signing(root, "Q"),
        expect: { code: 2, raises: false, shadowed: false },
    },
    {
        subject: "venue.runner",
        branch: "a venue carrying the template's roster placeholder, resolved from the active seats without unmarking anyone",
        seed: [
            { path: `${VENUE_ROOT}/${RAISED}`, text: PLACEHOLDERED },
            { path: BOARD, text: SEATED },
            { path: AGENT_INDEX, text: BOUND },
        ],
        exercise: (root) => rostering(root),
        expect: { code: 0, unread: true, keepsMark: true, placeholder: false },
    },
    {
        subject: "venue.runner",
        branch: "a marked line the consumer's own separator wrote, which a second tokenizer would read as no marks at all",
        seed: [
            { path: `${VENUE_ROOT}/${RAISED}`, text: SPACE_MARKED },
            { path: BOARD, text: SEATED },
            { path: AGENT_INDEX, text: BOUND },
        ],
        exercise: (root) => rostering(root),
        expect: { code: 0, unread: true, keepsMark: true, placeholder: false },
    },
    {
        subject: "venue.runner",
        branch: "a marked line lost while the unread line stands, where resolving it would return a seat to unread and only ever be a loss",
        seed: [
            { path: `${VENUE_ROOT}/${RAISED}`, text: SPACE_MARKED.split("READ AND AWAITING: C").join("READ AND AWAITING: —") },
            { path: BOARD, text: SEATED },
            { path: AGENT_INDEX, text: BOUND },
        ],
        exercise: (root) => rostering(root),
        expect: { code: 2, unread: true, keepsMark: false, placeholder: false },
    },
    {
        subject: "venue.runner",
        branch: "a marked line malformed by hand with a separator the consumer never emits, read tolerantly and written canonically",
        seed: [
            { path: `${VENUE_ROOT}/${RAISED}`, text: COMMA_MARKED },
            { path: BOARD, text: SEATED },
            { path: AGENT_INDEX, text: BOUND },
        ],
        exercise: (root) => rostering(root),
        expect: { code: 0, unread: false, keepsMark: true, placeholder: false },
    },
    {
        subject: "venue.runner",
        branch: "a venue missing a roster line, where a resolution would state a read state the surface does not carry",
        seed: [
            { path: `${VENUE_ROOT}/${RAISED}`, text: ARGUED },
            { path: BOARD, text: SEATED },
            { path: AGENT_INDEX, text: BOUND },
        ],
        exercise: (root) => rostering(root),
        expect: { code: 2, unread: false, keepsMark: false, placeholder: false },
    },
    {
        subject: "venue.runner",
        branch: "a venue holding a position standing at the wrong root, moved byte-identical rather than composed afresh",
        seed: [
            { path: RAISED, text: ARGUED },
            { path: AGENDA, text: SCHEDULE },
        ],
        exercise: (root) => relocating(root),
        expect: { code: 0, strayGone: true, arrived: true, argument: true },
    },
    {
        subject: "venue.runner",
        branch: "a venue root that resolves to nothing, where a mover would create the tree it claims to move within",
        seed: [{ path: RAISED, text: ARGUED }],
        exercise: (root) => relocating(root),
        expect: { code: 2, strayGone: false, arrived: false, argument: false },
    },
    {
        subject: "venue.runner",
        branch: "a venue already standing at the venue root, where a mover would overwrite an open argument to satisfy a path",
        seed: [{ path: `${VENUE_ROOT}/${RAISED}`, text: ARGUED }],
        exercise: (root) => relocating(root),
        expect: { code: 2, strayGone: true, arrived: true, argument: true },
    },
    {
        subject: "venue.runner",
        branch: "an inherited section recomputed on a venue that already holds an argument, replacing the span and nothing else",
        seed: [
            { path: `${VENUE_ROOT}/${RAISED}`, text: ARGUED },
            { path: `${VENUE_ROOT}/a-first-invariant.6a.blocking.md`, text: DEFERRING_ELSEWHERE },
            { path: AGENDA, text: SCHEDULE },
        ],
        exercise: (root) => inheriting(root),
        expect: { code: 0, carries: true, argument: true, origin: true },
    },
    {
        subject: "venue.runner",
        branch: "an inherited section already carrying what its deferrals derive, which is a no-op rather than a rewrite",
        seed: [
            { path: `${VENUE_ROOT}/${RAISED}`, text: ARGUED },
            { path: AGENDA, text: SCHEDULE },
        ],
        exercise: (root) => inheriting(root),
        expect: { code: 0, carries: false, argument: true, origin: false },
    },
    {
        subject: "venue.runner",
        branch: "an active tree carrying no venue at all, where the predecessor is archived and the raise needs no anchor",
        seed: [
            { path: ARCHIVED, text: DECLARING_SCHEDULED },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, null),
        expect: {
            code: 0,
            raised: "a-scheduled-invariant.7.blocking.md",
            carries: true,
            derives: false,
        },
    },
    {
        subject: "venue.runner",
        branch: "an anchor declaring a successor the schedule does not put next, where the schedule decides what is raised",
        seed: [
            { path: ANCHOR, text: DECLARING },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, null),
        expect: {
            code: 0,
            raised: "a-scheduled-invariant.7.blocking.md",
            carries: false,
            derives: true,
        },
    },
    {
        subject: "venue.runner",
        branch: "an anchor declaring the invariant the schedule puts next, where one venue answers both questions",
        seed: [
            { path: ANCHOR, text: DECLARING_SCHEDULED },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, null),
        expect: {
            code: 0,
            raised: "a-scheduled-invariant.7.blocking.md",
            carries: true,
            derives: false,
        },
    },
    {
        subject: "venue.runner",
        branch: "a venue declaring one successor while deferring a clause to another, where the clause travels to what it names",
        seed: [
            { path: ANCHOR, text: DEFERRING_ELSEWHERE },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, null),
        expect: {
            code: 0,
            raised: "a-scheduled-invariant.7.blocking.md",
            carries: true,
            derives: false,
        },
    },
    {
        subject: "venue.runner",
        branch: "a raise naming a planned unraised row that is not first in the table, which is admissible because a partial order has no unique next",
        seed: [
            { path: ANCHOR, text: DECLARING },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, "a-declared-invariant"),
        expect: { code: 0, raised: "a-declared-invariant.6b.blocking.md", carries: false, derives: false },
    },
    {
        subject: "venue.runner",
        branch: "a raise naming an invariant the schedule does not carry as planned, refused rather than driving a file into existence",
        seed: [
            { path: ANCHOR, text: DECLARING },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, "a-first-invariant"),
        expect: { code: 2, raised: "", carries: false, derives: false },
    },
    {
        subject: "venue.runner",
        branch: "a venue declaring the invariant while deferring nothing to it, which opens carrying a derived empty set",
        seed: [
            { path: ANCHOR, text: UNDEFERRING },
            { path: AGENDA, text: SCHEDULE },
            { path: TEMPLATE, text: TEMPLATE_BODY },
        ],
        exercise: (root) => raising(root, null),
        expect: {
            code: 0,
            raised: "a-scheduled-invariant.7.blocking.md",
            carries: false,
            derives: true,
        },
    },
];
