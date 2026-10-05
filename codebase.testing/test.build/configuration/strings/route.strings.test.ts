import { describe, expect, it } from "vitest";
import { ledgerNotObject, malformedStamps } from "@banes-lab/build-scripts/configuration/strings/route.strings.ts";

describe("the route ledger errors", () => {
    it("quote the text that did not parse and name the malformed paths", () => {
        expect(ledgerNotObject("[1]")).toContain("got [1]");
        expect(malformedStamps(["/a", "/b"])).toContain("malformed stamps for /a, /b");
    });
});
