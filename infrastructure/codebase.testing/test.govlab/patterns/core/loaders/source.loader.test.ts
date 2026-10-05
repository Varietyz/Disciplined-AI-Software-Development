import { describe, expect, it } from "vitest";
import {
    entriesFor,
    parseFile,
    readSourceOrEmpty,
    settleParses,
    testUsesOf,
} from "@govlab/patterns/core/loaders/source.loader.ts";
import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const pruned = function pruned(): boolean {
    return false;
};

describe("the source loader", () => {
    const root = mkdtempSync(join(tmpdir(), "pl-sources-"));
    mkdirSync(join(root, "core"));
    writeVerbatim(join(root, "core", "run.ts"), "export const run = function run(): number {\n    return 1;\n};\n");
    writeVerbatim(join(root, "core", "run.test.ts"), "expect(run()).toBe(1);\n");

    it("reads a vanished file as empty", () => {
        expect(readSourceOrEmpty(join(root, "missing.ts"))).toBe("");
    });

    it("parses files one after another and settles the queue", async () => {
        const [first, second] = await Promise.all([
            parseFile(join(root, "core", "run.ts")),
            parseFile(join(root, "core", "run.test.ts")),
        ]);
        await settleParses();
        expect(first.symbols.map((symbol) => symbol.name)).toContain("run");
        expect(second.records.length).toBeGreaterThan(0);
    });

    it("builds entries with module-relative paths and a walk of meaningful nodes", async () => {
        const [entry] = await entriesFor(root, pruned);
        expect(entry?.rel).toBe("core/run.ts");
        expect(entry?.symbols.every((symbol) => symbol.file === "core/run.ts")).toBe(true);
        expect(entry?.walk.length).toBeGreaterThan(0);
    });

    it("collects the identifiers the tests use", async () => {
        expect(await testUsesOf(root, pruned)).toContain("run");
    });
});
