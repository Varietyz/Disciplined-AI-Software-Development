import { checkAssets, checkDiagrams } from "@banes-lab/build-scripts/core/validators/asset.validator.ts";
import { describe, expect, it } from "vitest";
import { surfaceLocation } from "@banes-lab/web/core/assets/surface.asset.ts";

const FILE = "json/terms.json";

describe("checkDiagrams", () => {
    it("names each diagram a payload carries that has no rendered vector, and nothing for a payload without one", () => {
        expect(checkDiagrams(FILE, JSON.stringify({ content: { kind: "text", text: "plain" } }))).toStrictEqual([]);
        const payload = JSON.stringify({
            content: [{ kind: "mermaid", text: "flowchart LR\n    never --> rendered" }],
        });
        const [finding] = checkDiagrams(FILE, payload);
        expect(finding?.file).toBe(FILE);
        expect(finding?.message).toContain("no rendered vector");
    });
});

describe("checkAssets", () => {
    it("names each walk and source a payload refers to that the build did not write", () => {
        expect(checkAssets(FILE, JSON.stringify({ content: {} }))).toStrictEqual([]);
        const payload = JSON.stringify({
            content: [
                { kind: "walk", walk: { cells: "walk.none.generated.json", vector: "walk.none.generated.svg" } },
                { kind: "source", source: "source.none.generated.txt" },
            ],
        });
        expect(checkAssets(FILE, payload).map((finding) => finding.message.slice(0, 22))).toStrictEqual([
            "A walk on this route h",
            "A walk on this route h",
            "A source on this route",
        ]);
    });

    it("names a surface figure the build recorded no frames for, by its recording's location", () => {
        const payload = JSON.stringify({ content: [{ figure: "never-recorded", kind: "surface" }] });
        const findings = checkAssets(FILE, payload);
        expect(findings).toHaveLength(1);
        expect(findings[0]?.message).toContain(surfaceLocation("never-recorded"));
    });
});
