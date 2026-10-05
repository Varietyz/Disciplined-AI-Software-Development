import { CORRECT_LABEL, WRONG_LABEL } from "@banes-lab/web/configuration/strings/tab.strings.ts";
import { describe, expect, it } from "vitest";
import { renderGrammarBlock } from "@banes-lab/web/presentation/renderers/grammar.renderer.ts";

const NAME = "READ";
const DESCRIPTION = "Reads a source";
const EXAMPLE = "READ file INTO data";
const ISSUE = "Missing colon";
const CHECKED_CLASS = "checked";
const CHECK_ITEM_CLASS = "check-item";

describe("renderGrammarBlock", () => {
    it("renders plain and described keywords", () => {
        const grid = renderGrammarBlock({
            keywords: [NAME, { description: DESCRIPTION, example: EXAMPLE, name: NAME }],
            kind: "keyword",
        });
        expect(grid.querySelectorAll("code")).toHaveLength(3);
        expect(grid.textContent.includes(DESCRIPTION)).toBe(true);
    });

    it("renders comparisons with wrong and correct verdicts", () => {
        const grid = renderGrammarBlock({
            entries: [{ correct: EXAMPLE, issue: ISSUE, wrong: NAME }],
            kind: "compare",
        });
        expect(grid.querySelector(".compare-wrong")?.textContent.includes(WRONG_LABEL)).toBe(true);
        expect(grid.querySelector(".compare-correct")?.textContent.includes(CORRECT_LABEL)).toBe(true);
    });

    it("toggles a check item on click", () => {
        const grid = renderGrammarBlock({ items: [DESCRIPTION], kind: "check" });
        const item = grid.querySelector<HTMLElement>(`.${CHECK_ITEM_CLASS}`);
        item?.click();
        expect(item?.classList.contains(CHECKED_CLASS)).toBe(true);
        item?.click();
        expect(item?.classList.contains(CHECKED_CLASS)).toBe(false);
    });

    it("renders signatures and diagrams", () => {
        const types = renderGrammarBlock({ kind: "type", types: [{ name: NAME, purpose: DESCRIPTION, verb: NAME }] });
        expect(types.querySelectorAll(".type-card")).toHaveLength(1);
        const diagram = renderGrammarBlock({ grammar: true, kind: "diagram", text: EXAMPLE });
        expect(diagram.querySelector("pre")?.classList.contains("grammar")).toBe(true);
        expect(diagram.textContent).toBe(EXAMPLE);
    });
});
