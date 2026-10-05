import type { Geometry, LearningView, PlacedStop } from "@banes-lab/web/types/learning.types.ts";
import {
    aimOf,
    attachPrerequisites,
    cameraFit,
    framedOf,
    marksOf,
    paceAt,
    pixelsOfLength,
    shortestOf,
    spansOf,
    touchTargetOf,
    widestOf,
} from "@banes-lab/web/presentation/components/learning.fragment.component.ts";
import { describe, expect, it } from "vitest";
import { attachLearningMap } from "@banes-lab/web/presentation/components/learning.component.ts";
import { layoutLearning } from "@banes-lab/web/domain/converters/learning.converter.ts";
import { renderLearning } from "@banes-lab/web/presentation/renderers/learning.renderer.ts";

const MODEL = layoutLearning([
    {
        code: "aa",
        label: "Start",
        owner: "disciplined-methodology",
        stops: [
            { id: "aa1", label: "01 - The loop", path: "/disciplined-methodology", requires: [] },
            { id: "aa2", label: "02 - Who does what", path: "/disciplined-methodology#who", requires: ["aa1"] },
        ],
    },
]);

const GEOMETRY: Geometry = { getPointAtLength: (at) => ({ x: at, y: at }), getTotalLength: () => 100 };

describe("framedOf", () => {
    it("answers with nothing when the vector carries no measurable geometry", () => {
        const view = renderLearning(MODEL);
        expect(framedOf(view)).toBeNull();
    });

    it("answers with nothing for a view whose trace cannot be measured", () => {
        const view: LearningView = {
            stops: [],
            trace: document.createElement("div"),
            vector: document.createElement("div"),
        };
        expect(framedOf(view)).toBeNull();
    });
});

describe("marksOf", () => {
    it("places one mark per stop at the nearest point on the trace", () => {
        const { stops } = renderLearning(MODEL);
        const marks = marksOf(GEOMETRY, stops, GEOMETRY.getTotalLength());
        expect(marks).toHaveLength(stops.length);
        for (const mark of marks) {
            expect(mark.lit).toBe(false);
            expect(mark.at).toBeGreaterThanOrEqual(0);
        }
    });
});

describe("spansOf", () => {
    it("spans each neighboring pair and flags the ones that cross a block", () => {
        const { stops } = renderLearning(MODEL);
        const marks = marksOf(GEOMETRY, stops, GEOMETRY.getTotalLength());
        const spans = spansOf(marks);
        expect(spans).toHaveLength(Math.max(0, marks.length - 1));
        for (const span of spans) {
            expect(span.fast).toBe(false);
        }
    });
});

describe("paceAt", () => {
    it("runs slow inside a block and fast across one", () => {
        expect(paceAt([{ fast: true, from: 0, to: 10 }], 5)).toBeGreaterThan(1);
        expect(paceAt([{ fast: false, from: 0, to: 10 }], 5)).toBe(1);
        expect(paceAt([], 5)).toBe(1);
    });
});

describe("widestOf", () => {
    it("measures the widest stop", () => {
        const { stops } = renderLearning(MODEL);
        expect(widestOf(stops)).toBeGreaterThan(0);
        expect(widestOf([] as readonly PlacedStop[])).toBe(0);
    });
});

describe("the camera fit", () => {
    it("reads a length in rem or px and the touch token from the root", () => {
        expect(pixelsOfLength("1.5rem", 16)).toBe(24);
        expect(pixelsOfLength("30px", 16)).toBe(30);
        expect(pixelsOfLength("", 16)).toBe(0);
        expect(touchTargetOf(document.documentElement)).toBeGreaterThanOrEqual(0);
    });

    it("aims one device pixel past the target, so rounding never lands a stop below it", () => {
        expect(aimOf(24, 2)).toBe(24.5);
        expect(aimOf(24, 0)).toBe(25);
        expect(aimOf(0, 2)).toBe(0);
    });

    it("keeps the desktop zoom where a stop already meets the target, and narrows it on a phone", () => {
        const { stops } = renderLearning(MODEL);
        const shortest = shortestOf(stops);
        const widest = widestOf(stops);
        const phoneWidth = (widest * 2 * 24) / shortest;
        expect(shortest).toBeGreaterThan(0);
        expect(cameraFit(10_000, stops, 24, false).zoom).toBeCloseTo(2.6);
        expect(cameraFit(phoneWidth, stops, 24, false).zoom).toBeCloseTo(2);
        expect(cameraFit(phoneWidth, stops, 0, false)).toStrictEqual({ lift: 3.4, zoom: 2.6 });
    });

    it("caps the zoom-out between laps on a touch screen only", () => {
        const { stops } = renderLearning(MODEL);
        const phoneWidth = (widestOf(stops) * 2 * 24) / shortestOf(stops);
        expect(cameraFit(phoneWidth, stops, 24, true).lift).toBeCloseTo(1);
        expect(cameraFit(phoneWidth, stops, 24, false).lift).toBeCloseTo(3.4);
        expect(cameraFit(10_000, stops, 24, true).lift).toBeCloseTo(3.4);
    });
});

describe("attachPrerequisites", () => {
    it("lights the stops a hovered stop requires, and clears them when the pointer leaves", () => {
        const view = renderLearning(MODEL);
        const [first, second] = view.stops;
        const target = second?.node.parentElement;
        const dispose = attachPrerequisites(view);
        target?.dispatchEvent(new Event("mouseenter"));
        expect(first?.node.classList.contains("required")).toBe(true);
        expect(second?.node.classList.contains("focused")).toBe(true);
        target?.dispatchEvent(new Event("mouseleave"));
        expect(first?.node.classList.contains("required")).toBe(false);
        dispose();
    });

    it("lights nothing for a stop that requires nothing", () => {
        const view = renderLearning(MODEL);
        const [first, second] = view.stops;
        const dispose = attachPrerequisites(view);
        first?.node.parentElement?.dispatchEvent(new Event("focusin"));
        expect(second?.node.classList.contains("required")).toBe(false);
        dispose();
        expect(first?.node.classList.contains("focused")).toBe(false);
    });
});

describe("attachLearningMap", () => {
    it("disposes without animating when the vector cannot be measured", () => {
        const view = renderLearning(MODEL);
        const dispose = attachLearningMap(document.createElement("div"), view);
        expect(() => {
            dispose();
        }).not.toThrow();
    });
});
