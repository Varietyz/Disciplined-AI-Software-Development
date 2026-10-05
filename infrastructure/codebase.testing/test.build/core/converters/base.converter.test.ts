import { describe, expect, it } from "vitest";
import { groupedBy, orNull } from "@banes-lab/build-scripts/core/converters/base.converter.ts";

describe("groupedBy", () => {
    it("groups items by key, keeps each group's order and sorts the groups by key", () => {
        const groups = groupedBy(["banana", "apple", "blueberry", "avocado"], (word) => word.charAt(0));
        expect([...groups.entries()]).toStrictEqual([
            ["a", ["apple", "avocado"]],
            ["b", ["banana", "blueberry"]],
        ]);
    });
});

describe("orNull", () => {
    it("keeps a text and turns a missing or empty one into null", () => {
        expect(orNull("x")).toBe("x");
        expect(orNull("")).toBeNull();
        expect(orNull()).toBeNull();
    });
});
