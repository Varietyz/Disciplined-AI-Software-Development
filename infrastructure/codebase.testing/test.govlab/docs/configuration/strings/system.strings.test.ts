import { describe, expect, it } from "vitest";
import {
    securityLabel,
    systemHardening,
    systemRegenerated,
    systemTitle,
    systemUpToDate,
    systemWrote,
    viewTitle,
} from "@govlab/docs/configuration/strings/system.strings.ts";
import { unmatched } from "./strings.fixture.ts";

describe("the system strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [systemTitle("Lab"), "Lab System Architecture"],
                [viewTitle("Lab", "data model"), "Lab data model"],
                [securityLabel("auth", "token"), "auth: token"],
                [systemHardening("out.md", "paren", "detail", 7), "[paren] detail (line 7)"],
                [systemRegenerated("out.md"), "regenerated out.md"],
                [systemUpToDate("out.md"), "out.md up to date"],
                [systemWrote("out.md"), "wrote out.md"],
            ]),
        ).toStrictEqual([]);
    });
});
