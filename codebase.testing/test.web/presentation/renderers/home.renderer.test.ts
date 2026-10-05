import {
    FAQ_CARD_LINK,
    GRAMMAR_CARD_LINK,
    METHODOLOGY_CARD_LINK,
} from "@banes-lab/web/configuration/icons/home.icons.ts";
import { FAQ_ROW, GRAMMAR_ROW, METHODOLOGY_ROW } from "@banes-lab/web/configuration/strings/home.fragment.strings.ts";
import { describe, expect, it } from "vitest";
import { renderRows, renderStats } from "@banes-lab/web/presentation/renderers/home.renderer.ts";

const ROWS = [
    [METHODOLOGY_ROW, METHODOLOGY_CARD_LINK],
    [GRAMMAR_ROW, GRAMMAR_CARD_LINK],
] as const;

describe("renderRows", () => {
    it("renders one row per page, each behind the rail", () => {
        const rows = renderRows(ROWS, 0);
        expect(rows.querySelector("#home-rail")).not.toBeNull();
        expect(rows.querySelectorAll(".home-row")).toHaveLength(ROWS.length);
    });

    it("links the icon and the title to the page the row names", () => {
        const row = renderRows(ROWS, 0).querySelector(".home-row");
        expect(row?.querySelector(".page-icon")?.getAttribute("href")).toBe("/disciplined-methodology");
        expect(row?.querySelector(".row-title")?.getAttribute("href")).toBe("/disciplined-methodology");
    });

    it("carries the page accent on the icon so the row matches the header", () => {
        const row = renderRows(ROWS, 0).querySelector(".home-row");
        expect(row?.querySelector(".page-icon")?.className).toContain(METHODOLOGY_CARD_LINK.accent);
    });

    it("puts the audience on its own row after the tab chips", () => {
        const chips = renderRows(ROWS, 0).querySelector(".chips");
        expect(chips?.lastElementChild?.className).toBe("audience");
        expect(chips?.lastElementChild?.textContent).toBe(METHODOLOGY_ROW.audience);
    });

    it("leaves the audience row out for a page written for every reader", () => {
        const chips = renderRows([[FAQ_ROW, FAQ_CARD_LINK]], 0).querySelector(".chips");
        expect(chips?.querySelector(".audience")).toBeNull();
    });
});

describe("renderStats", () => {
    it("renders one counter per stat, each starting at zero", () => {
        const stats = renderStats([{ label: "rules", value: 12 }], 0);
        const cell = stats.querySelector(".home-stat");
        expect(cell?.querySelector("b")?.dataset.settledText).toBe("12");
        expect(cell?.querySelector("b")?.textContent).toBe("0");
        expect(cell?.querySelector("span")?.textContent).toBe("rules");
    });
});
