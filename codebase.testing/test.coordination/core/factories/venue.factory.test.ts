import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { raiseRefused } from "coordination-surface/tools/core/strings/venue.strings.ts";
import { venueRefusal } from "coordination-surface/tools/core/factories/venue.factory.ts";

describe("venueRefusal", () => {
    it("refuses a raise with exit code 2, the refusal text and no raised venue", () => {
        assert.deepEqual(venueRefusal("the name is taken"), {
            code: 2,
            message: raiseRefused("the name is taken"),
            raised: null,
        });
        assert.ok(raiseRefused("the name is taken").includes("the name is taken"));
    });
});
