import {
    EVIDENCE_IN_BOTH,
    EVIDENCE_IN_NEITHER,
    LEAF_REVERSE_MESSAGES,
    NO_CLOSURE_REPORT,
    linksLine,
    missingBacklink,
    missingGround,
    missingReverse,
    missingUsedBy,
    noLeafReverseMessage,
    unresolvedLink,
} from "@banes-lab/build-scripts/configuration/strings/link.strings.ts";
import { describe, expect, it } from "vitest";
import { LEAF_RELATIONS } from "@banes-lab/web/configuration/constants/graph.constants.ts";

describe("LEAF_REVERSE_MESSAGES", () => {
    it("carries a reverse message for every relation that declares catalog leaf fields", () => {
        expect(LEAF_RELATIONS.filter((relation) => !LEAF_REVERSE_MESSAGES.has(relation.forward))).toStrictEqual([]);
        expect(noLeafReverseMessage("uses")).toContain('"uses" declares catalog leaf fields');
    });
});

describe("linksLine, missingUsedBy and missingReverse", () => {
    it("name the page count, the file and the list each line is about", () => {
        expect(linksLine(3, "tab.generated.ts")).toBe("links: linked the tabs of 3 page(s) into tab.generated.ts\n");
        expect(missingUsedBy("api:x")).toContain('does not list it under "Used by"');
        expect(missingReverse("Requires", "api:x")).toContain('lists api:x under "Requires"');
    });
});

describe("the link findings", () => {
    it("name the link, the target and the list each finding is about", () => {
        expect([NO_CLOSURE_REPORT, EVIDENCE_IN_BOTH, EVIDENCE_IN_NEITHER].every((text) => text.endsWith("."))).toBe(
            true,
        );
        expect(unresolvedLink("Setup", "/pag#gone")).toContain('The link "Setup" points to /pag#gone');
        expect(missingBacklink("api:x")).toContain('does not list it under "Linked from"');
        expect(missingGround("api:x")).toContain('does not list it under "Grounds"');
    });
});
