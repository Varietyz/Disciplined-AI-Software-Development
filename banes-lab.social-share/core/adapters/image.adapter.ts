import {
    FFMPEG_BINARY,
    FRAME_DIGITS,
    FRAME_EXTENSION,
    FRAME_PREFIX,
    MILLISECONDS,
    VIDEO_FILE,
} from "#configuration/constants/card.constants";
import { FFMPEG_FAILED, FFMPEG_MISSING, SUBJECT_SEPARATOR } from "#configuration/strings/card.strings";
import {
    GIF_COLORS,
    GIF_DITHER,
    GIF_PALETTE_STATS,
    OUTPUT_FRAME_MS,
    VIDEO_CRF,
} from "#configuration/configs/card.config";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import type { ImageSize } from "#types/image.types";
import type { Timeline } from "#types/card.types";
import { evenSizeOf } from "#core/converters/filename.converter";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { writeVerbatim } from "@govlab/canonical-write";

const ENDLESS = "0";
const ONCE = "-1";
const MISSING_CODE = "ENOENT";
const FRAME_PATTERN = `${FRAME_PREFIX}%0${String(FRAME_DIGITS)}d${FRAME_EXTENSION}`;
const RATE = `${String(MILLISECONDS)}/${String(OUTPUT_FRAME_MS)}`;

const hasCode = function hasCode(error: unknown): error is { code: unknown } {
    return typeof error === "object" && error !== null && "code" in error;
};

const runFfmpeg = async function runFfmpeg(args: readonly string[]): Promise<void> {
    return new Promise((settle, fail) => {
        execFile(FFMPEG_BINARY, ["-hide_banner", "-loglevel", "error", "-y", ...args], (error, _stdout, stderr) => {
            if (error === null) {
                settle();
                return;
            }
            const reason =
                hasCode(error) && error.code === MISSING_CODE
                    ? FFMPEG_MISSING
                    : FFMPEG_FAILED + SUBJECT_SEPARATOR + stderr;
            fail(new Error(reason, { cause: error }));
        });
    });
};

const frameName = function frameName(index: number): string {
    return FRAME_PREFIX + String(index).padStart(FRAME_DIGITS, "0") + FRAME_EXTENSION;
};

export const encodeLoop = async function encodeLoop(frames: readonly Buffer[], folder: string): Promise<string> {
    rmSync(folder, { force: true, recursive: true });
    mkdirSync(folder, { recursive: true });
    for (const [index, frame] of frames.entries()) {
        writeVerbatim(join(folder, frameName(index)), frame);
    }
    const video = join(folder, VIDEO_FILE);
    await runFfmpeg([
        "-framerate",
        RATE,
        "-i",
        join(folder, FRAME_PATTERN),
        "-c:v",
        "libx264",
        "-qp",
        "0",
        "-pix_fmt",
        "yuv444p",
        video,
    ]);
    return video;
};

export const videoFrom = async function videoFrom(master: string, size: ImageSize): Promise<Buffer> {
    const even = evenSizeOf(size);
    const output = `${master}.${String(even.width)}x${String(even.height)}.mp4`;
    await runFfmpeg([
        "-i",
        master,
        "-vf",
        `scale=${String(size.width)}:${String(size.height)}:flags=lanczos,crop=${String(even.width)}:${String(even.height)}:0:0`,
        "-c:v",
        "libx264",
        "-crf",
        String(VIDEO_CRF),
        "-preset",
        "slow",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        output,
    ]);
    return readFileSync(output);
};

export const gifFrom = async function gifFrom(video: string, size: ImageSize, timeline: Timeline): Promise<Buffer> {
    const output = `${video}.${String(size.width)}x${String(size.height)}.gif`;
    const scale = `scale=${String(size.width)}:${String(size.height)}:flags=lanczos`;
    const palette = `split[source][copy];[source]palettegen=stats_mode=${GIF_PALETTE_STATS}:max_colors=${String(GIF_COLORS)}[palette];[copy][palette]paletteuse=dither=${GIF_DITHER}:diff_mode=rectangle`;
    await runFfmpeg([
        "-i",
        video,
        "-vf",
        `fps=${RATE},${scale},${palette}`,
        "-loop",
        timeline.loop ? ENDLESS : ONCE,
        output,
    ]);
    return readFileSync(output);
};
