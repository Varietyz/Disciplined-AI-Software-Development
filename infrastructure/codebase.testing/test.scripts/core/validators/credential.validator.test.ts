import { credentialBroken, credentialHeld } from "@project/scripts/configuration/strings/credential.strings.ts";
import { describe, expect, it } from "vitest";
import { credentialVerdict } from "@project/scripts/core/validators/credential.validator.ts";

describe("credentialVerdict", () => {
    it("holds with no finding and fails with one row per finding", () => {
        expect(credentialVerdict([], 4)).toStrictEqual({ held: true, text: credentialHeld(4) });
        const verdict = credentialVerdict([{ file: "a.yaml", kind: "address", line: 2 }], 4);
        expect(verdict).toStrictEqual({ held: false, text: credentialBroken(["  a.yaml:2  address"]) });
    });
});
