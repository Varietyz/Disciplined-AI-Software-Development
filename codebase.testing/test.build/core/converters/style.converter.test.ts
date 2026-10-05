import { describe, expect, it } from "vitest";
import { hoistStyles, prioritize, rescope } from "@banes-lab/build-scripts/core/converters/style.converter.ts";

const ROOT_ID = "diagram-7";
const SOURCE = "flowchart LR\n    a --> b";
const MARKUP = [
    `<svg id="${ROOT_ID}" width="100%" style="max-width: 500px;" viewBox="0 0 500 500">`,
    `<style>#${ROOT_ID}{fill:#ccc;}#${ROOT_ID} .marker{stroke:url(#${ROOT_ID}-gradient);}#${ROOT_ID} .a&gt;.b{x:1}</style>`,
    `<linearGradient id="${ROOT_ID}-gradient"></linearGradient><marker id="${ROOT_ID}_pointEnd"></marker>`,
    '<g class="node" style="fill:#f9f;stroke:#333"><rect style=""/><text style="font-family:&quot;JetBrains Mono&quot;">a</text></g>',
    '<line style="stroke: rgba(255, 255, 255, 0.2); stroke-width: 2;"></line><line style="stroke: rgba(255, 255, 255, 0.2); stroke-width: 2;"></line>',
    "<!-- note --></svg>",
].join("");

describe("rescope", () => {
    it("moves the root id selector onto the shared vector class and derived ids onto the shared stem", () => {
        const rescoped = rescope(`#${ROOT_ID}{a}#${ROOT_ID} .x{b}url(#${ROOT_ID}-gradient)#${ROOT_ID}`, ROOT_ID);
        expect(rescoped.css).toBe(
            ".diagram-vector{a}.diagram-vector .x{b}url(#diagram-vector-gradient).diagram-vector",
        );
        expect([...rescoped.derived]).toStrictEqual(["-gradient"]);
    });

    it("leaves a block alone when the vector carries no root id", () => {
        expect(rescope("#ccc{a}", "")).toStrictEqual({ css: "#ccc{a}", derived: new Set() });
    });
});

describe("prioritize", () => {
    it("marks every declaration important once, splitting only outside groups and quotes", () => {
        expect(prioritize("fill:url(a;b); stroke:'x;y' !important;;")).toBe(
            "fill:url(a;b) !important;stroke:'x;y' !important",
        );
    });
});

describe("hoistStyles", () => {
    const hoisted = hoistStyles(new Map([[SOURCE, MARKUP]]));
    const vector = hoisted.vectors.get(SOURCE) ?? "";

    it("strips every style element and attribute from the vector and classes the root", () => {
        expect(vector).not.toContain("<style>");
        expect(vector).not.toContain("style=");
        expect(
            vector.startsWith(
                `<svg id="${ROOT_ID}" width="100%" viewBox="0 0 500 500" class="diagram-vector diagram-style-1">`,
            ),
        ).toBe(true);
        expect(vector).toContain('<g class="node diagram-style-2">');
        expect(vector).toContain("<rect/>");
        expect(vector).toContain('<text class="diagram-style-3">a</text>');
        expect(vector).toContain("<!-- note -->");
    });

    it("renames only the derived ids the block references, so identical blocks share one rule set", () => {
        expect(vector).toContain('<linearGradient id="diagram-vector-gradient">');
        expect(vector).toContain(`<marker id="${ROOT_ID}_pointEnd">`);
    });

    it("shares one class per distinct declaration set", () => {
        expect(vector.split('<line class="diagram-style-4">')).toHaveLength(3);
    });

    it("writes the rescoped blocks once and one important rule per class, entities decoded", () => {
        expect(hoisted.stylesheet).toBe(
            [
                ".diagram-vector{fill:#ccc;}.diagram-vector .marker{stroke:url(#diagram-vector-gradient);}.diagram-vector .a>.b{x:1}",
                ".diagram-style-1{max-width: 500px !important}",
                ".diagram-style-2{fill:#f9f !important;stroke:#333 !important}",
                '.diagram-style-3{font-family:"JetBrains Mono" !important}',
                ".diagram-style-4{stroke: rgba(255, 255, 255, 0.2) !important;stroke-width: 2 !important}",
                "",
            ].join("\n"),
        );
    });

    it("deduplicates identical blocks across vectors", () => {
        const twice = hoistStyles(
            new Map([
                [SOURCE, MARKUP],
                [`${SOURCE}\n    b --> c`, MARKUP],
            ]),
        );
        expect(twice.stylesheet).toBe(hoisted.stylesheet);
    });
});
