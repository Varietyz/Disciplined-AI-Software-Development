import { describe, expect, it } from "vitest";
import {
    listeningAfter,
    neverListened,
    portHeld,
    portStillHeld,
} from "@project/scripts/configuration/strings/route.strings.ts";

describe("the route capture's lines", () => {
    it("name the port, the holders and the wait they report", () => {
        expect(neverListened(9)).toContain("never listened on port 9");
        expect(listeningAfter(120)).toContain("after 120 ms");
        expect(portStillHeld(9)).toContain("port 9 is still held");
        expect(portHeld(9, ["1", "2"])).toContain("held by pid 1, 2");
    });
});
