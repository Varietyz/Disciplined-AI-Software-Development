import { accessLine, accessTotal, failureLine } from "@govlab/quality/configuration/strings/invocation.strings.ts";
import { describe, expect, it } from "vitest";

const CONVERTED = 4;
const TOTAL = 9;

describe("invocation strings", () => {
    it("name the project and the count of converted accesses", () => {
        expect(accessLine("tsconfig.json", CONVERTED)).toContain("tsconfig.json — 4 converted");
        expect(accessTotal(TOTAL)).toContain("9 index-signature accesses");
    });

    it("pair a failure's label with its detail on one line", () => {
        expect(failureLine("lint", "exit 1")).toBe("lint: exit 1\n");
    });
});
