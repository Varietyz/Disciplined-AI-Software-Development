import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";
import { renderSnapshot } from "@banes-lab/build-scripts/core/formatters/ontology.formatter.ts";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";

describe("renderSnapshot", () => {
    it("emits a typed data module carrying the snapshot", () => {
        const module = renderSnapshot(snapshotOf(createGovlabContext()));
        expect(module.startsWith('import type { OntologySnapshot } from "#types/ontology.types";')).toBe(true);
        expect(module).toContain("export const ONTOLOGY: OntologySnapshot = JSON.parse(");
    });
});
