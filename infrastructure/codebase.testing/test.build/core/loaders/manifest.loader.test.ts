import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { principlesOf, selfGovernedPathOf } from "@banes-lab/build-scripts/core/loaders/manifest.loader.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("principlesOf", () => {
    it("reads a manifest's declared principles and drops an entry that is not a name", () => {
        const folder = mkdtempSync(join(tmpdir(), "manifest-"));
        writeVerbatim(join(folder, "manifest.json"), JSON.stringify({ governance: { principles: ["fail-fast", 3] } }));
        const principles = principlesOf(folder, "manifest.json");
        rmSync(folder, { force: true, recursive: true });
        expect(principles).toStrictEqual(["fail-fast"]);
    });
});

describe("selfGovernedPathOf", () => {
    it("reads the path a module's manifest declares it governs itself through, and nothing for a module with none", () => {
        const folder = mkdtempSync(join(tmpdir(), "manifest-"));
        const declared = join(folder, "declared");
        mkdirSync(declared);
        writeVerbatim(
            join(declared, "_manifest.json"),
            JSON.stringify({ selfGoverned: { paths: "kit/own.config.ts" } }),
        );
        const found = selfGovernedPathOf(declared);
        const absent = selfGovernedPathOf(folder);
        rmSync(folder, { force: true, recursive: true });
        expect(found).toBe("kit/own.config.ts");
        expect(absent).toBeNull();
    });
});
