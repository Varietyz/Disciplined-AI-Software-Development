import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { persistLedger, readLedger } from "@banes-lab/build-scripts/core/persistence/route.persistence.ts";
import { DISCOVERY } from "../converters/site.fixture.ts";
import { join } from "node:path";
import { stampRoutes } from "@banes-lab/build-scripts/core/converters/route.converter.ts";
import { tmpdir } from "node:os";

describe("readLedger and persistLedger", () => {
    it("answers empty for a missing file and round-trips through the canonical writer", async () => {
        const dir = mkdtempSync(join(tmpdir(), "ledger-"));
        try {
            const file = join(dir, "sitemap.generated.json");
            expect(readLedger(file)).toStrictEqual({});
            const { ledger } = stampRoutes({}, DISCOVERY, new Date("2026-09-19T14:00:00Z"));
            await persistLedger(file, ledger);
            expect(readLedger(file)).toStrictEqual(ledger);
            expect(readFileSync(file, "utf8").endsWith("\n")).toBe(true);
        } finally {
            rmSync(dir, { force: true, recursive: true });
        }
    });
});
