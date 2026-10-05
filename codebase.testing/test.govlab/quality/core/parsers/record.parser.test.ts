import { expect, test } from "vitest";
import {
    jsonArray,
    jsonRecord,
    jsonRecordsAt,
    jsonRecordsFlexible,
    objectEntriesAt,
    parseJsonRecords,
} from "@govlab/quality/core/parsers/record.parser.ts";

test("the JSON readers keep only records, and read text that is not JSON as nothing, since a tool may print a notice", () => {
    expect(parseJsonRecords('[{"a":1},2]')).toStrictEqual([{ a: 1 }]);
    expect(parseJsonRecords("  ")).toStrictEqual([]);
    expect(parseJsonRecords("nope")).toStrictEqual([]);
    expect(jsonRecordsAt('{"items":[{"a":1},"x"]}', "items")).toStrictEqual([{ a: 1 }]);
    expect(jsonRecord('{"a":1}')).toStrictEqual({ a: 1 });
    expect(jsonRecord("[1]")).toStrictEqual({});
    expect(jsonRecordsFlexible('{"a":1}')).toStrictEqual([{ a: 1 }]);
    expect(jsonRecordsFlexible('[{"a":1}]')).toStrictEqual([{ a: 1 }]);
    expect(jsonArray("[1,2]")).toStrictEqual([1, 2]);
    expect(jsonArray('{"a":1}')).toStrictEqual([]);
    expect(objectEntriesAt('{"files":{"a.ts":{"n":1},"b.ts":2}}', "files")).toStrictEqual([["a.ts", { n: 1 }]]);
});
