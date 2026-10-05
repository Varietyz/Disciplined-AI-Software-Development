import { SCROLL_UNREADABLE, SCROLL_UNWRITABLE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readScroll, writeScroll } from "@banes-lab/web/core/stores/route.store.ts";

const PATH = "/faq";

afterEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
});

describe("readScroll and writeScroll", () => {
    it("keeps one rounded position per path", () => {
        expect(writeScroll(PATH, 420.6)).toBe(true);
        expect(readScroll(PATH)).toBe(421);
        expect(readScroll("/terms")).toBeNull();
    });

    it("answers nothing for the top of the page", () => {
        writeScroll(PATH, 0);
        expect(readScroll(PATH)).toBeNull();
    });

    it("reports and degrades to nothing when storage refuses", () => {
        const refused = new Error(PATH);
        const logged = vi.spyOn(console, "error").mockReturnValue();
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw refused;
        });
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw refused;
        });
        expect(writeScroll(PATH, 10)).toBe(false);
        expect(readScroll(PATH)).toBeNull();
        expect(logged).toHaveBeenCalledWith(SCROLL_UNWRITABLE, refused);
        expect(logged).toHaveBeenCalledWith(SCROLL_UNREADABLE, refused);
    });
});
