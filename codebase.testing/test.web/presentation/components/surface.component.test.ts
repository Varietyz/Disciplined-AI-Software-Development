import {
    COMMAND_MARK,
    SURFACE_CHANGED_CLASS,
    SURFACE_LINE_CLASS,
    SURFACE_RESUMED_CLASS,
    SURFACE_TYPING_CLASS,
} from "@banes-lab/web/configuration/constants/surface.constants.ts";
import { PAUSE_ICON, PLAY_ICON } from "@banes-lab/web/configuration/icons/element.icons.ts";
import { PAUSE_LABEL, PLAY_LABEL } from "@banes-lab/web/configuration/strings/surface.strings.ts";
import { VenuePane, createPlaybackButton } from "@banes-lab/web/presentation/components/surface.component.ts";
import { describe, expect, it, vi } from "vitest";
import { ShellPane } from "@banes-lab/web/presentation/components/shell.component.ts";

const LINE_SELECTOR = `.${SURFACE_LINE_CLASS}`;

const textsOf = function textsOf(element: HTMLElement): readonly (string | null)[] {
    return [...element.querySelectorAll(LINE_SELECTOR)].map((line) => line.textContent);
};

describe("createPlaybackButton", () => {
    it("labels the button by the action it takes, shows its icon, and acts on a click", () => {
        const act = vi.fn<() => void>();
        const paused = createPlaybackButton(true, act);
        expect(paused.getAttribute("aria-label")).toBe(PLAY_LABEL);
        expect(paused.querySelector("i")?.classList.contains(PLAY_ICON)).toBe(true);
        paused.click();
        expect(act).toHaveBeenCalledTimes(1);
        const playing = createPlaybackButton(false, act);
        expect(playing.getAttribute("aria-label")).toBe(PAUSE_LABEL);
        expect(playing.querySelector("i")?.classList.contains(PAUSE_ICON)).toBe(true);
    });
});

describe("ShellPane", () => {
    it("types a command after the prompt, streams output under it, resumes a command and clears", () => {
        const shell = new ShellPane();
        shell.prompt();
        shell.type("npm run");
        expect(shell.element.querySelector(`.${SURFACE_TYPING_CLASS}`)?.textContent).toBe(`${COMMAND_MARK}npm run`);
        shell.typed();
        shell.append("WAITING");
        shell.resume("npm run");
        expect(textsOf(shell.element)).toStrictEqual([`${COMMAND_MARK}npm run`, "WAITING", `${COMMAND_MARK}npm run`]);
        expect(shell.element.querySelector(`.${SURFACE_TYPING_CLASS}`)).toBeNull();
        expect(shell.element.querySelectorAll(`.${SURFACE_RESUMED_CLASS}`)).toHaveLength(1);
        shell.clear();
        expect(textsOf(shell.element)).toStrictEqual([]);
    });
});

describe("VenuePane", () => {
    it("shows the document, types an inserted line in place, marks changed lines and removes a line", () => {
        const venue = new VenuePane("venue.md");
        venue.show(["first", "last"]);
        venue.insert(1, { changed: true, text: "  typed" });
        expect(textsOf(venue.element)).toStrictEqual(["first", "  ", "last"]);
        const [, inserted] = venue.element.querySelectorAll(LINE_SELECTOR);
        expect(inserted?.classList.contains(SURFACE_TYPING_CLASS)).toBe(true);
        expect(inserted?.classList.contains(SURFACE_CHANGED_CLASS)).toBe(true);
        venue.type(1, "  typed", true);
        expect(inserted?.classList.contains(SURFACE_TYPING_CLASS)).toBe(false);
        venue.mark([
            { changed: true, text: "first" },
            { changed: false, text: "  typed" },
        ]);
        expect(
            [...venue.element.querySelectorAll(LINE_SELECTOR)].map((line) =>
                line.classList.contains(SURFACE_CHANGED_CLASS),
            ),
        ).toStrictEqual([true, false, false]);
        venue.remove(1);
        expect(textsOf(venue.element)).toStrictEqual(["first", "last"]);
        expect(venue.element.textContent).toContain("venue.md");
    });
});
