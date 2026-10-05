import { describe, expect, it } from "vitest";
import { layoutLearning } from "@banes-lab/web/domain/converters/learning.converter.ts";
import { renderLearning } from "@banes-lab/web/presentation/renderers/learning.renderer.ts";

const MODEL = layoutLearning([
    {
        code: "aa",
        label: "Start",
        owner: "disciplined-methodology",
        stops: [
            { id: "aa1", label: "01 - The loop", path: "/disciplined-methodology", requires: [] },
            { id: "aa2", label: "02 - Who does what", path: "/disciplined-methodology#who", requires: [] },
        ],
    },
    {
        code: "ab",
        label: "Patterns",
        owner: "pag",
        stops: [{ id: "ab3", label: "01 - Instruction patterns", path: "/pag/patterns", requires: ["aa1"] }],
    },
]);

describe("renderLearning", () => {
    it("draws one vector carrying the model's view box", () => {
        const view = renderLearning(MODEL);
        expect(view.vector.tagName.toLowerCase()).toBe("svg");
        expect(view.vector.getAttribute("viewBox")).toBe(`0 0 ${String(MODEL.width)} ${String(MODEL.height)}`);
    });

    it("gives every stop a node and a link to the section it depicts", () => {
        const view = renderLearning(MODEL);
        expect(view.stops).toHaveLength(3);
        for (const stop of view.stops) {
            const link = stop.node.parentElement;
            expect(link?.getAttribute("href")).toBe(stop.path);
        }
    });

    it("paints each block with the gradient of its own page", () => {
        const view = renderLearning(MODEL);
        const fills = [...view.vector.querySelectorAll(".learning-block")].map((block) => block.getAttribute("fill"));
        expect(new Set(fills).size).toBe(2);
        for (const fill of fills) {
            expect(view.vector.querySelector(`#${String(fill).slice("url(#".length, -1)}`)).not.toBeNull();
        }
    });

    it("traces one path the rail shares, so the drawn line follows the read order", () => {
        const view = renderLearning(MODEL);
        const rail = view.vector.querySelector(".learning-rail");
        expect(view.trace.getAttribute("d")).toBe(rail?.getAttribute("d"));
        expect(view.trace.getAttribute("d")?.startsWith("M ")).toBe(true);
    });
});
