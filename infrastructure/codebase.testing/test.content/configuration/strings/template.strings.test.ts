import { describe, expect, it } from "vitest";
import { unresolvedTemplateRef } from "@banes-lab/content/configuration/strings/template.strings.ts";

describe("unresolvedTemplateRef", () => {
    it("names the line, the kind and the id that resolves to nothing", () => {
        expect(unresolvedTemplateRef(12, "lens", "structural")).toBe(
            'line 12 names the lens "structural", and the ontology holds no lens with that id',
        );
    });
});
