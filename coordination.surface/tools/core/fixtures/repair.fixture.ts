import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { containedBy, writeRepair } from "../writers/repair.writer.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const INSIDE = "tools/core/probe.repair.txt";

const OUTSIDE = "config/probe.repair.txt";

function repairing(root: string, declared: string, path: string): BranchObservation {
    const outcome = writeRepair({ repoRoot: root, declared }, path, "repaired\n");

    return {
        written: outcome.written,
        refused: outcome.refusal !== null,
        landed: existsSync(resolve(root, path)),
    };
}

const ENUMERABLE = "_generated/probe.repair.txt";

function claiming(root: string, path: string, claimed: boolean): BranchObservation {
    const outcome = writeRepair({ repoRoot: root, declared: "whole", claimed }, path, "repaired\n");

    return {
        written: outcome.written,
        refused: outcome.refusal !== null,
        landed: existsSync(resolve(root, path)),
    };
}

export const REPAIR_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "repair.writer",
        branch: "a write into the region where only runs write, carrying no live claim, which is refusable there",
        seed: [],
        exercise: (root) => claiming(root, ENUMERABLE, false),
        expect: { written: false, refused: true, landed: false },
    },
    {
        subject: "repair.writer",
        branch: "the same shape across the source tree, where a party edits without declaring and nothing is inferred",
        seed: [],
        exercise: (root) => claiming(root, INSIDE, false),
        expect: { written: true, refused: false, landed: true },
    },
    {
        subject: "repair.writer",
        branch: "a repair inside the scope its run declared, which lands",
        seed: [],
        exercise: (root) => repairing(root, "tools/core", INSIDE),
        expect: { written: true, refused: false, landed: true },
    },
    {
        subject: "repair.writer",
        branch: "a repair outside the declared scope, refused at the write rather than reported after it",
        seed: [],
        exercise: (root) => repairing(root, "tools/core", OUTSIDE),
        expect: { written: false, refused: true, landed: false },
    },
    {
        subject: "repair.writer",
        branch: "a whole-scope run, which declares no subtree and contains every path by construction",
        seed: [],
        exercise: (root) => repairing(root, "whole", OUTSIDE),
        expect: { written: true, refused: false, landed: true },
    },
    {
        subject: "repair.writer",
        branch: "a path whose text merely opens with the declared scope, which the containment test does not admit",
        seed: [],
        exercise: () => ({
            written: containedBy("tools/core", "tools/core-adjacent/probe.txt"),
            refused: !containedBy("tools/core", "tools/core-adjacent/probe.txt"),
            landed: false,
        }),
        expect: { written: false, refused: true, landed: false },
    },
];
