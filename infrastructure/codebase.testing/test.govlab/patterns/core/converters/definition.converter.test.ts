import { call, definition } from "../analyzers/code.fixture.ts";
import { codeGraph, codeInsight } from "@govlab/patterns/core/analyzers/code.analyzer.ts";
import { describe, expect, it } from "vitest";
import { definitionRecords } from "@govlab/patterns/core/converters/definition.converter.ts";

describe("definitionRecords", () => {
    it("lists each definition's callers and callees by key", () => {
        const symbols = [definition("caller", "a.ts"), call("callee", "caller", "a.ts"), definition("callee", "b.ts")];
        const records = definitionRecords(codeInsight(symbols, []), codeGraph(symbols));
        const callee = records.find((record) => record.name === "callee");
        const caller = records.find((record) => record.name === "caller");
        expect(callee?.callers).toStrictEqual(["a.ts::caller"]);
        expect(caller?.callees).toStrictEqual(["b.ts::callee"]);
    });
});
