import { ANIMATION_FAILED, SUBJECT_SEPARATOR } from "#configuration/strings/card.strings";
import type { AnimationPass } from "#types/stage.types";
import { MILLISECONDS } from "#configuration/constants/card.constants";
import { sequenceIndexAt } from "#core/timers/stage.timer";

interface DecodedFrame {
    readonly bitmap: ImageBitmap;
    readonly delay: number;
}

const CONTEXT_KIND = "2d";
const TYPE_HEADER = "content-type";
const MICROSECONDS_PER_MILLISECOND = 1000;

const failure = function failure(source: string, reason: string): Error {
    return new Error(ANIMATION_FAILED + SUBJECT_SEPARATOR + source + SUBJECT_SEPARATOR + reason);
};

const decoderOf = async function decoderOf(source: string): Promise<ImageDecoder> {
    const response = await fetch(source);
    const type = response.headers.get(TYPE_HEADER);
    if (!response.ok || response.body === null || type === null) {
        throw failure(source, String(response.status));
    }
    const decoder = new ImageDecoder({ data: response.body, type });
    await decoder.completed;
    return decoder;
};

const frameAt = async function frameAt(decoder: ImageDecoder, source: string, index: number): Promise<DecodedFrame> {
    const { image } = await decoder.decode({ frameIndex: index });
    const { duration } = image;
    if (duration === null) {
        image.close();
        throw failure(source, String(index));
    }
    const bitmap = await createImageBitmap(image);
    image.close();
    return { bitmap, delay: duration / MICROSECONDS_PER_MILLISECOND };
};

const framesOf = async function framesOf(decoder: ImageDecoder, source: string): Promise<readonly DecodedFrame[]> {
    const track = decoder.tracks.selectedTrack;
    if (track === null) {
        throw failure(source, String(decoder.tracks.length));
    }
    const indices = Array.from({ length: track.frameCount }, (_, index) => index);
    return indices.reduce<Promise<readonly DecodedFrame[]>>(
        async (previous, index) => [...(await previous), await frameAt(decoder, source, index)],
        Promise.resolve([]),
    );
};

const decodedFrames = new Map<string, Promise<readonly DecodedFrame[]>>();

const decodeOnce = async function decodeOnce(source: string): Promise<readonly DecodedFrame[]> {
    const decoder = await decoderOf(source);
    try {
        return await framesOf(decoder, source);
    } finally {
        decoder.close();
    }
};

const framesFor = async function framesFor(source: string): Promise<readonly DecodedFrame[]> {
    const held = decodedFrames.get(source);
    if (held !== undefined) {
        return held;
    }
    const decoding = decodeOnce(source);
    decodedFrames.set(source, decoding);
    return decoding;
};

export const createAnimationPass = async function createAnimationPass(
    canvas: HTMLCanvasElement,
    source: string,
): Promise<AnimationPass> {
    const context = canvas.getContext(CONTEXT_KIND);
    if (context === null) {
        throw failure(source, CONTEXT_KIND);
    }
    context.imageSmoothingQuality = "high";
    const frames = await framesFor(source);
    const delays = frames.map((frame) => frame.delay);
    return {
        delays,
        draw: (time: number): void => {
            const frame = frames[sequenceIndexAt(delays, time * MILLISECONDS)];
            if (frame === undefined) {
                throw failure(source, String(time));
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(frame.bitmap, 0, 0, canvas.width, canvas.height);
        },
    };
};
