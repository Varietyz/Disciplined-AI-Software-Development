import { describe, expect, it } from "vitest";
import { INDEX_INDENT } from "@govlab/content-fingerprint/configuration/constants/fingerprint.constants.ts";
import { createFingerprintIndex } from "@govlab/content-fingerprint";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { withTemp } from "../converters/fingerprint.fixture.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const INDEX_NAME = "index.cache";

describe("createFingerprintIndex", () => {
    it("records a hash, reports it unchanged on reload, and honors force", () => {
        withTemp((dir) => {
            const file = join(dir, "nested", INDEX_NAME);
            const first = createFingerprintIndex({ file });
            expect(first.unchanged("k", "h1")).toBe(false);
            first.update("k", "h1");
            first.flush();
            expect(readFileSync(file, "utf8")).toBe(`${JSON.stringify({ k: "h1" }, null, INDEX_INDENT)}\n`);
            const reloaded = createFingerprintIndex({ file });
            expect(reloaded.unchanged("k", "h1")).toBe(true);
            expect(reloaded.unchanged("k", "h2")).toBe(false);
            const forced = createFingerprintIndex({ file, force: true });
            expect(forced.unchanged("k", "h1")).toBe(false);
        });
    });

    it("starts empty from an index whose values are not all strings, or that does not parse", () => {
        withTemp((dir) => {
            const file = join(dir, INDEX_NAME);
            writeVerbatim(file, '{"k":1}');
            expect(createFingerprintIndex({ file }).unchanged("k", "1")).toBe(false);
            writeVerbatim(file, "{");
            expect(createFingerprintIndex({ file }).unchanged("k", "1")).toBe(false);
        });
    });
});
