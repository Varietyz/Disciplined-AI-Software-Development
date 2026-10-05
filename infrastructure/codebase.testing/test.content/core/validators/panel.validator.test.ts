import {
    PANEL_CITE_UNKNOWN,
    PANEL_TAG_SEPARATED,
    PANEL_TAG_TOO_LONG,
    PANEL_TAG_TWICE,
    PANEL_UNCITED,
    PANEL_UNTAGGED,
} from "@banes-lab/content/configuration/strings/panel.strings.ts";
import { describe, expect, it } from "vitest";
import { panelCount, validatePanels } from "@banes-lab/content/core/validators/panel.validator.ts";
import type { PanelSection } from "@banes-lab/content/types/panel.types.ts";
import { readPanelSections } from "@banes-lab/content/core/loaders/panel.loader.ts";

const PAGE = "page";

const CLEAN: PanelSection = {
    id: "clean",
    panels: [
        { kind: "code", tag: "node shape" },
        { kind: "mermaid", tag: "the loop" },
    ],
    prose: "The [node shape] carries its gate, and [the loop] walks it.",
};

const FAULTY: PanelSection = {
    id: "faulty",
    panels: [
        { kind: "code", tag: null },
        { kind: "code", tag: "a title that runs on and on" },
        { kind: "mermaid", tag: "the loop · cited" },
        { kind: "figure", tag: "orphan" },
        { kind: "code", tag: "repeated" },
        { kind: "code", tag: "repeated" },
    ],
    prose: "Only [repeated] and [the loop · cited] and [a title that runs on and on] are cited here.",
};

describe("validatePanels", () => {
    it("passes a section whose every panel carries a short tag the prose cites", () => {
        expect(validatePanels(PAGE, [CLEAN])).toStrictEqual([]);
    });

    it("names the untagged, the long, the separated, the uncited and the duplicated tag", () => {
        const messages = validatePanels(PAGE, [FAULTY]).map((finding) => finding.message);
        expect(messages).toStrictEqual([
            PANEL_UNTAGGED,
            `${PANEL_TAG_TOO_LONG}a title that runs on and on`,
            `${PANEL_TAG_SEPARATED}the loop · cited`,
            `${PANEL_UNCITED}orphan`,
            `${PANEL_TAG_TWICE}repeated`,
        ]);
        expect(validatePanels(PAGE, [FAULTY]).every((finding) => finding.section === FAULTY.id)).toBe(true);
    });

    it("names a cite that matches no panel in its section, once, and reads a bracket followed by a link target as a link", () => {
        const section: PanelSection = {
            id: "cites",
            panels: [{ kind: "code", tag: "node shape" }],
            prose: "The [node shape] and [a missing figure] and [a missing figure] and [a page](/pag) read here.",
        };
        expect(validatePanels(PAGE, [section])).toStrictEqual([
            { message: `${PANEL_CITE_UNKNOWN}a missing figure`, page: PAGE, section: "cites" },
        ]);
    });

    it("counts the panels across sections", () => {
        expect(panelCount([CLEAN, FAULTY])).toBe(8);
    });
});

describe("readPanelSections", () => {
    it("returns null for a page that was never built", () => {
        expect(readPanelSections("no-such-page")).toBeNull();
    });
});
