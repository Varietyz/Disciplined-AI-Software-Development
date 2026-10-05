import type { Profile, Timeline } from "#types/card.types";
import { MILLISECONDS } from "#configuration/constants/card.constants";

export const PROFILES: readonly Profile[] = [
    { height: 630, id: "og", width: 1200 },
    { height: 675, id: "x", width: 1200 },
    { height: 1080, id: "square", width: 1080 },
];

export const SHARE_PROFILE = "og";

export const DEFAULT_TIMELINE: Timeline = { fps: 20, frames: 1, keyFrame: 0, loop: true };

export const GIF_DITHER = "sierra2_4a";

export const GIF_PALETTE_STATS = "diff";

export const GIF_COLORS = 64;

export const VIDEO_CRF = 18;

export const OUTPUT_FRAME_MS = 30;

export const OUTPUT_RATE = MILLISECONDS / OUTPUT_FRAME_MS;

export const OUTPUT_SCALES: readonly number[] = [1, 0.75, 0.5, 0.25];

export const SHARE_SCALE = 0.75;

export const SHARE_BYTE_LIMIT = 5 * 1024 * 1024;

export const WEBP_QUALITY = 80;
