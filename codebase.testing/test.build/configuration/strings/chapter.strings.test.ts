import { chapterRefused, chaptersLine } from "@banes-lab/build-scripts/configuration/strings/chapter.strings.ts";
import { describe, expect, it } from "vitest";

describe("the chapter lines", () => {
    it("name the shape, the counts and the reason a render was refused", () => {
        expect(chapterRefused("wiki", "The checkout is missing.")).toBe(
            "chapters: the wiki shape was not rendered. The checkout is missing.",
        );
        expect(chaptersLine("wiki", 3, 1, "out")).toBe("chapters: rendered 3 wiki chapter(s) into out, removed 1\n");
    });
});
