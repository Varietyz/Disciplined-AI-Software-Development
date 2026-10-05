import { describe, expect, it } from "vitest";
import { esTokenYear, findStaleEsTokens } from "@govlab/quality/core/matchers/target.matcher.ts";

const ENFORCED_YEAR = 2025;

const TSCONFIG = `{
    // frontend package
    "compilerOptions": {
        "target": "ES2021",
        "module": "NodeNext",
        "lib": ["ES2021", "DOM", "DOM.Iterable"]
    }
}
`;

describe("esTokenYear", () => {
    it("reads a year token, an edition number and ESNext, and refuses anything else", () => {
        expect(esTokenYear("ES2021")).toBe(2021);
        expect(esTokenYear("ES6")).toBe(2015);
        expect(esTokenYear("ESNext")).toBe(Number.POSITIVE_INFINITY);
        expect(esTokenYear("DOM")).toBeNull();
        expect(esTokenYear("ES20x1")).toBeNull();
    });
});

describe("findStaleEsTokens", () => {
    it("flags target + lib below the enforced revision, ignoring DOM and non-ES strings", () => {
        const stale = findStaleEsTokens(TSCONFIG, ENFORCED_YEAR);
        expect(stale.map((s) => s.token)).toEqual(["ES2021", "ES2021"]);
    });

    it("treats ESNext and the enforced revision itself as not stale", () => {
        const text = `{ "target": "ESNext", "lib": ["ESNext", "DOM"] }`;
        expect(findStaleEsTokens(text, ENFORCED_YEAR)).toHaveLength(0);
    });

    it("normalizes edition shorthands (ES6 === ES2015) as stale", () => {
        expect(findStaleEsTokens(`{ "target": "ES6" }`, ENFORCED_YEAR).map((s) => s.token)).toEqual(["ES6"]);
    });
});
