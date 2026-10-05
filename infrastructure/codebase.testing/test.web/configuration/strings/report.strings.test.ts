import {
    missingElement,
    missingRootLink,
    undeclaredTree,
    unpublishedTree,
} from "@banes-lab/web/configuration/strings/report.strings.ts";
import { describe, expect, it } from "vitest";

describe("missingElement", () => {
    it("names the id the page shell lacks", () => {
        expect(missingElement("main")).toContain("the id main");
    });
});

describe("the tree refusals", () => {
    it("name the tree tab each refusal is about", () => {
        expect(missingRootLink("docs")).toContain("docs");
        expect(unpublishedTree("docs")).toContain("docs");
        expect(undeclaredTree("build")).toContain("No anatomy tree is declared with the tab build");
    });
});
