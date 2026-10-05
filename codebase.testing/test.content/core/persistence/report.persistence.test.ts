import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import {
    persistGeneratedMarkdown,
    persistJson,
    persistText,
    readJsonOrNull,
} from "@banes-lab/content/core/persistence/report.persistence.ts";
import { join } from "node:path";
import { parseMark } from "@govlab/canonical-write";
import { tmpdir } from "node:os";

describe("persistJson, persistText and readJsonOrNull", () => {
    const folder = mkdtempSync(join(tmpdir(), "content-report-"));

    it("writes canonical JSON into a folder it creates and reads it back", async () => {
        const target = join(folder, "nested", "report.generated.json");
        await persistJson(target, { a: [2], b: 1 });
        expect(readJsonOrNull(target)).toStrictEqual({ a: [2], b: 1 });
    });

    it("writes canonical Markdown and returns null for an absent file", async () => {
        const target = join(folder, "doc.generated.md");
        await persistText(target, "# Title\n\ntext\n");
        expect(readFileSync(target, "utf8")).toContain("# Title");
        expect(readJsonOrNull(join(folder, "missing.json"))).toBeNull();
    });

    it("stamps a generated document with the generated mark", async () => {
        const target = join(folder, "deep", "baseline.generated.md");
        await persistGeneratedMarkdown(target, "# Baseline\n\nfact\n");
        expect(parseMark(readFileSync(target, "utf8"))?.version).toBe(1);
    });
});
