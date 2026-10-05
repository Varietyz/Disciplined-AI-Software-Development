import { describe, expect, it } from "vitest";
import { DEFAULT_ROOT_PREFIX } from "@govlab/docs/configuration/constants/document.constants.ts";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import { collidePaths } from "@govlab/docs/core/analyzers/location.analyzer.ts";

describe("collidePaths", () => {
    it("reports distinct sources that route to one path, which a concern no longer separates", () => {
        const registries = { concerns: ["quality", "security"], forms: DOC_FORMS };
        const entries = [
            { concern: "quality", form: "plan", name: "sweep", source: "documentation/a.md" },
            { concern: "quality", form: "plan", name: "sweep", source: "govlab-governance/b.md" },
            { concern: "security", form: "plan", name: "sweep", source: "c.md" },
            { concern: "quality", form: "note", name: "sweep", source: "d.md" },
        ];
        const collisions = collidePaths(entries, registries);
        expect(collisions.map((collision) => collision.path)).toStrictEqual([
            `${DEFAULT_ROOT_PREFIX}plans/sweep.plan.md`,
        ]);
        expect(collisions[0]?.sources.toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            "c.md",
            "documentation/a.md",
            "govlab-governance/b.md",
        ]);
    });
});
