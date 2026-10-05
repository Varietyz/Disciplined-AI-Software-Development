import { absolutePath, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { diagramDigest, diagramFileName } from "@banes-lab/build-scripts/core/resolvers/diagram.resolver.ts";
import { DIAGRAM_ROOT } from "@banes-lab/web/core/assets/diagram.assets.ts";

const ABC_DIGEST = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
const SLASH = "/";

describe("diagramDigest and diagramFileName", () => {
    it("names a vector by the standard digest of its source, marked as generated", () => {
        expect(diagramDigest("abc")).toBe(ABC_DIGEST);
        expect(diagramFileName("abc")).toBe(`diagram.${ABC_DIGEST}.generated.svg`);
    });

    it("writes the vectors where the site serves them", () => {
        const served = SLASH + relativePath("app.diagrams").slice(relativePath("app.public").length + 1) + SLASH;
        expect(served).toBe(DIAGRAM_ROOT);
        expect(absolutePath("app.diagrams").startsWith(absolutePath("app.public"))).toBe(true);
    });
});
