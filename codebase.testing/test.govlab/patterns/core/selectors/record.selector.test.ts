import { describe, expect, it } from "vitest";
import { foldRecords } from "@govlab/patterns/core/selectors/record.selector.ts";

describe("foldRecords", () => {
    it("observes the field of every record that carries it, null included", () => {
        const seen: unknown[] = [];
        foldRecords([{ a: 1 }, { b: 2 }, { a: null }, "scalar"], "a", (value) => {
            seen.push(value);
        });
        expect(seen).toStrictEqual([1, null]);
    });
});
