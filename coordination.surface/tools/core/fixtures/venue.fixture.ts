import { readFileSync } from "node:fs";
import { hostname } from "node:os";
import { resolve } from "node:path";

import { runDefer, runRetract } from "../runners/blocking.runner.ts";
import { authorityRefusal } from "../resolvers/venue.resolver.ts";
import { slotCount, surfacePath } from "../../../config/surface.config.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { claimStanding, heldClaims, releaseStanding } from "../registries/claim.registry.ts";
import { unpublishedBranchOperands } from "../inspectors/entrypoint.inspector.ts";
import { venueSchemaGaps } from "../validators/venue.validator.ts";
import { runEntry, runExtend, runRepair } from "../runners/archive.runner.ts";
import { runItem } from "../runners/board.runner.ts";
import { runMember } from "../runners/member.runner.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const VENUE = "probe.blocking.md";

const BOARD = "probe.board.md";

const MEMBERED = "probe.finding.md";

const DEFERRED_SECTION = "## DEFERRED — what this venue leaves open\n\n- a-standing-clause → B\n";

const MEMBER_REGION = "the contract above the rows\n\n═══════ THE ROWS ═══════\n\n## a-standing-member\n\nbody\n";

const NO_REGION = "a surface with no declared member region\n\n## a-standing-member\n\nbody\n";

function held(root: string, name: string): string {
    return readFileSync(resolve(root, name), "utf8");
}

function deferring(root: string, target: string, clause: string, receiver: string): BranchObservation {
    const before = held(root, target);
    const outcome = runDefer({ repoRoot: root, target, absolute: resolve(root, target), clause, receiver });
    return { code: outcome.code, changed: held(root, target) !== before };
}

function retracting(root: string, clause: string): BranchObservation {
    const before = held(root, VENUE);
    const outcome = runRetract({ target: VENUE, absolute: resolve(root, VENUE), clause });
    return { code: outcome.code, changed: held(root, VENUE) !== before };
}

function membering(root: string, target: string, heading: string): BranchObservation {
    const before = held(root, target);
    const outcome = runMember({ target, absolute: resolve(root, target), heading, body: "measured body\n" });
    return { code: outcome.code, changed: held(root, target) !== before };
}

const SEATED_INDEX = "| letter | role | state |\n|---|---|---|\n| B | a declared concern | ACTIVE |\n";

const SEATED_BOARD = "┌─── AGENT B ───\nAgent B — ACTIVE\n  Owns:    a declared concern\n└─── END AGENT B\n";

const VENUE_SEED = [
    { path: VENUE, text: DEFERRED_SECTION },
    { path: surfacePath("agent_index"), text: SEATED_INDEX },
    { path: surfacePath("board"), text: SEATED_BOARD },
];

const RECORDED =
    "┌─── AGENT A ───\nAgent A — ACTIVE\n  Positions:   —\n└─── END AGENT A\n";

const ACCUMULATOR = "probe-changelog.txt";

const BRANCHED_UNPUBLISHED = [
    "const heal = asked && peers < 2;",
    "const result = runPipeline({",
    "    fix: heal,",
    "    scope,",
    "});",
    "const report: PipelineReport = {",
    "    verdict: result.verdict,",
    "    scanned: result.scanned,",
    "};",
    "const target = writePipelineReport(REPO_ROOT, report);",
].join("\n");

const BRANCHED_PUBLISHED = [
    "const heal = asked && peers < 2;",
    "const result = runPipeline({",
    "    fix: heal,",
    "    scope,",
    "});",
    "const report: PipelineReport = {",
    "    verdict: result.verdict,",
    "    mutated: heal,",
    "};",
    "const target = writePipelineReport(REPO_ROOT, report);",
].join("\n");

function operands(source: string): BranchObservation {
    const found = unpublishedBranchOperands(source, "runPipeline", "writePipelineReport");
    return { found: found.length, named: found.some((entry) => entry.name === "heal") };
}

const CLAIM_PATH = `${GENERATED_DIR}/run.claims/Z-1000.claim.generated.json`;

const LIVE_WINDOW = slotCount("convention", "run_live_window_ms");

function ordering(root: string, at: number, agent: string): BranchObservation {
    const standing = claimStanding(root, "whole", at, agent);
    return { yields: standing.decision === "yield", proceeds: standing.decision === "proceed" };
}

function releasing(root: string, agent: string, at: number): BranchObservation {
    const refused = releaseStanding(root, agent, at);
    return { refused: refused !== null, kept: heldClaims(root).length };
}

function claiming(root: string, at: number): BranchObservation {
    const standing = claimStanding(root, "whole", at, "A");
    const stated = standing.message ?? "";

    return {
        flight: standing.covering.length > 0,
        dead: standing.incomplete.length > 0,
        names: stated.includes("by Z"),
    };
}

