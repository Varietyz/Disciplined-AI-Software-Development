import { BUILD_TAB, PLANS, ROUTE, STOPS } from "./graph.fixture.ts";
import {
    citationOf,
    numbersIn,
    sectionNumbers,
    siteCodes,
} from "@banes-lab/build-scripts/core/converters/graph.code.converter.ts";
import { describe, expect, it } from "vitest";

describe("sectionNumbers", () => {
    it("gives a route stop its position and every other section the next number after the route", () => {
        const numbers = sectionNumbers(PLANS, STOPS);
        expect(numbers.get("chapter:/p#taught")).toBe("1");
        expect(numbers.get("chapter:/p#narrative")).toBe("2");
    });
});

describe("siteCodes and citationOf", () => {
    it("gives a routed tab its stop's code, every other tab the next free code, and each page a letter", () => {
        const codes = siteCodes([ROUTE, BUILD_TAB], PLANS, STOPS);
        expect([...codes.tabs]).toStrictEqual([
            ["/p", "aa"],
            ["/p/build", "ab"],
        ]);
        expect([...codes.pages]).toStrictEqual([["p", "a"]]);
        const numbers = sectionNumbers(PLANS, STOPS);
        const [narrative, taught] = PLANS;
        expect(taught === undefined ? null : citationOf(taught, numbers, codes)).toBe("aa1");
        expect(narrative === undefined ? null : citationOf(narrative, new Map(), codes)).toBeNull();
    });
});

describe("numbersIn", () => {
    it("reads each numbered node of a relation graph report and skips the rest", () => {
        const report = { graph: { nodes: [{ number: "3", ref: "chapter:/p#a" }, { ref: "chapter:/p#b" }] } };
        expect([...numbersIn(report)]).toStrictEqual([["chapter:/p#a", "3"]]);
        expect(numbersIn(null).size).toBe(0);
    });
});
