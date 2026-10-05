import {
    CONVERTIBLE,
    DEFAULT_SCOPE_NOUN,
    EMPTY_FROM,
    EXTENSION_REQUIRED,
    ROOT_REQUIRED,
    UNPAIRED_FROM,
    ambiguousTarget,
    appliedLine,
    blockedLine,
    gatedLine,
    handFixLine,
    leftAsWrittenLine,
    mapLine,
    missingTarget,
    noteLine,
    refusedLine,
    spellingHit,
    syntaxRefusal,
} from "@ssot/govlab/codemods/strings/codemod.strings.ts";
import { describe, expect, it } from "vitest";

describe("the codemod lines", () => {
    it("name the file a rewrite would have broken, and the reason a run is refused", () => {
        expect(syntaxRefusal("a.ts")).toContain("refused to write a.ts");
        expect(refusedLine(ROOT_REQUIRED)).toBe(`REFUSED: ${ROOT_REQUIRED}\n`);
        expect([EXTENSION_REQUIRED, UNPAIRED_FROM, EMPTY_FROM].every((reason) => reason.includes("--"))).toBe(true);
    });

    it("report what a run applied, mapped, blocked and left as written", () => {
        expect(mapLine("a.ts:1", "x", CONVERTIBLE)).toBe("a.ts:1\tx\tconvertible");
        expect(blockedLine("a.ts:1", "rule", "why")).toBe("a.ts:1 [rule] why");
        expect(gatedLine("line")).toBe("✖ line");
        expect(noteLine("line")).toBe("  line");
        expect(appliedLine("rule", 2, "edit(s)", "1", DEFAULT_SCOPE_NOUN)).toBe(
            "rule: applied 2 edit(s) across 1 program(s)",
        );
        expect(handFixLine("rule", 1)).toContain("rule: 1 finding(s) cannot be applied automatically");
        expect(leftAsWrittenLine("rule", 1)).toContain("left as written");
    });

    it("name the specifier that resolves to no file and the candidates that carry its name", () => {
        expect(missingTarget("./gone.ts", "gone.ts")).toContain("no file in its member is named 'gone.ts'");
        expect(ambiguousTarget("./a.ts", ["x/a.ts", "y/a.ts"])).toContain("carry its name: x/a.ts, y/a.ts");
    });

    it("name the American form of a checked spelling and the exclusion entry that admits a quoted one", () => {
        const hit = spellingHit("color", "american-spelling");
        expect(hit).toContain('American form is "color"');
        expect(hit).toContain('"american-spelling" entry of qualityMaster.toolExclude');
    });
});
