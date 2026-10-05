import { describe, expect, it } from "vitest";
import {
    findingHeading,
    findingLine,
    reportWritten,
    routeHeading,
    summaryLine,
    unknownRoute,
} from "@project/scripts/configuration/strings/viewport.strings.ts";

describe("the viewport's lines", () => {
    it("name the route, the finding and the report they describe", () => {
        expect(routeHeading("/pag", 390)).toBe("\n/pag (390px wide)\n");
        expect(findingHeading("Text under the legible size", 2)).toBe("  Text under the legible size: 2\n");
        expect(findingLine("span 11px")).toBe("    span 11px\n");
        expect(unknownRoute("/nope")).toBe("viewport: /nope is not a built route.\n");
        expect(reportWritten("r.json", 3)).toBe("viewport: wrote r.json (3 routes)\n");
    });

    it("sum up the run by how many routes have a finding", () => {
        expect(summaryLine(0, 3)).toBe("viewport: 3 routes, none with a finding\n");
        expect(summaryLine(1, 3)).toBe("viewport: 1 of 3 routes have a finding\n");
    });
});
