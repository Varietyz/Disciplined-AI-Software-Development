import { describe, expect, it } from "vitest";
import { repositoryLinkName } from "@banes-lab/web/configuration/strings/folder.strings.ts";

describe("repositoryLinkName", () => {
    it("names the tree the repository link opens", () => {
        expect(repositoryLinkName("GovLab Docs")).toBe("Open this part of GovLab Docs on GitHub");
    });
});
