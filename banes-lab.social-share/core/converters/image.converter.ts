import { OUTPUT_FRAME_MS, WEBP_QUALITY } from "#configuration/configs/card.config";
import type { ImageSize } from "#types/image.types";
import type { Timeline } from "#types/card.types";
import sharp from "sharp";

const ENDLESS = 0;
const ONCE = 1;
const KERNEL = "lanczos3";

const resized = async function resized(frame: Buffer, size: ImageSize): Promise<Buffer> {
    return sharp(frame).resize(size.width, size.height, { fit: "fill", kernel: KERNEL }).png().toBuffer();
};

export const stillOf = async function stillOf(frame: Buffer, size: ImageSize): Promise<Buffer> {
    return resized(frame, size);
};

export const motionOf = async function motionOf(
    frames: readonly Buffer[],
    timeline: Timeline,
    size: ImageSize,
): Promise<Buffer | null> {
    if (frames.length < 2) {
        return null;
    }
    const scaled = await Promise.all(frames.map(async (frame) => resized(frame, size)));
    return sharp(scaled, { join: { animated: true } })
        .webp({ delay: scaled.map(() => OUTPUT_FRAME_MS), loop: timeline.loop ? ENDLESS : ONCE, quality: WEBP_QUALITY })
        .toBuffer();
};