const SCHEMA_TEMPLATE = [
    "```",
    "Agent <letter> — <state>",
    "  Needs:      <what>",
    "└─── END AGENT <letter>",
    "```",
].join("\n");

const SCHEMA_RECORD = ["Agent A — ACTIVE", "  Needs:      nothing", "└─── END AGENT A"].join("\n");

const SCHEMA_QUOTING = [SCHEMA_RECORD, "", "a position body quoting a record:", "", "    Agent B — ACTIVE", ""].join(
    "\n",
);

function schema(source: string): BranchObservation {
    const gaps = venueSchemaGaps(source, SCHEMA_TEMPLATE);
    return { gaps: gaps.length, quoted: gaps.some((gap) => gap.record.includes("Agent B")) };
}

const NO_SUCH_PROCESS = 2 ** 30;

const FOREIGN_HOST = "a-host-this-run-is-not-on";

function claimText(pid: number, host: string): string {
    return JSON.stringify({ scope: "whole", at: 1000, agent: "Z", pid, host });
}

function filing(root: string, heading: string): BranchObservation {
    const outcome = runEntry({
        archive: resolve(root, ACCUMULATOR),
        heading,
        body: "POPULATION: one.\nBOUNDARY: two.\n",
    });

    return {
        code: outcome.code,
        publishes: outcome.message.includes("CLASSES ALREADY FILED"),
        names: outcome.message.includes("a-standing-class"),
        record: outcome.message.includes("handed this item in a delivered read"),
    };
}

function repairing(root: string, heading: string): BranchObservation {
    const before = held(root, ACCUMULATOR);
    const outcome = runRepair({ archive: resolve(root, ACCUMULATOR), heading });
    return {
        code: outcome.code,
        changed: held(root, ACCUMULATOR) !== before,
        publishes: outcome.message.includes("CLASSES ALREADY FILED"),
    };
}

function extending(root: string, heading: string): BranchObservation {
    const outcome = runExtend({
        archive: resolve(root, ACCUMULATOR),
        heading,
        lead: "BOUNDARY:",
        body: "added.",
    });

    return { code: outcome.code, publishes: outcome.message.includes("CLASSES ALREADY FILED") };
}

const TICK = String.fromCharCode(96);

const CITED = `${TICK}venue${TICK}: ${TICK}${VENUE}${TICK}`;

const UNCITED = `${TICK}venue${TICK}: ${TICK}a-path-nobody-holds.md${TICK}`;

const SPACED = "a venue with a space.blocking.md";

const SPACED_CITE = `${TICK}venue${TICK}: ${TICK}${SPACED}${TICK}`;

function posting(root: string, text: string): BranchObservation {
    const before = held(root, VENUE);
    const outcome = runItem({
        target: VENUE,
        absolute: resolve(root, VENUE),
        agent: "A",
        text,
        at: 1,
        kind: "judgement",
        archive: resolve(root, "absent.txt"),
        siblings: [],
        repoRoot: root,
    });

    return {
        code: outcome.code,
        changed: held(root, VENUE) !== before,
        stamps: held(root, VENUE).includes("cites:"),
    };
}

