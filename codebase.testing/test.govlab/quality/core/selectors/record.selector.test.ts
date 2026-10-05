import {
    arrayField,
    boolField,
    firstNumberField,
    firstRecord,
    hasField,
    isRecord,
    numberField,
    numericField,
    recordAt,
    recordsAt,
    stringArrayField,
    stringArrayFieldOr,
    stringField,
} from "@govlab/quality/core/selectors/record.selector.ts";
import { expect, test } from "vitest";

const DEFAULT = 7;
const record = {
    a: "x",
    flags: ["b", 1],
    list: [{ n: 1 }, 2],
    n: 3,
    nested: { k: 1 },
    numeric: "4",
    on: true,
    span: [5],
};

test("record selectors read typed fields with fallbacks", () => {
    expect(isRecord(record)).toBe(true);
    expect(recordAt(record, "nested")).toStrictEqual({ k: 1 });
    expect(recordAt(record, "a")).toStrictEqual({});
    expect(recordsAt(record, "list")).toStrictEqual([{ n: 1 }]);
    expect(firstRecord([])).toStrictEqual({});
    expect(stringField(record, "a")).toBe("x");
    expect(stringField(record, "n", "none")).toBe("none");
    expect(numberField(record, "n", DEFAULT)).toBe(3);
    expect(numberField(record, "a", DEFAULT)).toBe(DEFAULT);
    expect(boolField(record, "on")).toBe(true);
    expect(hasField(record, "missing")).toBe(false);
    expect(arrayField(record, "flags")).toStrictEqual(["b", 1]);
    expect(stringArrayField(record, "flags")).toStrictEqual(["b"]);
    expect(stringArrayFieldOr(record, "missing", ["d"])).toStrictEqual(["d"]);
    expect(numericField(record, "numeric", DEFAULT)).toBe(4);
    expect(firstNumberField(record, "span", DEFAULT)).toBe(5);
    expect(firstNumberField(record, "a", DEFAULT)).toBe(DEFAULT);
});
