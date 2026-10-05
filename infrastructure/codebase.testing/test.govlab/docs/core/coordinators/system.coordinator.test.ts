import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { captureOutput } from "./output.fixture.ts";
import { join } from "node:path";
import { runSystem } from "@govlab/docs/core/coordinators/system.coordinator.ts";
import { tmpdir } from "node:os";

const dir = mkdtempSync(join(tmpdir(), "doc-system-run-"));
const TARGET = { path: join(dir, "system.md"), rel: "system.md" };

afterEach(() => {
    vi.restoreAllMocks();
});

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("runSystem", () => {
    it("writes the system document and reports it up to date on a check", () => {
        const output = captureOutput();
        runSystem(false, TARGET);
        expect(readFileSync(TARGET.path, "utf8")).toContain("System Architecture");
        runSystem(true, TARGET);
        expect(output.out).toStrictEqual(["system-charts: wrote system.md\n", "system-charts: system.md up to date\n"]);
    });
});
