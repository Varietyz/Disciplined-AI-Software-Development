import { artifactDrift, artifactsEqual, checkHexMaster } from "@govlab/patterns/core/validators/report.validator.ts";
import { describe, expect, it } from "vitest";
import { buildMasterFindings } from "@govlab/patterns/core/formatters/report.formatter.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("the report validator", () => {
    const dir = mkdtempSync(join(tmpdir(), "pl-validate-"));
    writeVerbatim(join(dir, "a.generated.json"), "A\n");

    it("artifactDrift compares each artifact with disk, ignoring trailing whitespace", () => {
        expect(artifactDrift(dir, new Map([["a.generated.json", "A"]]))).toBe(false);
        expect(artifactDrift(dir, new Map([["a.generated.json", "B"]]))).toBe(true);
        expect(artifactDrift(dir, new Map([["missing.generated.json", "C"]]))).toBe(true);
    });

    it("artifactsEqual requires the same names and the same contents", () => {
        expect(artifactsEqual(new Map([["a", "x\n"]]), new Map([["a", "x"]]))).toBe(true);
        expect(artifactsEqual(new Map([["a", "x"]]), new Map([["b", "x"]]))).toBe(false);
    });

    it("checkHexMaster accepts a master that matches a fresh build of the findings", () => {
        const master = join(dir, "master.generated.json");
        writeVerbatim(master, buildMasterFindings([]));
        expect(checkHexMaster(master, [])).toBe(true);
        expect(checkHexMaster(join(dir, "absent.generated.json"), [])).toBe(false);
    });
});
