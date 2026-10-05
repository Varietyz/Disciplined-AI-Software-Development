import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { readJson } from "@govlab/stats/core/loaders/data.loader.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "data-loader-"));

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("readJson", () => {
    it("parses a file, reads null for a missing one, and throws on malformed content", () => {
        const file = join(root, "probe.json");
        const malformed = join(root, "malformed.json");
        writeVerbatim(file, '{ "name": "probe" }\n');
        writeVerbatim(malformed, "{ not json\n");
        expect(readJson(file)).toStrictEqual({ name: "probe" });
        expect(readJson(join(root, "absent.json"))).toBeNull();
        expect(() => readJson(malformed)).toThrow(SyntaxError);
    });
});
