import { describe, expect, it } from "vitest";
import { renderAnatomy, renderAnatomyIndex } from "@banes-lab/build-scripts/core/formatters/anatomy.formatter.ts";
import { convert } from "../converters/anatomy.fixture.ts";

describe("renderAnatomy", () => {
    it("writes one typed export per snapshot and one map from each tab to its snapshot", () => {
        const snapshot = convert();
        const rendered = renderAnatomy([
            { exportName: "ANATOMY", snapshot, tab: "tree" },
            { exportName: "BUILD_ANATOMY", snapshot, tab: "build" },
        ]);
        expect(rendered.startsWith("import type { AnatomySnapshot }")).toBe(true);
        expect(rendered.includes("export const ANATOMY: AnatomySnapshot")).toBe(true);
        expect(rendered.includes("export const BUILD_ANATOMY: AnatomySnapshot")).toBe(true);
        expect(rendered.includes('["tree", ANATOMY],')).toBe(true);
        expect(rendered.includes('["build", BUILD_ANATOMY],')).toBe(true);
    });
});

describe("renderAnatomyIndex", () => {
    it("writes one typed export whose literal parses back to the index", () => {
        const index = { nodes: { "file-a": "records.x.generated.json" }, sources: {} };
        const source = renderAnatomyIndex(index);
        expect(source.startsWith('import type { AnatomyIndex } from "#types/record.types";')).toBe(true);
        const start = source.indexOf("JSON.parse(") + "JSON.parse(".length;
        const literal: unknown = JSON.parse(source.slice(start, source.lastIndexOf(");")));
        expect(JSON.parse(String(literal))).toStrictEqual(index);
    });
});
