import {
    ESCAPE_KEY,
    OVERLAY_CLOSE_MS,
    SCROLL_LOCK_CLASS,
} from "@banes-lab/web/configuration/constants/overlay.constants.ts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OVERLAY_REQUESTED } from "@banes-lab/web/core/ids/overlay.ids.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { emitEvent } from "@banes-lab/web/core/buses/base.bus.ts";
import { mountOverlay } from "@banes-lab/web/presentation/widgets/overlay.widget.ts";

const OVERLAY_CLASS = "overlay";
const TITLE = "Full code";
const BODY = "READ a";

const overlays = function overlays(): number {
    return document.body.querySelectorAll(`.${OVERLAY_CLASS}`).length;
};

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
    document.body.className = "";
});

describe("mountOverlay", () => {
    it("opens a dialog with the requested content and locks scrolling", () => {
        const dispose = mountOverlay();
        emitEvent({ content: createElement("code", { text: BODY }), name: OVERLAY_REQUESTED, title: TITLE });
        expect(overlays()).toBe(1);
        expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(true);
        expect(document.body.textContent.includes(TITLE)).toBe(true);
        dispose();
    });

    it("closes on escape and removes the dialog after the transition", async () => {
        const dispose = mountOverlay();
        emitEvent({ content: createElement("code", { text: BODY }), name: OVERLAY_REQUESTED, title: TITLE });
        document.dispatchEvent(new KeyboardEvent("keydown", { key: ESCAPE_KEY }));
        await vi.advanceTimersByTimeAsync(OVERLAY_CLOSE_MS);
        expect(overlays()).toBe(0);
        expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(false);
        dispose();
    });

    it("stops reacting once disposed", () => {
        mountOverlay()();
        emitEvent({ content: createElement("code", { text: BODY }), name: OVERLAY_REQUESTED, title: TITLE });
        expect(overlays()).toBe(0);
    });
});
