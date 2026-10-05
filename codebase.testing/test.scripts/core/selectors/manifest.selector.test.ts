import { describe, expect, it } from "vitest";
import { exportPatternsOf, stringAt, stringRecordAt } from "@project/scripts/core/selectors/manifest.selector.ts";
import { join } from "node:path";
import { manifestOf } from "@project/scripts/core/loaders/manifest.loader.ts";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const ZONE = "zone";
const NAME = "@fixture/member";

const MANIFEST = {
    exports: { ".": `./${ZONE}.ts`, "./*": "./*", [`./${ZONE}/*`]: `./lib/${ZONE}/*`, "./skipped": { default: "x" } },
    main: 42,
    name: NAME,
};

describe("stringAt and stringRecordAt", () => {
    it("read a string field, and the string entries of a nested record, with an empty answer otherwise", () => {
        expect(stringAt(MANIFEST, "name")).toBe(NAME);
        expect(stringAt(MANIFEST, "main")).toBe("");
        expect(stringAt(null, "name")).toBe("");
        expect(stringRecordAt(MANIFEST, "exports")["./skipped"]).toBeUndefined();
        expect(stringRecordAt(MANIFEST, "name")).toStrictEqual({});
    });
});

describe("exportPatternsOf", () => {
    it("keeps the wildcard patterns, longest prefix first", () => {
        expect(exportPatternsOf(MANIFEST)).toStrictEqual([
            [`./${ZONE}/`, `./lib/${ZONE}/*`],
            ["./", "./*"],
        ]);
    });
});

describe("manifestOf", () => {
    it("reads the member's package manifest", () => {
        const root = mkdtempSync(join(tmpdir(), "manifest-"));
        writeVerbatim(join(root, "package.json"), JSON.stringify({ name: NAME }));
        expect(stringAt(manifestOf(root), "name")).toBe(NAME);
    });
});
