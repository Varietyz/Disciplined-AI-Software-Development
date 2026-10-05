import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ACTIVE_CLASS } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { ANCHOR_PREFIX } from "@banes-lab/web/configuration/constants/document.constants.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { observeSections } from "@banes-lab/web/core/observers/document.observer.ts";

type Callback = (entries: readonly { intersectionRatio: number; isIntersecting: boolean; target: Element }[]) => void;

const FIRST = "first-section";
const SECOND = "second-section";

let callback: Callback = () => {};
const observed: Element[] = [];

class FakeIntersectionObserver {
    public constructor(handler: Callback) {
        callback = handler;
    }

    public observe(element: Element): void {
        observed.push(element);
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

describe("observeSections", () => {
    it("observes every section and marks the link of the most visible one active", () => {
        const sections = [FIRST, SECOND].map((id) => createElement("section", { attributes: { id } }));
        const links = [FIRST, SECOND].map((id) => createElement("a", { attributes: { href: ANCHOR_PREFIX + id } }));
        const dispose = observeSections(sections, links);
        expect(observed).toHaveLength(2);
        callback([
            { intersectionRatio: 0.2, isIntersecting: true, target: sections[0] ?? createElement("div") },
            { intersectionRatio: 0.8, isIntersecting: true, target: sections[1] ?? createElement("div") },
        ]);
        expect(links[0]?.classList.contains(ACTIVE_CLASS)).toBe(false);
        expect(links[1]?.classList.contains(ACTIVE_CLASS)).toBe(true);
        dispose();
        expect(observed).toHaveLength(0);
    });
});
