import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { captureOutput } from "./output.fixture.ts";
import { join } from "node:path";
import { runIndex } from "@govlab/docs/core/coordinators/index.coordinator.ts";
import { tmpdir } from "node:os";

const INDEX_TIMEOUT_MS = 120_000;
const dir = mkdtempSync(join(tmpdir(), "doc-index-run-"));
const TARGETS = {
    json: { path: join(dir, "index.json"), rel: "index.json" },
    markdown: { path: join(dir, "index.md"), rel: "index.md" },
};

afterEach(() => {
    vi.restoreAllMocks();
});

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("runIndex", () => {
    it(
        "writes the workspace index to its targets and reports them up to date on a check",
        async () => {
            const output = captureOutput();
            await runIndex(false, TARGETS);
            expect(readFileSync(TARGETS.markdown.path, "utf8")).toContain("# Workspace Index");
            expect(JSON.parse(readFileSync(TARGETS.json.path, "utf8"))).toHaveProperty("totalPackages");
            await runIndex(true, TARGETS);
            expect(output.out.join("")).toContain("Wrote index.md");
            expect(output.out.join("")).toContain("index: index.md up to date");
        },
        INDEX_TIMEOUT_MS,
    );
});
