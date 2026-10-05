import { describe, expect, it } from "vitest";
import { recordsIn, statedCount, statedUpdate } from "@project/scripts/core/selectors/rate.selector.ts";
import { PAGE } from "../analyzers/rate.fixture.ts";
import { unreadableRecord } from "@project/scripts/configuration/strings/rate.strings.ts";

describe("recordsIn and the stated header", () => {
    it("reads every embedded record once, and the count and update date the page states", () => {
        expect(recordsIn(PAGE).map((record) => record.id)).toStrictEqual(["a", "b", "c", "d"]);
        expect(statedCount(PAGE)).toBe(4);
        expect(statedUpdate(PAGE)).toBe("23 Mar 2026");
    });

    it("reads a range as its midpoint and skips a record with no rate", () => {
        const ranged = '{"source":"reddit","externalId":"r","dayRateMin":600,"dayRateMax":800,"jobTitle":"Tech Lead"}';
        const rateless = '{"source":"reddit","externalId":"n","jobTitle":"Tech Lead"}';
        expect(recordsIn(ranged + rateless).map((record) => [record.id, record.rate])).toStrictEqual([["r", 700]]);
    });

    it("reads nothing from a page with no records and no header", () => {
        expect(recordsIn("<html></html>")).toStrictEqual([]);
        expect(statedCount("<html></html>")).toBeNull();
    });

    it("fails loudly on a record that is not valid JSON, naming where it starts", () => {
        const broken = '<i>{"source":"x", oops}</i>';
        expect(() => recordsIn(broken)).toThrow(unreadableRecord(broken.indexOf("{")));
    });
});
