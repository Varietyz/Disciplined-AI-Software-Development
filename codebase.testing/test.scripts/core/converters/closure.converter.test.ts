import { callDelta, exportDelta, foldDeltas } from "@project/scripts/core/converters/closure.converter.ts";
import { describe, expect, it } from "vitest";

const FILE = "core/a.ts";
const ID = { kind: "ident", text: "A_ID" };

describe("callDelta", () => {
    it("files a call by the verb its name opens with", () => {
        expect(callDelta({ file: FILE, fn: "registerPage", idArg: ID }, ID).registers).toHaveLength(1);
        expect(callDelta({ file: FILE, fn: "getPage", idArg: ID }, ID).consumers).toHaveLength(1);
        expect(callDelta({ file: FILE, fn: "emitEvent", idArg: ID }, ID).emits).toStrictEqual([
            { eventArg: ID, file: FILE },
        ]);
        expect(callDelta({ file: FILE, fn: "registerEventListener", idArg: ID }, ID).eventActivity).toHaveLength(1);
        expect(callDelta({ file: FILE, fn: "getElementById", idArg: null }, null).consumers).toStrictEqual([]);
    });
});

describe("exportDelta and foldDeltas", () => {
    it("adds the exports to the concern set the flags name, and folds deltas into one graph body", () => {
        const flags = { isIcons: false, isIds: true, isStrings: false };
        const folded = foldDeltas([
            exportDelta(["A_ID"], FILE, flags),
            exportDelta(["run"], FILE, { ...flags, isIds: false }),
        ]);
        expect(folded.exports.map((entry) => entry.name)).toStrictEqual(["A_ID", "run"]);
        expect(folded.idsExports.map((entry) => entry.name)).toStrictEqual(["A_ID"]);
        expect(folded.stringsExports).toStrictEqual([]);
        expect(foldDeltas([]).imports).toStrictEqual([]);
    });
});
