import { describe, expect, it } from "vitest";
import { genericLink, namelessLink } from "@banes-lab/build-scripts/configuration/strings/element.strings.ts";

describe("namelessLink and genericLink", () => {
    it("name the link's target and, for a generic one, the text it reads", () => {
        expect(namelessLink("/terms")).toContain("A link to /terms has no discernible name");
        expect(genericLink("/terms", "Read more")).toContain('The link to /terms reads "Read more"');
    });
});
