import {
    boundSeats,
    filedEntries,
    hostTermsIn,
    schedulesRows,
} from "@banes-lab/content/core/validators/coordination.validator.ts";
import { describe, expect, it } from "vitest";

const INDEX = [
    "| letter | role | state |",
    "|---|---|---|",
    "| A | a deployment's own seat | INACTIVE |",
    "| SAa | Agent audit | INVOKED |",
].join("\n");

describe("coordination validator", () => {
    it("names every host term a file carries and passes a file that carries none", () => {
        expect(hostTermsIn("run npm run govlab here", ["govlab", "doc-lab"])).toStrictEqual(["govlab"]);
        expect(hostTermsIn("a neutral sentence", ["govlab"])).toStrictEqual([]);
    });

    it("reports a seat letter and keeps the package's own invoked identities", () => {
        expect(boundSeats(INDEX)).toStrictEqual(["A"]);
    });

    it("reports an entry filed below the accumulator's entries banner", () => {
        const header = "### a heading inside the header\n";
        const entries = "═══ ENTRIES ═══\n\n### a-filed-class\n\nbody\n";
        expect(filedEntries(`${header}${entries}`)).toStrictEqual(["a-filed-class"]);
        expect(filedEntries(`${header}═══ ENTRIES ═══\n`)).toStrictEqual([]);
    });

    it("reports an agenda carrying rows and passes the empty schedule", () => {
        expect(schedulesRows('defineSchedule([\n    { ordinal: "1" },\n]);')).toBe(true);
        expect(schedulesRows("readonly ordinal: string;\ndefineSchedule([\n]);")).toBe(false);
    });
});
