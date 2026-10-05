import { arrayField, field, numberField, stringField, stringsIn } from "@govlab/stats/core/selectors/field.selector.ts";
import { describe, expect, it } from "vitest";

const RECORD = { count: 3, items: ["a", 1], name: "probe" };

describe("the field selectors", () => {
    it("read a typed value or its fallback, and never throw on a non-record", () => {
        expect(field(RECORD, "name")).toBe("probe");
        expect(field(["name"], "name")).toBeNull();
        expect(stringField(RECORD, "count")).toBe("");
        expect(stringField(RECORD, "name")).toBe("probe");
        expect(numberField(RECORD, "name", 7)).toBe(7);
        expect(numberField(RECORD, "count", 7)).toBe(3);
        expect(arrayField(RECORD, "items")).toStrictEqual(["a", 1]);
        expect(arrayField(null, "items")).toStrictEqual([]);
    });

    it("keep only the strings of an array", () => {
        expect(stringsIn(RECORD.items)).toStrictEqual(["a"]);
        expect(stringsIn("a")).toStrictEqual([]);
    });
});
