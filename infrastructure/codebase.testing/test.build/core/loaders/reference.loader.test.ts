import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { referenceTargetsOf } from "@banes-lab/build-scripts/core/loaders/reference.loader.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("referenceTargetsOf", () => {
    it("reads a references asset's channel and binding targets, and none from an absent file", () => {
        const folder = mkdtempSync(join(tmpdir(), "reference-"));
        const references = {
            sites: [1, 0, 0],
            spans: {},
            strings: { "a.ts": { kind: "file", path: "a.ts" } },
            targets: [{ kind: "file", path: "b.ts" }],
            words: {},
        };
        writeVerbatim(join(folder, "references.json"), JSON.stringify(references));
        const targets = referenceTargetsOf(join(folder, "references.json"));
        const absent = referenceTargetsOf(join(folder, "absent.json"));
        rmSync(folder, { force: true, recursive: true });
        expect(targets).toStrictEqual([
            { kind: "file", path: "a.ts" },
            { kind: "file", path: "b.ts" },
        ]);
        expect(absent).toStrictEqual([]);
    });
});
