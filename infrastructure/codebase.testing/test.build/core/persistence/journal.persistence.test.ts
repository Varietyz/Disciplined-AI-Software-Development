import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { persistJournal, readJournal } from "@banes-lab/build-scripts/core/persistence/journal.persistence.ts";
import { EMPTY_JOURNAL } from "@banes-lab/build-scripts/core/converters/journal.converter.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("readJournal and persistJournal", () => {
    it("reads nothing where no journal was written, and reads back what was written", async () => {
        const dir = mkdtempSync(join(tmpdir(), "journal-"));
        try {
            const file = join(dir, "journal.generated.json");
            expect(readJournal(file)).toStrictEqual(EMPTY_JOURNAL);
            const journal = {
                moved: { "architecture:x": { json: "/json/records/architecture/x", to: null } },
                refs: {},
            };
            await persistJournal(journal, file);
            expect(readJournal(file)).toStrictEqual(journal);
        } finally {
            rmSync(dir, { force: true, recursive: true });
        }
    });
});
