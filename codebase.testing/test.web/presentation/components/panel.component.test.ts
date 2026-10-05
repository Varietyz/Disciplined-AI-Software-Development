import {
    ORIGIN_VIEW,
    boundedView,
    centerOf,
    contentExtentOf,
    distanceBetween,
    extentOf,
    fittedView,
    midpointOf,
    zoomedView,
} from "@banes-lab/web/core/analyzers/panel.analyzer.ts";
import {
    PANEL_ARMED_CLASS,
    PANEL_ARM_MS,
    PANEL_DRAGGING_CLASS,
    PANEL_MAX_SCALE,
    PANEL_MIN_SCALE,
    PANEL_REVEAL_EVENT,
    PANEL_REVEAL_MARGIN_PX,
    PANEL_SCALE_PROPERTY,
    PANEL_X_PROPERTY,
    PANEL_Y_PROPERTY,
    PANEL_ZOOM_STEP,
} from "@banes-lab/web/configuration/constants/panel.constants.ts";
import { RESET_VIEW_TITLE, ZOOM_IN_TITLE, ZOOM_OUT_TITLE } from "@banes-lab/web/configuration/strings/panel.strings.ts";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { PanelHandle } from "@banes-lab/web/types/panel.types.ts";
import { PanelState } from "@banes-lab/web/presentation/components/stage.component.ts";
import { createPanel } from "@banes-lab/web/presentation/components/panel.component.ts";
import { declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { observeArming } from "@banes-lab/web/core/observers/panel.observer.ts";

const VIEWPORT = { height: 100, width: 200 };
const CONTENT = { height: 400, width: 600 };
const CLASS_NAME = "sample-panel";

const rectOf = function rectOf(width: number, height: number): DOMRect {
    return { bottom: height, height, left: 0, right: width, toJSON: () => ({}), top: 0, width, x: 0, y: 0 };
};

const sized = function sized(mode: "fill" | "fit" | "origin", content = CONTENT): PanelHandle {
    const inner = document.createElement("div");
    const panel = createPanel(inner, CLASS_NAME, mode);
    const zoom = panel.element.querySelector<HTMLElement>(".panel-zoom");
    if (zoom === null) {
        throw new Error("The panel has no zoom layer.");
    }
    panel.element.getBoundingClientRect = () => rectOf(VIEWPORT.width, VIEWPORT.height);
    zoom.getBoundingClientRect = () => rectOf(content.width * panel.view().scale, content.height * panel.view().scale);
    return panel;
};

const pointer = function pointer(type: string, id: number, x: number, y: number, pointerType = "touch"): MouseEvent {
    const event = new MouseEvent(type, { bubbles: true, button: 0, clientX: x, clientY: y });
    Object.defineProperty(event, "pointerId", { value: id });
    Object.defineProperty(event, "pointerType", { value: pointerType });
    return event;
};

const wheel = function wheel(deltaX: number, deltaY: number, ctrlKey = false): WheelEvent {
    return new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        clientX: 0,
        clientY: 0,
        ctrlKey,
        deltaX,
        deltaY,
    });
};

const control = function control(panel: PanelHandle, title: string): HTMLButtonElement {
    const button = panel.element.querySelector<HTMLButtonElement>(`button[title="${title}"]`);
    if (button === null) {
        throw new Error(`No control titled ${title}.`);
    }
    return button;
};

const armed = function armed(panel: PanelHandle): PanelHandle {
    vi.useFakeTimers();
    panel.element.dispatchEvent(new Event("pointerenter"));
    vi.advanceTimersByTime(PANEL_ARM_MS);
    return panel;
};

beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "setPointerCapture", { configurable: true, value: () => {} });
});

afterEach(() => {
    vi.useRealTimers();
});

