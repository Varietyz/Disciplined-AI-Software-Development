import { describe, it } from "vitest";
import {
    fixtureAdded,
    fixtureContended,
    fixtureModuleMissing,
    halfMissing,
    notAPair,
    setMissing,
} from "coordination-surface/tools/core/strings/fixture.strings.ts";
import { fixtureEntry, parseSamples, runFixture } from "coordination-surface/tools/core/runners/fixture.runner.ts";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const BODY = ["FIRES a.md", 'bad "quoted"', "ACCEPTS b.md", "good"].join("\n");

const MODULE = "fixtures.txt";

describe("parseSamples and fixtureEntry", () => {
    it("read the fired and accepted samples by their leads, and render them as an escaped fixture entry", () => {
        const samples = parseSamples(BODY);
        assert.deepEqual(samples, {
            accepts: { path: "b.md", text: "good\n" },
            fires: { path: "a.md", text: 'bad "quoted"\n' },
        });
        const entry = fixtureEntry("board", "missingField", samples);
        assert.ok(entry.includes('rule: "board",'));
        assert.ok(entry.includes(String.raw`text: "bad \"quoted\"\n"`));
        assert.deepEqual(parseSamples("prose only"), { accepts: null, fires: null });
    });
});

describe("runFixture", () => {
    it("adds a fixture pair before the set's closer, and refuses a missing module, a bad pair, a missing half, a moved module or set", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-fixture-"));
        try {
            const absolute = join(root, MODULE);
            const request = { absolute, body: BODY, pair: "board/missingField", target: MODULE, witness: "" };
            assert.deepEqual(runFixture(request), { code: 2, message: fixtureModuleMissing(MODULE) });
            writeVerbatim(absolute, "export const gates = [\n];\n");
            assert.deepEqual(runFixture({ ...request, pair: "board" }), { code: 2, message: notAPair("board") });
            assert.deepEqual(runFixture({ ...request, body: "FIRES a.md\nbad" }), {
                code: 2,
                message: halfMissing("accepted"),
            });
            assert.deepEqual(runFixture({ ...request, witness: "moved" }), {
                code: 2,
                message: fixtureContended(MODULE),
            });
            writeVerbatim(absolute, "export const gates = [];\n");
            assert.deepEqual(runFixture({ ...request, witness: "export const gates = [];\n" }), {
                code: 2,
                message: setMissing(MODULE),
            });
            const before = "export const gates = [\n];\n";
            writeVerbatim(absolute, before);
            assert.deepEqual(runFixture({ ...request, witness: before }), {
                code: 0,
                message: fixtureAdded("board/missingField", MODULE),
            });
            assert.ok(readFileSync(absolute, "utf8").includes('kind: "missingField",'));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
