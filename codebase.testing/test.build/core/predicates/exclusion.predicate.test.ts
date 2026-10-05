import { describe, expect, it } from "vitest";
import { exclusionOf, isPublished } from "@banes-lab/build-scripts/core/predicates/exclusion.predicate.ts";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

describe("exclusionOf", () => {
    it("names the reason a file stays out of a published tree", () => {
        const vendorFile = join(absolutePath("govlab.quality.catalog.data"), "rules.json");
        expect(exclusionOf(vendorFile)).toBe("third-party-rule-text");
        expect(exclusionOf("/member/runtime/backups/nginx.backup.conf")).toBe("backup");
        expect(exclusionOf("/member/cards/home.PNG")).toBe("rendered-media");
        expect(exclusionOf("/member/grammars/tree-sitter.wasm")).toBe("binary");
    });

    it("publishes a file that is not excluded or inherited, and a generated one only where the tree allows it", () => {
        const facts = { generated: false, inherited: false };
        expect(isPublished(facts, false)).toBe(true);
        expect(isPublished({ ...facts, excluded: "backup" }, true)).toBe(false);
        expect(isPublished({ ...facts, inherited: true }, true)).toBe(false);
        expect(isPublished({ ...facts, generated: true }, false)).toBe(false);
        expect(isPublished({ ...facts, generated: true }, true)).toBe(true);
    });

    it("keeps a text file in the tree", () => {
        expect(exclusionOf("/member/core/a.ts")).toBeNull();
        expect(exclusionOf("/member/assets/logo.svg")).toBeNull();
    });
});