describe("the panel view math", () => {
    it("bounds a view inside the viewport, zooms around an anchor, fits and centers, and measures pointer pairs", () => {
        expect(boundedView({ scale: 1, x: -900, y: 50 }, VIEWPORT, CONTENT)).toStrictEqual({ scale: 1, x: -400, y: 0 });
        expect(zoomedView(ORIGIN_VIEW, 2, { x: 100, y: 50 })).toStrictEqual({ scale: 2, x: -100, y: -50 });
        expect(fittedView(VIEWPORT, { height: 0, width: 0 })).toStrictEqual(ORIGIN_VIEW);
        expect(centerOf(VIEWPORT)).toStrictEqual({ x: 100, y: 50 });
        expect(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
        expect(midpointOf({ x: 0, y: 0 }, { x: 4, y: 2 })).toStrictEqual({ x: 2, y: 1 });
        const element = document.createElement("div");
        element.getBoundingClientRect = () => rectOf(300, 150);
        expect(extentOf(element)).toStrictEqual({ height: 150, width: 300 });
        expect(contentExtentOf(element, 3)).toStrictEqual({ height: 50, width: 100 });
    });
});

describe("createPanel", () => {
    it("wraps the content in a stage, carries the class and starts at the origin with the view written as custom properties", () => {
        const panel = sized("origin");
        const stage = panel.element.querySelector<HTMLElement>(".panel-stage");
        expect(panel.element.classList.contains(CLASS_NAME)).toBe(true);
        expect(stage?.firstElementChild?.tagName).toBe("DIV");
        expect(panel.view()).toStrictEqual({ scale: 1, x: 0, y: 0 });
        const staged = stage ?? panel.element;
        expect(declaredStyle(staged, PANEL_X_PROPERTY)).toBe("0px");
        expect(declaredStyle(staged, PANEL_Y_PROPERTY)).toBe("0px");
        expect(declaredStyle(staged, PANEL_SCALE_PROPERTY)).toBe("1");
    });

    it("pans by the pointer's travel, never past the content's edge, and marks the drag while a pointer is down", () => {
        const panel = sized("origin");
        panel.element.dispatchEvent(pointer("pointerdown", 1, 50, 50));
        expect(panel.element.classList.contains(PANEL_DRAGGING_CLASS)).toBe(true);
        panel.element.dispatchEvent(pointer("pointermove", 1, 20, 10));
        expect(panel.view()).toStrictEqual({ scale: 1, x: -30, y: -40 });
        panel.element.dispatchEvent(pointer("pointermove", 1, -1000, -1000));
        expect(panel.view()).toStrictEqual({
            scale: 1,
            x: VIEWPORT.width - CONTENT.width,
            y: VIEWPORT.height - CONTENT.height,
        });
        panel.element.dispatchEvent(pointer("pointerup", 1, -1000, -1000));
        expect(panel.element.classList.contains(PANEL_DRAGGING_CLASS)).toBe(false);
    });

    it("keeps content smaller than the viewport inside it", () => {
        const panel = sized("origin", { height: 20, width: 50 });
        panel.element.dispatchEvent(pointer("pointerdown", 1, 0, 0));
        panel.element.dispatchEvent(pointer("pointermove", 1, 500, 500));
        expect(panel.view()).toStrictEqual({ scale: 1, x: VIEWPORT.width - 50, y: VIEWPORT.height - 20 });
    });

    it("ignores the wheel and a mouse drag until the pointer has rested on it, and disarms on leave", () => {
        vi.useFakeTimers();
        const panel = sized("origin");
        const early = wheel(0, 30);
        panel.element.dispatchEvent(new Event("pointerenter"));
        vi.advanceTimersByTime(PANEL_ARM_MS - 1);
        panel.element.dispatchEvent(early);
        expect(early.defaultPrevented).toBe(false);
        expect(panel.view().y).toBe(0);
        vi.advanceTimersByTime(1);
        expect(panel.element.classList.contains(PANEL_ARMED_CLASS)).toBe(true);
        panel.element.dispatchEvent(wheel(0, 30));
        expect(panel.view().y).toBe(-30);
        panel.element.dispatchEvent(new Event("pointerleave"));
        expect(panel.element.classList.contains(PANEL_ARMED_CLASS)).toBe(false);
        panel.element.dispatchEvent(pointer("pointerdown", 1, 0, 0, "mouse"));
        expect(panel.element.classList.contains(PANEL_DRAGGING_CLASS)).toBe(false);
        const plain = document.createElement("div");
        const isArmed = observeArming(plain);
        plain.dispatchEvent(new Event("pointerenter"));
        vi.advanceTimersByTime(PANEL_ARM_MS);
        expect(isArmed()).toBe(true);
    });

    it("zooms around the anchor with the controls and the wheel, within the scale bounds", () => {
        const panel = armed(sized("origin"));
        control(panel, ZOOM_IN_TITLE).click();
        expect(panel.view().scale).toBeCloseTo(PANEL_ZOOM_STEP);
        control(panel, ZOOM_OUT_TITLE).click();
        expect(panel.view().scale).toBeCloseTo(1);
        for (let i = 0; i < 20; i += 1) {
            control(panel, ZOOM_OUT_TITLE).click();
        }
        expect(panel.view().scale).toBe(PANEL_MIN_SCALE);
        for (let i = 0; i < 40; i += 1) {
            panel.element.dispatchEvent(wheel(0, -1000, true));
        }
        expect(panel.view().scale).toBe(PANEL_MAX_SCALE);
        control(panel, RESET_VIEW_TITLE).click();
        expect(panel.view()).toStrictEqual({ scale: 1, x: 0, y: 0 });
    });

    it("scrolls the view with a plain wheel and keeps the wheel contained at the edge", () => {
        const panel = armed(sized("origin"));
        const inside = wheel(0, 30);
        panel.element.dispatchEvent(inside);
        expect(inside.defaultPrevented).toBe(true);
        expect(panel.view().y).toBe(-30);
        const past = wheel(0, 10_000);
        panel.element.dispatchEvent(past);
        expect(panel.view().y).toBe(VIEWPORT.height - CONTENT.height);
        const beyond = wheel(0, 10);
        panel.element.dispatchEvent(beyond);
        expect(beyond.defaultPrevented).toBe(true);
        expect(panel.view().y).toBe(VIEWPORT.height - CONTENT.height);
    });

    it("pinches with two pointers, scaling by the change in their distance", () => {
        const panel = sized("origin");
        panel.element.dispatchEvent(pointer("pointerdown", 1, 0, 0));
        panel.element.dispatchEvent(pointer("pointerdown", 2, 10, 0));
        panel.element.dispatchEvent(pointer("pointermove", 2, 20, 0));
        expect(panel.view().scale).toBeCloseTo(2);
        panel.element.dispatchEvent(pointer("pointerup", 2, 20, 0));
        panel.element.dispatchEvent(pointer("pointerup", 1, 0, 0));
        expect(panel.element.classList.contains(PANEL_DRAGGING_CLASS)).toBe(false);
    });

    it("fits and centers the content on reset in fit mode, never enlarging past its natural size", () => {
        const large = sized("fit");
        large.reset();
        expect(large.view().scale).toBeCloseTo(VIEWPORT.height / CONTENT.height);
        expect(large.view().x).toBeCloseTo((VIEWPORT.width - CONTENT.width * large.view().scale) / 2);
        expect(large.view().y).toBeCloseTo(0);
        const small = sized("fit", { height: 20, width: 50 });
        small.reset();
        expect(small.view()).toStrictEqual({ scale: 1, x: (VIEWPORT.width - 50) / 2, y: (VIEWPORT.height - 20) / 2 });
    });

    it("enlarges small content up to the viewport in fill mode, and pans to a revealed offset", () => {
        const panel = sized("fill", { height: 20, width: 50 });
        panel.reset();
        expect(panel.view().scale).toBeCloseTo(PANEL_MAX_SCALE);
        const state = new PanelState(document.createElement("div"), document.createElement("div"), "origin");
        state.reveal(50);
        expect(state.view.y).toBe(0);
        const tall = sized("origin");
        tall.element.dispatchEvent(new CustomEvent(PANEL_REVEAL_EVENT, { detail: 200 }));
        expect(tall.view().y).toBe(PANEL_REVEAL_MARGIN_PX - 200);
    });
});
