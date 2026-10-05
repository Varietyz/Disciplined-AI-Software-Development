import {
    FIXED_OWNER_FALLBACK,
    channelMismatch,
    concernsShape,
    configInvalid,
    duplicateConcern,
    fixedOwnerValue,
    fixedSurfaceOwner,
    ownerContention,
    ownersInvalid,
    surfaceWithoutRow,
    unknownConcept,
    unknownResolvedConcern,
    unknownSetting,
    unknownSurface,
} from "@govlab/quality/configuration/strings/quality.strings.ts";
import { describe, expect, it } from "vitest";

const CONCEPT_COUNT = 12;

describe("quality strings", () => {
    it("name the concern, concept and setting each line reports", () => {
        const lines: [string, string][] = [
            [duplicateConcern("naming"), '"naming"'],
            [unknownResolvedConcern("ghost"), '"ghost"'],
            [concernsShape("array"), "array"],
            [unknownConcept("ghost", CONCEPT_COUNT), "12 canonical concepts"],
            [unknownSetting("line-length"), '"line-length"'],
            [channelMismatch("line-length", "value", "enabled"), "enabled channel"],
            [ownersInvalid("  - a"), "  - a"],
            [configInvalid("govlab.config.ts", "eslint"), "govlab.config.ts"],
        ];
        for (const [line, part] of lines) {
            expect(line).toContain(part);
        }
    });

    it("name the surface, the language and the tools of an ownership conflict", () => {
        expect(ownerContention("format", "ts", "prettier, biome")).toContain("prettier, biome");
        expect(fixedOwnerValue("gofmt", "no configurable value", "go", "indent=2")).toContain("indent=2");
        expect(unknownSurface("ghost")).toContain('"ghost"');
        expect(fixedSurfaceOwner("format", "go", FIXED_OWNER_FALLBACK, "prettier")).toContain("the tool");
        expect(surfaceWithoutRow("ruff", "format", "ts")).toContain('"ruff"');
    });
});
