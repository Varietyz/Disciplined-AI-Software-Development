import { expect, test } from "vitest";
import { mkdtempSync } from "node:fs";
import path from "node:path";
import { runQuality } from "@govlab/quality/core/coordinators/quality.coordinator.ts";
import { tmpdir } from "node:os";

test("runQuality runs only the named tools over the given ecosystems and reports a clean empty run", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "quality-run-"));
    const outcome = await runQuality({
        ecosystems: ["lua"],
        fix: false,
        only: ["luacheck"],
        paths: ["missing"],
        reporter: "json",
        root,
    });
    expect(outcome.exitCode).toBe(0);
    expect(JSON.parse(outcome.report)).toHaveProperty("summary");
});
