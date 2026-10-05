import {
    DIAGRAM_WALK_ATTRIBUTE,
    DIAGRAM_WALK_SEPARATOR,
    DIAGRAM_WALK_STEP_MS,
} from "@banes-lab/web/configuration/constants/diagram.constants.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { attachDiagramWalk } from "@banes-lab/web/presentation/components/diagram.component.ts";
const SVG_NS = "http://www.w3.org/2000/svg";

type Intersection = (entries: readonly { readonly isIntersecting: boolean }[]) => void;

class FakeObserver {
    private readonly callback: Intersection;

    public constructor(callback: Intersection) {
        this.callback = callback;
    }

    public disconnect(): void {
        this.callback([]);
    }

    public observe(): void {
        this.callback([{ isIntersecting: true }]);
    }
}

const canvasWith = function canvasWith(): Element {
    const canvas = document.createElement("div");
    const vector = document.createElementNS(SVG_NS, "svg");
    for (const [id, className] of [
        ["d-flowchart-a-0", "node"],
        ["d-flowchart-b-1", "node"],
        ["L_a_b_0", "flowchart-link"],
    ]) {
        const part = document.createElementNS(SVG_NS, "g");
        part.setAttribute("id", id ?? "");
        part.setAttribute("class", className ?? "");
        vector.append(part);
    }
    vector.setAttribute(
        DIAGRAM_WALK_ATTRIBUTE,
        ["d-flowchart-a-0", "L_a_b_0", "d-flowchart-b-1"].join(DIAGRAM_WALK_SEPARATOR),
    );
    canvas.append(vector);
    return canvas;
};

describe("attachDiagramWalk", () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("lights the diagram's parts one step at a time along its edges and clears them on dispose", () => {
        vi.useFakeTimers();
        vi.stubGlobal("IntersectionObserver", FakeObserver);
        const canvas = canvasWith();
        const dispose = attachDiagramWalk(canvas);
        expect(canvas.classList.contains("diagram-walking")).toBe(true);
        expect(canvas.querySelector("#d-flowchart-a-0")?.classList.contains("walked")).toBe(true);
        expect(canvas.querySelector("#L_a_b_0")?.classList.contains("walked")).toBe(false);
        vi.advanceTimersByTime(DIAGRAM_WALK_STEP_MS);
        expect(canvas.querySelector("#L_a_b_0")?.classList.contains("walked")).toBe(true);
        dispose();
        expect(canvas.querySelectorAll(".walked")).toHaveLength(0);
        expect(canvas.classList.contains("diagram-walking")).toBe(false);
    });

    it("leaves a diagram with nothing to walk untouched", () => {
        const canvas = document.createElement("div");
        attachDiagramWalk(canvas)();
        expect(canvas.classList.contains("diagram-walking")).toBe(false);
    });

    it("stays still for a reader who asked for reduced motion", () => {
        vi.stubGlobal("matchMedia", () => ({ matches: true }));
        const canvas = canvasWith();
        attachDiagramWalk(canvas);
        expect(canvas.classList.contains("diagram-walking")).toBe(false);
    });
});
