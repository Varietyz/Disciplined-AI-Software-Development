import { describe, expect, it } from "vitest";
import { JURISDICTION } from "@ssot/govlab/shared/registries/taxonomy.registry.ts";
import { relativePath } from "@ssot/paths";

describe("JURISDICTION", () => {
    it("holds every declared and imported root, longest first, each with its containers and vocabulary", () => {
        const { containers, roots, vocabularies } = JURISDICTION;
        expect(roots).toContain(relativePath("govlab.pipeline"));
        expect(roots.some((root) => root.startsWith(relativePath("app.coordination")))).toBe(true);
        expect(roots.every((root, at) => at === 0 || (roots[at - 1]?.length ?? 0) >= root.length)).toBe(true);
        expect(roots.every((root) => containers.has(root) && vocabularies.has(root))).toBe(true);
        expect(vocabularies.get(relativePath("govlab.pipeline"))).toBe(JURISDICTION.host);
    });
});
