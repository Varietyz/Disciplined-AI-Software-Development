import { afterEach, describe, expect, it, vi } from "vitest";
import { SURFACE_UNAVAILABLE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { loadRecording } from "@banes-lab/web/domain/loaders/surface.loader.ts";
import { surfaceLocation } from "@banes-lab/web/core/assets/surface.asset.ts";

const RECORDING = {
    figure: "venue",
    frames: [{ command: "npm run await", lines: [{ changed: true, text: "a line" }], output: "", surface: "venue.md" }],
    inputs: "digest",
    opening: ["a line"],
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("loadRecording", () => {
    it("fetches a figure's recording once and keeps it", async () => {
        const fetched = vi.fn(async (url: string) =>
            url === surfaceLocation("venue") ? Response.json(RECORDING) : new Response("", { status: 404 }),
        );
        vi.stubGlobal("fetch", fetched);
        expect(await loadRecording("venue")).toStrictEqual(RECORDING);
        await loadRecording("venue");
        expect(fetched).toHaveBeenCalledTimes(1);
    });

    it("answers null and reports a recording that is missing or has no frames, and fetches it again next time", async () => {
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const fetched = vi.fn(async () => Response.json({ ...RECORDING, figure: "wait", frames: [] }));
        vi.stubGlobal("fetch", fetched);
        expect(await loadRecording("wait")).toBeNull();
        expect(logged).toHaveBeenCalledWith(SURFACE_UNAVAILABLE, "wait");
        vi.stubGlobal("fetch", async () => new Response("", { status: 404 }));
        expect(await loadRecording("wait")).toBeNull();
        expect(fetched).toHaveBeenCalledTimes(1);
        expect(logged).toHaveBeenCalledTimes(2);
        logged.mockRestore();
    });
});
