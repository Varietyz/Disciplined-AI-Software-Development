import { COPYRIGHT_PREFIX, COPYRIGHT_SUFFIX } from "@banes-lab/web/configuration/strings/company.strings.ts";
import { describe, expect, it } from "vitest";
import { copyrightText } from "@banes-lab/web/presentation/renderers/site.renderer.ts";
import { mountCopyright } from "@banes-lab/web/presentation/widgets/site.widget.ts";

describe("copyrightText", () => {
    it("names the current year between the copyright prefix and suffix", () => {
        expect(copyrightText()).toBe(COPYRIGHT_PREFIX + String(new Date().getFullYear()) + COPYRIGHT_SUFFIX);
    });
});

describe("mountCopyright", () => {
    it("writes the copyright into its bar and clears it on dispose", () => {
        const bar = document.createElement("footer");
        const dispose = mountCopyright(bar);
        expect(bar.textContent).toBe(copyrightText());
        dispose();
        expect(bar.textContent).toBe("");
    });
});
