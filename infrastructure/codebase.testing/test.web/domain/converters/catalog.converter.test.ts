import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { catalogSections } from "@banes-lab/web/domain/converters/catalog.converter.ts";

describe("catalogSections", () => {
    it("renders the reasoning catalogs after the spine", () => {
        expect(catalogSections(ONTOLOGY.reason, ONTOLOGY.resolution).length).toBeGreaterThan(12);
    });
});
