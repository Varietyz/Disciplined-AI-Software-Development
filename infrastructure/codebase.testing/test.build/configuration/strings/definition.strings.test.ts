import { describe, expect, it } from "vitest";
import {
    unresolvedCitation,
    unresolvedPanel,
} from "@banes-lab/build-scripts/configuration/strings/definition.strings.ts";

describe("unresolvedPanel and unresolvedCitation", () => {
    it("name the panel or the fragment whose citation resolves to no single definition", () => {
        expect(unresolvedPanel("The loop", "runLoop")).toContain('The panel "The loop" cites runLoop');
        expect(unresolvedCitation("definition-run")).toContain("cites definition-run");
    });
});
