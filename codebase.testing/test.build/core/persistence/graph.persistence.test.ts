import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { writeGraphChunks, writeGraphReport } from "@banes-lab/build-scripts/core/persistence/graph.persistence.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeCanonicalText } from "@govlab/canonical-write";

const scratch: string[] = [];

const folder = function folder(): string {
    const dir = mkdtempSync(join(tmpdir(), "graph-"));
    scratch.push(dir);
    return dir;
};

afterEach(() => {
    for (const dir of scratch.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("writeGraphReport", () => {
    it("writes the report as indented JSON, creating its folder", () => {
        const file = join(folder(), "reports", "graph.json");
        const report = {
            ambiguous: [],
            dangling: [],
            duplicates: [],
            fields: [],
            graph: { edges: [], nodes: [] },
            populations: [],
            tooltipGaps: [],
            uncovered: [],
            undeclared: [],
            unresolved: [],
        };
        writeGraphReport(report, file);
        expect(JSON.parse(readFileSync(file, "utf8"))).toStrictEqual(report);
    });
});

describe("writeGraphChunks", () => {
    it("writes the loader and one module per chunk, and removes a chunk no longer written", async () => {
        const dir = folder();
        await writeCanonicalText(join(dir, "graph.stale.generated.ts"), "export {};\n");
        const loader = join(dir, "graph.generated.ts");
        await writeGraphChunks(new Map([["chapter", {}]]), loader);
        expect(readdirSync(dir).toSorted()).toStrictEqual(["graph.chapter.generated.ts", "graph.generated.ts"]);
        expect(readFileSync(loader, "utf8")).toContain("graph.chapter.generated");
        expect(existsSync(join(dir, "graph.stale.generated.ts"))).toBe(false);
    });
});
