import {
    blockedPanel,
    constantAlias,
    constantAliasFix,
    constantDuplicate,
    constantDuplicateFix,
    danglingVar,
    danglingVarFix,
    deadVar,
    deadVarFix,
    duplicateComponent,
    duplicateComponentFix,
    duplicateValidator,
    fileNameSpace,
    findingAction,
    findingHead,
    findingMessage,
    folderNotKebab,
    manifestsFailed,
    mobileNotImported,
    mobileNotImportedFix,
    mobileWithoutBase,
    mobileWithoutBaseFix,
    ruleDerivationFailed,
    strayVar,
    strayVarFix,
    validationFailed,
} from "@govlab/quality/configuration/strings/validation.strings.ts";
import { describe, expect, it } from "vitest";

const COUNT = 3;

describe("validation strings", () => {
    it("name the constant, component and custom property each finding reports", () => {
        const lines: [string, string][] = [
            [constantAlias("A", "B"), "'B'"],
            [constantAliasFix("A", "B"), "'A'"],
            [constantDuplicate("MAX", COUNT), "3 files"],
            [constantDuplicateFix("MAX", COUNT), "3 consumers"],
            [duplicateComponent("card", COUNT), "'.card'"],
            [duplicateComponentFix("card"), "'.card'"],
            [deadVar("--gap"), "'--gap'"],
            [deadVarFix("--gap"), "var(--gap)"],
            [danglingVar("--gap"), "var(--gap)"],
            [danglingVarFix("--gap"), "'--gap'"],
            [strayVar("--gap"), "'--gap'"],
            [strayVarFix("--gap"), "'--gap'"],
            [mobileWithoutBase("a-mobile.css", "a.css"), "'a.css'"],
            [mobileWithoutBaseFix("a.css"), "'a.css'"],
            [mobileNotImported("a-mobile.css"), "'a-mobile.css'"],
            [mobileNotImportedFix("a-mobile.css", "a.css"), "'a.css'"],
            [fileNameSpace("a b.ts"), "'a b.ts'"],
            [folderNotKebab("Src"), "'Src'"],
            [duplicateValidator("naming"), '"naming"'],
        ];
        for (const [line, part] of lines) {
            expect(line).toContain(part);
        }
    });

    it("lay out the quality-gate panel and the validator failure headers", () => {
        expect(blockedPanel(COUNT)).toContain("3 finding(s)");
        expect(findingHead("a.ts:1", "naming")).toContain("naming");
        expect(findingMessage("m")).toBe("    m");
        expect(findingAction("split it")).toContain("split it");
        expect(validationFailed("install-registry")).toContain("install-registry");
        expect(manifestsFailed(COUNT)).toContain("3 stale declarations");
        expect(ruleDerivationFailed(COUNT)).toContain("3 hardcoded structural facts");
    });
});
