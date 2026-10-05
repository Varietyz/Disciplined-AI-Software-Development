import { describe, expect, it } from "vitest";
import { renamedSpans, renamedText } from "@ssot/govlab/shared/matchers/word.matcher.ts";
import type { RenameRules } from "@ssot/govlab/types/writing.types.ts";

const IDS: ReadonlyMap<string, string> = new Map([
    ["arch", "architecture"],
    ["arch-category", "architecture-category"],
]);
const WORDS: ReadonlyMap<string, string> = new Map([["face", "collection"]]);
const RULES: RenameRules = { ids: IDS, pathSegments: ["records"], wholeId: false, words: WORDS };

describe("renamedSpans", () => {
    it("takes the longest id first, so a category id is not read as its parent", () => {
        expect(renamedSpans("arch-category:x", RULES).map((span) => span.to)).toEqual(["architecture-category"]);
    });

    it("reads a placeholder reference, a closing prefix and a collection name", () => {
        expect(renamedSpans("arch:<id>", RULES)).toHaveLength(1);
        expect(renamedSpans("arch:", RULES)).toHaveLength(1);
        expect(renamedSpans("the `arch` collection", RULES)).toHaveLength(1);
        expect(renamedSpans("the arch collections", RULES)).toHaveLength(0);
    });

    it("reads a path segment only below a declared segment, even inside prose", () => {
        expect(renamedSpans("list records/arch/a.md here", RULES)).toHaveLength(1);
        expect(renamedSpans("src/arch/a.ts", RULES)).toHaveLength(0);
    });

    it("renames a whole literal id only when asked, and a closing anchor prefix only then", () => {
        expect(renamedSpans("arch", RULES)).toHaveLength(0);
        expect(renamedSpans("arch", { ...RULES, wholeId: true })).toEqual([
            { end: 4, from: "arch", start: 0, to: "architecture" },
        ]);
        expect(renamedSpans("arch-", { ...RULES, wholeId: true })).toHaveLength(1);
    });

    it("keeps a word's case and skips a word joined to another", () => {
        expect(renamedSpans("Face and FACE and face-off", RULES).map((span) => span.to)).toEqual([
            "Collection",
            "COLLECTION",
        ]);
    });
});

describe("renamedText", () => {
    it("rewrites every span and keeps the rest of the text", () => {
        expect(renamedText("see arch:x and the face", RULES)).toBe("see architecture:x and the collection");
        expect(renamedText("nothing here", RULES)).toBe("nothing here");
    });
});
