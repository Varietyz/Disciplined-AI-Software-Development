import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { persistReport } from "@project/scripts/core/persistence/report.persistence.ts";
import { reportAt } from "@project/scripts/core/loaders/report.loader.ts";
import { tmpdir } from "node:os";

describe("persistReport and reportAt", () => {
    it("writes a report into a folder it creates, and reads it back, or null when it is absent", async () => {
        const folder = mkdtempSync(join(tmpdir(), "report-"));
        const target = join(folder, "nested", "report.json");
        expect(reportAt(target)).toBeNull();
        await persistReport(target, { numPassedTests: 3 });
        expect(reportAt(target)).toStrictEqual({ numPassedTests: 3 });
    });
});
