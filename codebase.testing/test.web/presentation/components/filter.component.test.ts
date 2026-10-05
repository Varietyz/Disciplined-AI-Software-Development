import { describe, expect, it } from "vitest";
import { createFilterBox } from "@banes-lab/web/presentation/components/filter.component.ts";

describe("createFilterBox", () => {
    it("renders a labeled search input and reports each query trimmed and lower-cased", () => {
        const queries: string[] = [];
        const box = createFilterBox("Filter", "Filter", (query) => {
            queries.push(query);
        });
        expect(box.getAttribute("type")).toBe("search");
        expect(box.getAttribute("aria-label")).toBe("Filter");
        box.value = "  Single Owner ";
        box.dispatchEvent(new Event("input"));
        expect(queries).toStrictEqual(["single owner"]);
    });
});
