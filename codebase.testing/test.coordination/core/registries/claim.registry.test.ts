import { afterAll, beforeEach, describe, it } from "vitest";
import {
    claimStanding,
    heldClaims,
    releaseStanding,
    writeSetsOverlap,
} from "coordination-surface/tools/core/registries/claim.registry.ts";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { hostname, tmpdir } from "node:os";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import { RELEASE_UNIDENTIFIED } from "coordination-surface/tools/core/strings/claim.strings.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { writeVerbatim } from "@govlab/canonical-write";

const NOW = 1_000_000;

const ROOT = mkdtempSync(join(tmpdir(), "claim-registry-"));

const CLAIMS = join(ROOT, GENERATED_DIR, "run.claims");

const TAIL = ".claim.generated.json";

beforeEach(() => {
    rmSync(CLAIMS, { force: true, recursive: true });
    mkdirSync(CLAIMS, { recursive: true });
});

afterAll(() => {
    rmSync(ROOT, { force: true, recursive: true });
});

const planted = function planted(name: string, record: object): void {
    writeVerbatim(join(CLAIMS, `${name}${TAIL}`), JSON.stringify(record, null, 4));
};

const plantedText = function plantedText(name: string, text: string): void {
    writeVerbatim(join(CLAIMS, `${name}${TAIL}`), text);
};

const held = function held(name: string): boolean {
    return existsSync(join(CLAIMS, `${name}${TAIL}`));
};

describe("writeSetsOverlap", () => {
    it("overlaps when either scope is whole or both name the same scope", () => {
        assert.equal(writeSetsOverlap("whole", "a"), true);
        assert.equal(writeSetsOverlap("a", "whole"), true);
        assert.equal(writeSetsOverlap("a", "a"), true);
        assert.equal(writeSetsOverlap("a", "b"), false);
    });
});

describe("claimStanding and releaseStanding", () => {
    it("proceeds alone, and releases its own claim", () => {
        const standing = claimStanding(ROOT, "whole", NOW, "A");
        assert.equal(standing.decision, "proceed");
        assert.equal(standing.message, null);
        assert.equal(releaseStanding(ROOT, "A", NOW), null);
        assert.equal(held(`A-${String(NOW)}`), false);
    });

    it("yields to an earlier live claim and reaps one with no start time", () => {
        planted("B-1", { agent: "B", at: NOW - 1000, host: hostname(), pid: process.pid, scope: "whole" });
        planted("C-0", { agent: "C", at: 0, host: hostname(), pid: 0, scope: "tools" });

        const standing = claimStanding(ROOT, "tools", NOW, "A");
        assert.equal(standing.decision, "yield");
        assert.deepEqual(standing.covering, ["whole by B 1s ago"]);
        assert.deepEqual(standing.overlapping, ["whole by B 1s ago"]);
        assert.deepEqual(standing.incomplete, ["tools by C"]);
        assert.equal(held("C-0"), false);
    });

    it("refuses to release a claim it cannot identify", () => {
        assert.equal(releaseStanding("", "", 0), RELEASE_UNIDENTIFIED);
    });
});

describe("heldClaims", () => {
    it("reads an unreadable claim as unknown and skips one that is not a record", () => {
        plantedText("broken", "{ not json");
        plantedText("number", "7");
        assert.deepEqual(
            heldClaims(ROOT).map((claim) => [claim.id, claim.agent]),
            [[`broken${TAIL}`, "unknown"]],
        );
    });
});
