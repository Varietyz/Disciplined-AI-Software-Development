import {
    CENSUS_COMMAND,
    CENSUS_SUMMARY,
    authoredLine,
    taxonomyLine,
    wroteCensus,
} from "@govlab/stats/configuration/strings/metric.strings.ts";
import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { CENSUS_FILE } from "@govlab/stats/configuration/constants/document.constants.ts";
import { join } from "node:path";
import { parseMark } from "@govlab/canonical-write";
import { tmpdir } from "node:os";
import { writeCensus } from "@govlab/stats/core/persistence/metric.persistence.ts";

const root = mkdtempSync(join(tmpdir(), "census-"));

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("writeCensus", () => {
    it("writes the census under its file name with a generated mark, and keeps the version when nothing changed", async () => {
        const dir = join(root, "generated");
        const target = await writeCensus("# Census\n", dir);
        expect(target).toBe(join(dir, CENSUS_FILE));
        const first = readFileSync(target, "utf8");
        expect(parseMark(first)?.version).toBe(1);
        await writeCensus("# Census\n", dir);
        expect(readFileSync(target, "utf8")).toBe(first);
    });
});

describe("the census lines", () => {
    it("name the command, the file written and each total", () => {
        expect(CENSUS_COMMAND).toContain("codebase:stats");
        expect(CENSUS_SUMMARY.endsWith(".")).toBe(true);
        expect(wroteCensus("out.md")).toContain("out.md");
        expect(authoredLine("1", "2", "3 B", "4")).toContain("4 governed modules");
        expect(taxonomyLine("1", "2", "3")).toContain("1/2 conformant");
    });
});
