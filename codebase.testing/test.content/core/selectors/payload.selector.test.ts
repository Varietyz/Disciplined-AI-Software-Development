import { contentOf, isRecord, listAt, tabsIn, textAt } from "@banes-lab/content/core/selectors/payload.selector.ts";
import { describe, expect, it } from "vitest";

describe("tabsIn", () => {
    it("reads the tabs of a page's content and nothing from a value without tabs", () => {
        expect(tabsIn({ tabs: [{ id: "start" }, "noise"] })).toStrictEqual([{ id: "start" }]);
        expect(tabsIn(null)).toStrictEqual([]);
    });
});

describe("contentOf, listAt, textAt and isRecord", () => {
    it("reads a payload's content, a list of records and a string field, and nothing of another type", () => {
        expect(contentOf({ content: { id: "a" } })).toStrictEqual({ id: "a" });
        expect(contentOf({ content: "text" })).toBeNull();
        expect(listAt({ items: [{ id: "a" }, 3] }, "items")).toStrictEqual([{ id: "a" }]);
        expect(textAt({ count: 1, id: "a" }, "id")).toBe("a");
        expect(textAt({ count: 1, id: "a" }, "count")).toBeNull();
        expect(isRecord(null)).toBe(false);
    });
});
