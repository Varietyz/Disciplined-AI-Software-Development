import { describe, expect, it } from "vitest";
import {
    entriesAt,
    isRecord,
    numberAt,
    recordAt,
    textAt,
} from "@banes-lab/build-scripts/core/selectors/base.selector.ts";

const SOURCE = { count: 3, items: [1, 2], name: "n", nested: { a: 1 } };

describe("isRecord", () => {
    it("accepts an object and refuses null and a primitive", () => {
        expect(isRecord(SOURCE)).toBe(true);
        expect(isRecord(null)).toBe(false);
        expect(isRecord("x")).toBe(false);
    });
});

describe("textAt, numberAt, recordAt and entriesAt", () => {
    it("reads a field of the asked type and answers the empty value for anything else", () => {
        expect(textAt(SOURCE, "name")).toBe("n");
        expect(textAt(SOURCE, "count")).toBeNull();
        expect(numberAt(SOURCE, "count")).toBe(3);
        expect(numberAt(SOURCE, "name")).toBeNull();
        expect(recordAt(SOURCE, "nested")).toStrictEqual({ a: 1 });
        expect(recordAt(SOURCE, "items")).toStrictEqual([1, 2]);
        expect(recordAt(SOURCE, "name")).toBeNull();
        expect(entriesAt(SOURCE, "items")).toStrictEqual([1, 2]);
        expect(entriesAt(SOURCE, "name")).toStrictEqual([]);
    });
});
