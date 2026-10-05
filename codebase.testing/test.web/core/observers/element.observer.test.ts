import { ANIMATE_ATTRIBUTE, FADE_IN } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { observeAnimations } from "@banes-lab/web/core/observers/element.observer.ts";

const ANIMATED_CLASS = "animated";
const TRIGGER_ATTRIBUTE = "data-animate-trigger";
const LOAD = "load";

const observed: Element[] = [];

class FakeIntersectionObserver {
    public observe(element: Element): void {
        observed.push(element);
    }

    public unobserve(): void {
        observed.length = 0;
    }

    public disconnect(): void {
        observed.length = 0;
    }
}

beforeEach(() => {
    observed.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("observeAnimations", () => {
    it("hands viewport-triggered elements to the intersection observer", () => {
        const target = createElement("div", { attributes: { [ANIMATE_ATTRIBUTE]: FADE_IN } });
        const root = createElement("div", { children: [target] });
        const dispose = observeAnimations(root);
        expect(observed).toContain(target);
        dispose();
    });

    it("animates load-triggered elements immediately", () => {
        const target = createElement("div", {
            attributes: { [ANIMATE_ATTRIBUTE]: FADE_IN, [TRIGGER_ATTRIBUTE]: LOAD },
        });
        const root = createElement("div", { children: [target] });
        const dispose = observeAnimations(root);
        expect(target.classList.contains(ANIMATED_CLASS)).toBe(true);
        expect(observed).not.toContain(target);
        dispose();
    });

    it("returns a disposer that stops observing", () => {
        const root = createElement("div");
        const dispose = observeAnimations(root);
        expect(() => {
            dispose();
        }).not.toThrow();
    });
});
