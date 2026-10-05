import { describe, expect, it } from "vitest";
import {
    reasonReferencesOf,
    stageReferencesOf,
} from "@banes-lab/build-scripts/core/converters/reason.reference.converter.ts";
import { createGovlabContext } from "@govlab/context";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";

const snapshot = snapshotOf(createGovlabContext());

describe("reasonReferencesOf", () => {
    it("indexes every anchored reasoning record under its kind, with its edge fields as relations and inbound edges as referenced-by", () => {
        const index = reasonReferencesOf(snapshot.reason);
        const [lens] = snapshot.reason.lenses;
        const record = index[`reasoning:${lens?.anchor ?? ""}`];
        expect(record?.kind).toBe("lens");
        expect(record?.summary).toBe(lens?.question ?? null);
        expect(record?.relations.some((relation) => relation.relation === "universal-axis")).toBe(true);
        expect(index[`reasoning:${snapshot.reason.derivationLoop.anchor}`]?.kind).toBe("loop");
        expect(
            Object.values(index).some((held) =>
                held.relations.some((relation) => relation.relation === "referenced-by"),
            ),
        ).toBe(true);
        expect(
            Object.values(index).every((held) => held.relations.every((relation) => relation.edges.length > 0)),
        ).toBe(true);
        expect(Object.values(index).every((held) => held.summary !== null)).toBe(true);
        const loop = index[`reasoning:${snapshot.reason.derivationLoop.anchor}`];
        expect(loop?.relations.find((relation) => relation.relation === "stages")?.edges).toHaveLength(
            snapshot.reason.derivationLoop.stages.length,
        );
    });
});

describe("stageReferencesOf", () => {
    it("indexes one record per loop stage with its axis and contracts", () => {
        const index = stageReferencesOf(snapshot.reason);
        expect(Object.keys(index)).toHaveLength(snapshot.reason.derivationLoop.stages.length);
        expect(index["stage:verify"]?.name).toBe("Verify");
        expect(index["stage:verify"]?.relations.some((relation) => relation.relation === "axis")).toBe(true);
        expect(Object.values(index).every((record) => record.summary !== null)).toBe(true);
    });
});
