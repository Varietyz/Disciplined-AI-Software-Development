import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";
import { groupReferencesOf } from "@banes-lab/build-scripts/core/converters/ontology.reference.converter.ts";
import { groupTitleOf } from "@banes-lab/web/strings/catalog.strings";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";

const snapshot = snapshotOf(createGovlabContext());

describe("groupReferencesOf", () => {
    it("indexes the categories, domains, forces, kinds and relation ranges as records that list their members", () => {
        const faces = groupReferencesOf(snapshot);
        const [group] = snapshot.principles;
        if (group === undefined) {
            throw new Error("no principle groups");
        }
        const members = group.principles.length;
        const category = faces.get("architecture-category")?.[`architecture-category:${group.id}`];
        expect(category?.name).toBe(groupTitleOf(group.id, group.category));
        expect(category?.relations[0]?.edges).toHaveLength(members);
        expect(category?.summary).toContain(`holds ${String(members)} architecture`);
        expect(faces.get("relation")?.["relation:conflicts_with"]?.name).toBe("Conflicts with");
        expect(
            [...faces.values()].every((held) => Object.values(held).every((record) => record.summary !== null)),
        ).toBe(true);
        expect(Object.keys(faces.get("force") ?? {})).toHaveLength(snapshot.forces.length);
        expect(Object.keys(faces.get("kind") ?? {})).toHaveLength(snapshot.kinds.length);
        expect(
            Object.values(faces.get("relation") ?? {}).every((held) =>
                held.relations.every((relation) => relation.edges.length > 0),
            ),
        ).toBe(true);
    });
});
