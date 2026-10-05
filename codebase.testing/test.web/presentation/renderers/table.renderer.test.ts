import { describe, expect, it } from "vitest";
import { renderTable } from "@banes-lab/web/presentation/renderers/table.renderer.ts";

const HEADERS = ["Keyword", "Meaning"];
const ROWS = [
    ["READ", "Loads <code>data</code>"],
    ["WRITE", "Stores data"],
];
const KEYWORD_CLASS = "keyword";

describe("renderTable", () => {
    it("renders a header row and one body row per entry", () => {
        const table = renderTable({ headers: HEADERS, kind: "table", rows: ROWS });
        expect(table.querySelectorAll("th")).toHaveLength(HEADERS.length);
        expect(table.querySelectorAll("tbody tr")).toHaveLength(ROWS.length);
        expect(table.querySelector("td code")).not.toBeNull();
    });

    it("wraps leading cells in keyword chips for the keyword tone", () => {
        const table = renderTable({ headers: HEADERS, kind: "table", rows: ROWS, tone: "keyword" });
        expect(table.classList.contains("keyword")).toBe(true);
        expect(table.querySelectorAll(`td .${KEYWORD_CLASS}`)).toHaveLength(ROWS.length);
    });

    it("emboldens the first column for the role tone", () => {
        const table = renderTable({ headers: HEADERS, kind: "table", rows: ROWS, tone: "role" });
        expect(table.querySelectorAll("td strong")).toHaveLength(ROWS.length);
    });
});
