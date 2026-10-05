import { describe, expect, it } from "vitest";
import { validateWith } from "./validation.fixture.ts";

const RULE = "css-mobile-imports";

describe("the css-mobile-imports validator", () => {
    it("flags an orphaned mobile file with no base", () => {
        const found = validateWith(RULE, [["styles/card-mobile.css", "@media (max-width:600px){.c{color:red}}"]]);
        expect(found).toHaveLength(1);
        expect(found[0]?.message).toContain("no base file");
    });

    it("flags a mobile file that no barrel imports", () => {
        const found = validateWith(RULE, [
            ["styles/card-mobile.css", "@media (max-width:600px){.c{color:red}}"],
            ["styles/card.css", ".c{}"],
            ["styles/index.css", "@import 'card.css';"],
        ]);
        expect(found).toHaveLength(1);
        expect(found[0]?.message).toContain("not @imported");
    });

    it("passes when base exists and mobile is imported", () => {
        const found = validateWith(RULE, [
            ["styles/card-mobile.css", "@media (max-width:600px){.c{}}"],
            ["styles/card.css", ".c{}"],
            ["styles/index.css", "@import 'card.css';\n@import 'card-mobile.css';"],
        ]);
        expect(found).toEqual([]);
    });
});
