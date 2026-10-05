import { describe, expect, it } from "vitest";
import { isFlatRecord, isPlainRecord, isRecord, isRecordArray } from "@govlab/docs/core/predicates/record.predicate.ts";

describe("the record predicates", () => {
    it("tell records, plain records, record arrays and flat string records apart", () => {
        expect([isRecord({}), isRecord([]), isRecord(null)]).toStrictEqual([true, true, false]);
        expect([isPlainRecord({}), isPlainRecord([])]).toStrictEqual([true, false]);
        expect([isRecordArray([{ a: 1 }]), isRecordArray([]), isRecordArray([1])]).toStrictEqual([true, false, false]);
        expect([isFlatRecord({ a: "x" }), isFlatRecord({}), isFlatRecord({ a: 1 })]).toStrictEqual([
            true,
            false,
            false,
        ]);
    });
});
