import {
    arrayField,
    isNonEmptyStringArray,
    recordField,
    stringField,
    stringsOf,
} from "@govlab/docs/core/selectors/record.selector.ts";
import { describe, expect, it } from "vitest";
import { byString } from "@govlab/docs/core/selectors/base.selector.ts";

const RECORD = { list: [1, "a"], name: "x", nested: { k: "v" } };

describe("the record selectors", () => {
    it("read a field by its shape and fall back when the shape differs", () => {
        expect(recordField(RECORD, "nested")).toStrictEqual({ k: "v" });
        expect(recordField(RECORD, "list")).toBeNull();
        expect(stringField(RECORD, "name")).toBe("x");
        expect(stringField(RECORD, "list")).toBeNull();
        expect(arrayField(RECORD, "list")).toStrictEqual([1, "a"]);
        expect(arrayField(RECORD, "name")).toStrictEqual([]);
        expect(stringsOf(RECORD.list)).toStrictEqual(["a"]);
        expect([
            isNonEmptyStringArray(["a"]),
            isNonEmptyStringArray(["a", " "]),
            isNonEmptyStringArray("a"),
        ]).toStrictEqual([true, false, false]);
    });
});

describe("byString", () => {
    it("builds a comparator over a string key", () => {
        const sorted = [{ id: "b" }, { id: "a" }].toSorted(byString((item) => item.id));
        expect(sorted.map((item) => item.id)).toStrictEqual(["a", "b"]);
    });
});
