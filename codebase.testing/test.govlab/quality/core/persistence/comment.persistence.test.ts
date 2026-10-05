import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { appendExtracted } from "@govlab/quality/core/persistence/comment.persistence.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "comment-persistence-"));

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("appendExtracted", () => {
    it("writes the collected comments to a new ledger and appends only unseen ones afterwards", async () => {
        const out = join(dir, "ledger", "comments.json");
        const first = { file: "a.ts", line: 1, text: "one" };
        const second = { file: "a.ts", line: 2, text: "two" };
        expect(await appendExtracted(out, [first, first])).toBe(1);
        expect(await appendExtracted(out, [first, second])).toBe(1);
        const parsed: unknown = JSON.parse(readFileSync(out, "utf8"));
        expect(parsed).toStrictEqual([first, second]);
    });

    it("throws on a ledger that holds malformed JSON rather than overwriting it", async () => {
        const out = join(dir, "broken.json");
        writeVerbatim(out, "{ not json");
        await expect(appendExtracted(out, [])).rejects.toThrow(SyntaxError);
    });
});
