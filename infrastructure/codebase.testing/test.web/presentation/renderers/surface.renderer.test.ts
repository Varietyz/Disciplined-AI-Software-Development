import { MALFORMED_RECORDING, missingRecording } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { describe, expect, it, vi } from "vitest";
import { renderSurface, renderTranscripts } from "@banes-lab/web/presentation/renderers/surface.renderer.ts";
import { SURFACE_MISSING } from "@banes-lab/web/configuration/strings/surface.strings.ts";
import type { SurfaceRecording } from "@banes-lab/web/types/surface.types.ts";

vi.mock("@banes-lab/web/domain/loaders/surface.loader.ts", () => ({
    loadRecording: async (): Promise<null> => {
        await Promise.resolve();
        return null;
    },
}));

const RECORDING: SurfaceRecording = {
    figure: "venue",
    frames: [{ command: "npm run await", lines: [], output: "ITEM  A-1 was added.\n", surface: "venue.md" }],
    inputs: "",
    opening: [],
};

describe("renderSurface", () => {
    it("builds the captioned figure and reports a recording that cannot be loaded", async () => {
        const figure = renderSurface({ caption: "The venue", figure: "venue", kind: "surface" });
        expect(figure.querySelector("figcaption")?.textContent).toContain("The venue");
        await vi.waitFor(() => {
            expect(figure.textContent).toContain(SURFACE_MISSING);
        });
    });
});

describe("renderTranscripts", () => {
    it("writes each figure's recording as a text block in its stage", () => {
        const root = document.createElement("div");
        root.append(renderSurface({ caption: "The venue", figure: "venue", kind: "surface" }));
        renderTranscripts(root, [RECORDING]);
        expect(root.querySelector("pre code")?.textContent).toBe("$ npm run await\nITEM  A-1 was added.");
    });

    it("refuses a value on disk that is not a recording", () => {
        const root = document.createElement("div");
        expect(() => {
            renderTranscripts(root, [RECORDING, { figure: "wait" }]);
        }).toThrow(MALFORMED_RECORDING);
    });

    it("refuses a figure whose recording is missing", () => {
        const root = document.createElement("div");
        root.append(renderSurface({ caption: "The wait", figure: "wait", kind: "surface" }));
        expect(() => {
            renderTranscripts(root, [RECORDING]);
        }).toThrow(missingRecording("wait"));
    });
});
