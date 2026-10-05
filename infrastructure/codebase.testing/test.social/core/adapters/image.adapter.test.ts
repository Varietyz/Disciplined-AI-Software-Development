import { describe, expect, it } from "vitest";
import { encodeLoop, gifFrom, videoFrom } from "@banes-lab/social-share/core/adapters/image.adapter.ts";
import { existsSync, mkdtempSync } from "node:fs";
import { OUTPUT_FRAME_MS } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import { join } from "node:path";
import sharp from "sharp";
import { tmpdir } from "node:os";

const frameOf = async function frameOf(red: number): Promise<Buffer> {
    return sharp({ create: { background: { b: 40, g: 20, r: red }, channels: 3, height: 60, width: 120 } })
        .png()
        .toBuffer();
};

const LOOP = { fps: 20, frames: 4, keyFrame: 0, loop: true };

describe("encodeLoop, gifFrom and videoFrom", () => {
    it("encodes the frames to a master video and derives a looping GIF and a playable video at every size", async () => {
        const scratch = mkdtempSync(join(tmpdir(), "social-video-"));
        const folder = join(scratch, "work");
        const frames = await Promise.all([20, 90, 160, 230].map(frameOf));
        const master = await encodeLoop(frames, folder);
        expect(existsSync(master)).toBe(true);
        const gif = await gifFrom(master, { height: 29, width: 60 }, LOOP);
        const meta = await sharp(gif, { animated: true }).metadata();
        expect([meta.format, meta.pages, meta.width, meta.pageHeight, meta.loop]).toStrictEqual(["gif", 4, 60, 29, 0]);
        expect([...new Set(meta.delay)]).toStrictEqual([OUTPUT_FRAME_MS]);
        const video = await videoFrom(master, { height: 29, width: 60 });
        expect(video.subarray(4, 8).toString("latin1")).toBe("ftyp");
    }, 60_000);

    it("rejects with ffmpeg's own message when an input is unusable", async () => {
        const folder = mkdtempSync(join(tmpdir(), "social-video-"));
        await expect(gifFrom(join(folder, "absent.mp4"), { height: 10, width: 10 }, LOOP)).rejects.toThrow(
            "ffmpeg failed",
        );
    }, 60_000);
});
