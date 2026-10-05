import { COPIED_CLASS, COPY_FEEDBACK_MS } from "@banes-lab/web/configuration/constants/clipboard.constants.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COPY_REFUSED } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { COPY_TITLE } from "@banes-lab/web/configuration/strings/clipboard.strings.ts";
import { createCopyButton } from "@banes-lab/web/presentation/components/clipboard.component.ts";

const CLASS_NAME = "copy-button";
const PAYLOAD = "copied text";

const stubClipboard = function stubClipboard(writeText: (text: string) => Promise<void>): void {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
};

afterEach(() => {
    vi.useRealTimers();
});

describe("createCopyButton", () => {
    it("builds a titled button carrying the given class", () => {
        const button = createCopyButton(() => PAYLOAD, CLASS_NAME);
        expect(button.className).toBe(CLASS_NAME);
        expect(button.title).toBe(COPY_TITLE);
    });

    it("writes the text to the clipboard and flashes the copied state", async () => {
        vi.useFakeTimers();
        const writeText = vi.fn(async () => {
            await Promise.resolve();
        });
        stubClipboard(writeText);
        const button = createCopyButton(() => PAYLOAD, CLASS_NAME);
        button.click();
        await vi.advanceTimersByTimeAsync(0);
        expect(writeText).toHaveBeenCalledWith(PAYLOAD);
        expect(button.classList.contains(COPIED_CLASS)).toBe(true);
        await vi.advanceTimersByTimeAsync(COPY_FEEDBACK_MS);
        expect(button.classList.contains(COPIED_CLASS)).toBe(false);
    });

    it("reports a refused copy and flashes the failed state", async () => {
        vi.useFakeTimers();
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const refused = new Error("denied");
        stubClipboard(async () => {
            await Promise.resolve();
            throw refused;
        });
        const button = createCopyButton(() => PAYLOAD, CLASS_NAME);
        button.click();
        await vi.advanceTimersByTimeAsync(0);
        expect(logged).toHaveBeenCalledWith(COPY_REFUSED, refused);
        expect(button.classList.contains(COPIED_CLASS)).toBe(false);
        logged.mockRestore();
    });
});
