import { describe, expect, it } from "vitest";
import {
    renderReferenceFace,
    renderReferenceLoader,
} from "@banes-lab/build-scripts/core/formatters/reference.formatter.ts";
import { createGovlabContext } from "@govlab/context";
import { referencesOf } from "@banes-lab/build-scripts/core/converters/reference.converter.ts";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";

const faces = referencesOf(snapshotOf(createGovlabContext()));

describe("renderReferenceFace", () => {
    it("emits a typed data module whose one export parses back to the index", () => {
        const index = faces.get("layer") ?? {};
        const source = renderReferenceFace(index);
        expect(source.startsWith('import type { ReferenceIndex } from "#types/reference.types";')).toBe(true);
        const start = source.indexOf("JSON.parse(") + "JSON.parse(".length;
        const end = source.lastIndexOf(");");
        const literal: unknown = JSON.parse(source.slice(start, end));
        const parsed: unknown = JSON.parse(String(literal));
        expect(parsed).toStrictEqual(index);
    });
});

describe("renderReferenceLoader", () => {
    it("emits one lazy import per collection behind a single loader", () => {
        const source = renderReferenceLoader([...faces.keys()]);
        for (const face of faces.keys()) {
            expect(source).toContain(`import("#core/generated/reference.${face}.generated")`);
        }
        expect(source).toContain("export const loadReferences");
    });
});
