import { describe, it } from "vitest";
import { runsAbandoned, runsInFlight } from "coordination-surface/tools/core/strings/claim.strings.ts";
import assert from "node:assert/strict";

describe("the run claim messages", () => {
    it("name the runs in flight and whether this run yields, and the runs that stopped without a verdict", () => {
        const inFlight = runsInFlight(true, ["B since 12:00"]);
        assert.ok(inFlight.includes("B since 12:00") && inFlight.includes("1 other run"));
        assert.notEqual(runsInFlight(true, []), runsInFlight(false, []));
        assert.ok(runsAbandoned(["C since 11:00"]).includes("C since 11:00"));
    });
});
