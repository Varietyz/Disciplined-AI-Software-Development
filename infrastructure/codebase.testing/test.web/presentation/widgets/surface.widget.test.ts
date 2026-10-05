import { PAUSE_LABEL, PLAY_LABEL } from "@banes-lab/web/configuration/strings/surface.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SURFACE_LINE_CLASS } from "@banes-lab/web/configuration/constants/surface.constants.ts";
import { SurfacePlayer } from "@banes-lab/web/presentation/widgets/surface.widget.ts";
import type { SurfaceRecording } from "@banes-lab/web/types/surface.types.ts";

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

const RECORDING: SurfaceRecording = {
    figure: "venue",
    frames: [
        {
            command: "npm run await -- --post",
            lines: [
                { changed: false, text: "roster" },
                { changed: true, text: "  a position" },
            ],
            output: "POSTED\n",
            surface: "venue.md",
        },
    ],
    inputs: "digest",
    opening: ["roster"],
};

const parts = function parts(): { controls: HTMLElement; figure: HTMLElement; stage: HTMLElement } {
    return {
        controls: document.createElement("div"),
        figure: document.createElement("figure"),
        stage: document.createElement("div"),
    };
};

const venueTexts = function venueTexts(stage: HTMLElement): readonly (string | null)[] {
    return [...(stage.lastElementChild?.querySelectorAll(`.${SURFACE_LINE_CLASS}`) ?? [])].map(
        (line) => line.textContent,
    );
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("SurfacePlayer", () => {
    it("builds the command and venue panes, plays while visible, and pauses and resumes on its button", () => {
        const requested = vi.fn(() => 1);
        vi.stubGlobal("IntersectionObserver", FakeObserver);
        vi.stubGlobal("requestAnimationFrame", requested);
        vi.stubGlobal("cancelAnimationFrame", vi.fn());
        const held = parts();
        const dispose = new SurfacePlayer(held, RECORDING).start();
        expect(held.stage.children).toHaveLength(2);
        expect(venueTexts(held.stage)).toStrictEqual(["roster"]);
        expect(requested).toHaveBeenCalledTimes(1);
        const button = held.controls.querySelector("button");
        expect(button?.getAttribute("aria-label")).toBe(PAUSE_LABEL);
        button?.click();
        expect(held.controls.querySelector("button")?.getAttribute("aria-label")).toBe(PLAY_LABEL);
        dispose();
    });

    it("shows the end state and waits for Play when the reader asked for reduced motion", () => {
        const requested = vi.fn(() => 1);
        vi.stubGlobal("IntersectionObserver", FakeObserver);
        vi.stubGlobal("requestAnimationFrame", requested);
        vi.stubGlobal("cancelAnimationFrame", vi.fn());
        vi.stubGlobal("matchMedia", () => ({ matches: true }));
        const held = parts();
        new SurfacePlayer(held, RECORDING).start();
        expect(venueTexts(held.stage)).toStrictEqual(["roster", "  a position"]);
        expect(requested).not.toHaveBeenCalled();
        expect(held.controls.querySelector("button")?.getAttribute("aria-label")).toBe(PLAY_LABEL);
    });
});
