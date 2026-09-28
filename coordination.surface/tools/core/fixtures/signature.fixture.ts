import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { runSignature } from "../runners/converge.runner.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const VENUE = "probe.blocking.md";

const CONVENED = [
    "Agent Z — ACTIVE",
    "  Needs:      —",
    "└─── END AGENT Z",
    "",
    "═══ SIGN-OFF ═══",
    "",
    "```",
    "A:     signed on the settled shape",
    "owner: automatic",
    "```",
    "",
].join("\n");

const UNCONVENED = [
    "Agent A — ACTIVE",
    "  Needs:      —",
    "└─── END AGENT A",
    "",
    "═══ SIGN-OFF ═══",
    "",
    "```",
    "A:     signed on the settled shape",
    "owner: automatic",
    "```",
    "",
].join("\n");

const NO_BLOCK = ["Agent Z — ACTIVE", "  Needs:      —", "└─── END AGENT Z", ""].join("\n");

function signing(root: string): BranchObservation {
    const absolute = resolve(root, VENUE);
    const outcome = runSignature({ target: VENUE, absolute, agent: "Z", text: "signed" });
    const after = readFileSync(absolute, "utf8");

    return {
        code: outcome.code,
        raised: after.includes("Z:     "),
        beforeOwner: after.indexOf("Z:     ") !== -1 && after.indexOf("Z:     ") < after.indexOf("owner:"),
    };
}

export const SIGNOFF_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "converge.runner",
        branch: "a seat convened by the venue with no sign-off row, which is a joiner the closure edge counts and cannot clear",
        seed: [{ path: VENUE, text: CONVENED }],
        exercise: (root) => signing(root),
        expect: { code: 0, raised: true, beforeOwner: true },
    },
    {
        subject: "converge.runner",
        branch: "a seat holding no record here, which was never convened and has nothing to sign",
        seed: [{ path: VENUE, text: UNCONVENED }],
        exercise: (root) => signing(root),
        expect: { code: 2, raised: false, beforeOwner: false },
    },
    {
        subject: "converge.runner",
        branch: "a venue declaring no sign-off block, where a row would be a signature nothing joins on",
        seed: [{ path: VENUE, text: NO_BLOCK }],
        exercise: (root) => signing(root),
        expect: { code: 2, raised: false, beforeOwner: false },
    },
];