export const VENUE_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "venue.runner",
        branch: "a deferral against a surface that is not a venue",
        seed: [{ path: BOARD, text: DEFERRED_SECTION }],
        exercise: (root) => deferring(root, BOARD, "a-new-clause", "B"),
        expect: { code: 2, changed: false },
    },
    {
        subject: "venue.runner",
        branch: "a deferral naming a clause the venue already defers",
        seed: VENUE_SEED,
        exercise: (root) => deferring(root, VENUE, "a-standing-clause", "B"),
        expect: { code: 2, changed: false },
    },
    {
        subject: "venue.runner",
        branch: "a deferral appended into the declared section",
        seed: VENUE_SEED,
        exercise: (root) => deferring(root, VENUE, "a-new-clause", "B"),
        expect: { code: 0, changed: true },
    },
    {
        subject: "venue.runner",
        branch: "a retraction naming a clause the venue does not defer",
        seed: VENUE_SEED,
        exercise: (root) => retracting(root, "a-clause-nobody-wrote"),
        expect: { code: 2, changed: false },
    },
    {
        subject: "venue.runner",
        branch: "a retraction removing the clause it names",
        seed: VENUE_SEED,
        exercise: (root) => retracting(root, "a-standing-clause"),
        expect: { code: 0, changed: true },
    },
    {
        subject: "venue.runner",
        branch: "venue management by a caller the index does not bind to the authority concern",
        seed: VENUE_SEED,
        exercise: (root) => ({ refused: authorityRefusal(root, " ", "a venue act") !== null }),
        expect: { refused: false },
    },
    {
        subject: "entrypoint.validator",
        branch: "an entry point whose branch operand never reaches its emitted report keys",
        seed: [],
        exercise: () => operands(BRANCHED_UNPUBLISHED),
        expect: { found: 1, named: true },
    },
    {
        subject: "entrypoint.validator",
        branch: "an entry point that publishes the operand it branches on",
        seed: [],
        exercise: () => operands(BRANCHED_PUBLISHED),
        expect: { found: 0, named: false },
    },
    {
        subject: "claim.registry",
        branch: "a starter whose peer began EARLIER, which yields under the start-stamp order",
        seed: [{ path: CLAIM_PATH, text: JSON.stringify({ scope: "whole", at: 1000, agent: "Z" }) }],
        exercise: (root) => ordering(root, 1500, "A"),
        expect: { yields: true, proceeds: false },
    },
    {
        subject: "claim.registry",
        branch: "a starter whose peer began LATER, which proceeds under the same order",
        seed: [{ path: CLAIM_PATH, text: JSON.stringify({ scope: "whole", at: 9000, agent: "Z" }) }],
        exercise: (root) => ordering(root, 8000, "A"),
        expect: { yields: false, proceeds: true },
    },
    {
        subject: "claim.registry",
        branch: "a release identifying no run, which must keep every live claim rather than clear them",
        seed: [{ path: CLAIM_PATH, text: JSON.stringify({ scope: "whole", at: 1000, agent: "Z" }) }],
        exercise: (root) => releasing(root, "", 0),
        expect: { refused: true, kept: 1 },
    },
    {
        subject: "claim.registry",
        branch: "a release identifying its own run, which removes that claim and no other",
        seed: [{ path: CLAIM_PATH, text: JSON.stringify({ scope: "whole", at: 1000, agent: "Z" }) }],
        exercise: (root) => releasing(root, "Z", 1000),
        expect: { refused: false, kept: 0 },
    },
    {
        subject: "claim.registry",
        branch: "a claim inside the declared live window, which reads as a run still in flight",
        seed: [{ path: CLAIM_PATH, text: JSON.stringify({ scope: "whole", at: 1000, agent: "Z" }) }],
        exercise: (root) => claiming(root, 2000),
        expect: { flight: true, dead: false, names: true },
    },
    {
        subject: "claim.registry",
        branch: "a claim past the declared live window, which reads as a run that died leaving no verdict",
        seed: [{ path: CLAIM_PATH, text: JSON.stringify({ scope: "whole", at: 1000, agent: "Z" }) }],
        exercise: (root) => claiming(root, 1000 + LIVE_WINDOW + 1000),
        expect: { flight: false, dead: true, names: true },
    },
    {
        subject: "venue.validator",
        branch: "a record opener quoted at an indent, which a trimmed prefix reads as a second record",
        seed: [],
        exercise: () => schema(SCHEMA_QUOTING),
        expect: { gaps: 0, quoted: false },
    },
    {
        subject: "venue.validator",
        branch: "a record opener at line start, which still opens its record",
        seed: [],
        exercise: () => schema(["Agent A — ACTIVE", "└─── END AGENT A"].join("\n")),
        expect: { gaps: 1, quoted: false },
    },
    {
        subject: "claim.registry",
        branch: "a claim WELL inside the window whose process this host witnesses is gone, which reads dead on the witness",
        seed: [{ path: CLAIM_PATH, text: claimText(NO_SUCH_PROCESS, hostname()) }],
        exercise: (root) => claiming(root, 2000),
        expect: { flight: false, dead: true, names: true },
    },
    {
        subject: "claim.registry",
        branch: "the same claim on a host this run cannot probe, which stays live on the window alone",
        seed: [{ path: CLAIM_PATH, text: claimText(NO_SUCH_PROCESS, FOREIGN_HOST) }],
        exercise: (root) => claiming(root, 2000),
        expect: { flight: true, dead: false, names: true },
    },
    {
        subject: "archive.runner",
        branch: "a new class filed, which is handed the classes already filed from the read its own duplicate test took",
        seed: [{ path: ACCUMULATOR, text: "### a-standing-class\n\nPOPULATION: one.\nBOUNDARY: two.\n" }],
        exercise: (root) => filing(root, "a-second-class"),
        expect: { code: 0, publishes: true, names: true, record: false },
    },
    {
        subject: "archive.runner",
        branch: "a heading that already resolves, refused and handed the same set where it is most owed",
        seed: [{ path: ACCUMULATOR, text: "### a-standing-class\n\nPOPULATION: one.\nBOUNDARY: two.\n" }],
        exercise: (root) => filing(root, "a-standing-class"),
        expect: { code: 2, publishes: true, names: true, record: false },
    },
    {
        subject: "archive.runner",
        branch: "an accumulator holding a drained item's heading beside a class, where a record can answer no duplicate reading",
        seed: [
            {
                path: ACCUMULATOR,
                text:
                    "### a-standing-class\n\nPOPULATION: one.\nBOUNDARY: two.\n\n" +
                    "### A-14 — to A · every addressee was handed this item in a delivered read\n\nprose.\n",
            },
        ],
        exercise: (root) => filing(root, "a-second-class"),
        expect: { code: 0, publishes: true, names: true, record: false },
    },
    {
        subject: "archive.runner",
        branch: "an entry whose declared leads sit mid-paragraph",
        seed: [{ path: ACCUMULATOR, text: `### probe-class\n\nprose. POPULATION: one. BOUNDARY: two.\n` }],
        exercise: (root) => repairing(root, "probe-class"),
        expect: { code: 0, changed: true, publishes: false },
    },
    {
        subject: "archive.runner",
        branch: "an entry whose declared leads already open their own lines",
        seed: [{ path: ACCUMULATOR, text: `### probe-class\n\nprose.\nPOPULATION: one.\nBOUNDARY: two.\n` }],
        exercise: (root) => repairing(root, "probe-class"),
        expect: { code: 0, changed: false, publishes: false },
    },
    {
        subject: "archive.runner",
        branch: "a repair naming a heading the accumulator does not carry, refused with the set it just read",
        seed: [{ path: ACCUMULATOR, text: "### a-standing-class\n\nPOPULATION: one.\nBOUNDARY: two.\n" }],
        exercise: (root) => repairing(root, "a-heading-nobody-filed"),
        expect: { code: 2, changed: false, publishes: true },
    },
    {
        subject: "archive.runner",
        branch: "an extension naming a heading the accumulator does not carry, refused with the set it just read",
        seed: [{ path: ACCUMULATOR, text: "### a-standing-class\n\nPOPULATION: one.\nBOUNDARY: two.\n" }],
        exercise: (root) => extending(root, "a-heading-nobody-filed"),
        expect: { code: 2, publishes: true },
    },
    {
        subject: "archive.runner",
        branch: "an extension naming a heading the accumulator carries, which lands and publishes nothing",
        seed: [{ path: ACCUMULATOR, text: "### a-standing-class\n\nPOPULATION: one.\nBOUNDARY: two.\n" }],
        exercise: (root) => extending(root, "a-standing-class"),
        expect: { code: 0, publishes: false },
    },
    {
        subject: "board.runner",
        branch: "a position on a venue carrying no signature, which is what a truncated body loses",
        seed: [{ path: VENUE, text: RECORDED }],
        exercise: (root) => posting(root, "a body cut before its end"),
        expect: { code: 2, changed: false, stamps: false },
    },
    {
        subject: "board.runner",
        branch: "a position on a venue carrying its signature",
        seed: [{ path: VENUE, text: RECORDED }],
        exercise: (root) => posting(root, "a whole body. Signed: A"),
        expect: { code: 0, changed: true, stamps: false },
    },
    {
        subject: "board.runner",
        branch: "a position citing a surface that exists, stamped with that surface's state at the moment the claim landed",
        seed: [{ path: VENUE, text: RECORDED }],
        exercise: (root) => posting(root, ["a whole body.", CITED, "Signed: A"].join("\n")),
        expect: { code: 0, changed: true, stamps: true },
    },
    {
        subject: "board.runner",
        branch: "a position citing a surface that resolves to nothing, which is stamped by nothing rather than by a guess",
        seed: [{ path: VENUE, text: RECORDED }],
        exercise: (root) => posting(root, ["a whole body.", UNCITED, "Signed: A"].join("\n")),
        expect: { code: 0, changed: true, stamps: false },
    },
    {
        subject: "board.runner",
        branch: "a citation carrying a separator the marker encodes with, which would truncate the stamp of every citation after it",
        seed: [{ path: SPACED, text: RECORDED }, { path: VENUE, text: RECORDED }],
        exercise: (root) => posting(root, ["a whole body.", SPACED_CITE, "Signed: A"].join("\n")),
        expect: { code: 0, changed: true, stamps: false },
    },
    {
        subject: "member.runner",
        branch: "a member against a surface declaring no region",
        seed: [{ path: MEMBERED, text: NO_REGION }],
        exercise: (root) => membering(root, MEMBERED, "a-new-member"),
        expect: { code: 2, changed: false },
    },
    {
        subject: "member.runner",
        branch: "a member whose heading already resolves",
        seed: [{ path: MEMBERED, text: MEMBER_REGION }],
        exercise: (root) => membering(root, MEMBERED, "a-standing-member"),
        expect: { code: 2, changed: false },
    },
    {
        subject: "member.runner",
        branch: "a member appended beneath the declared region",
        seed: [{ path: MEMBERED, text: MEMBER_REGION }],
        exercise: (root) => membering(root, MEMBERED, "a-new-member"),
        expect: { code: 0, changed: true },
    },
];
