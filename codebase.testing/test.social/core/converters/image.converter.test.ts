import { describe, expect, it } from "vitest";
import { motionOf, stillOf } from "@banes-lab/social-share/core/converters/image.converter.ts";
import { OUTPUT_FRAME_MS } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import sharp from "sharp";

const frameOf = async function frameOf(red: number): Promise<Buffer> {
    return sharp({ create: { background: { b: 0, g: 0, r: red }, channels: 3, height: 40, width: 80 } })
        .png()
        .toBuffer();
};

const SIZE = { height: 20, width: 40 };

describe("stillOf", () => {
    it("resizes a captured frame to the requested size", async () => {
        const still = await stillOf(await frameOf(200), SIZE);
        const meta = await sharp(still).metadata();
        expect([meta.format, meta.width, meta.height]).toStrictEqual(["png", 40, 20]);
    });
});

describe("motionOf", () => {
    it("returns null for a single frame", async () => {
        expect(await motionOf([await frameOf(1)], { fps: 20, frames: 1, keyFrame: 0, loop: true }, SIZE)).toBeNull();
    });

    it("encodes an animated WebP at the output rate and size that plays once for a one-shot timeline", async () => {
        const frames = await Promise.all([10, 120, 240].map(frameOf));
        const webp = await motionOf(frames, { fps: 20, frames: 3, keyFrame: 0, loop: false }, SIZE);
        const meta = await sharp(webp ?? Buffer.alloc(0), { animated: true }).metadata();
        expect([meta.format, meta.pages, meta.width, meta.pageHeight, meta.loop]).toStrictEqual(["webp", 3, 40, 20, 1]);
        expect(meta.delay).toStrictEqual(Array.from({ length: 3 }, () => OUTPUT_FRAME_MS));
    });
});
