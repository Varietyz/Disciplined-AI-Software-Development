import { describe, expect, it } from "vitest";
import {
    playWhileVisible,
    sampleAt,
    samplesOf,
    sequenceIndexAt,
    startClock,
} from "@banes-lab/social-share/core/timers/stage.timer.ts";
import { EMPTY_SEQUENCE } from "@banes-lab/social-share/configuration/strings/card.strings.ts";

type Visibility = (entries: readonly { isIntersecting: boolean }[]) => void;

interface VisibilityStub {
    readonly show: (visible: boolean) => void;
    readonly disconnected: () => boolean;
}

const ignore: Visibility = () => {};

const noFailure = (): void => undefined;

const stubVisibility = function stubVisibility(): VisibilityStub {
    const state = { disconnected: false, notify: ignore };
    Reflect.set(
        globalThis,
        "IntersectionObserver",
        class {
            public constructor(callback: Visibility) {
                state.notify = callback;
            }

            public observe(): void {}

            public disconnect(): void {
                state.disconnected = true;
            }
        },
    );
    return {
        disconnected: () => state.disconnected,
        show: (visible: boolean) => {
            state.notify([{ isIntersecting: visible }]);
        },
    };
};

const stubFrames = function stubFrames(): ((time: number) => void)[] {
    const queued: ((time: number) => void)[] = [];
    Reflect.set(globalThis, "requestAnimationFrame", (callback: (time: number) => void): number => {
        queued.push(callback);
        return queued.length;
    });
    Reflect.set(globalThis, "cancelAnimationFrame", (): void => {});
    return queued;
};

const TIMELINE = { fps: 20, frames: 60, keyFrame: 0, loop: true };

describe("samplesOf", () => {
    it("holds a single sample for a still timeline", () => {
        expect(samplesOf({ fps: 20, frames: 1, keyFrame: 0, loop: true }, 33)).toStrictEqual([0]);
    });

    it("resamples a looping timeline to the output rate without repeating the seam", () => {
        const samples = samplesOf({ fps: 20, frames: 60, keyFrame: 0, loop: true }, 33);
        expect(samples).toHaveLength(99);
        expect(samples[0]).toBe(0);
        expect(samples.at(-1)).toBeLessThan(60);
        expect(samples[1]).toBeCloseTo(60 / 99);
    });

    it("ends a one-shot timeline exactly on its last frame", () => {
        const samples = samplesOf({ fps: 10, frames: 11, keyFrame: 0, loop: false }, 20);
        expect(samples[0]).toBe(0);
        expect(samples.at(-1)).toBeCloseTo(10);
    });
});

describe("sampleAt", () => {
    it("wraps a looping clock and holds a one-shot clock on its last sample", () => {
        expect(sampleAt(0, 10, 33, true)).toBe(0);
        expect(sampleAt(1000, 10, 33, true)).toBe(3);
        expect(sampleAt(1000, 10, 33, false)).toBe(9);
        expect(sampleAt(-50, 10, 33, true)).toBe(0);
    });
});

describe("sequenceIndexAt", () => {
    it("picks the frame whose delay covers the elapsed time, wrapping at the sequence's own loop", () => {
        const delays = [30, 30, 60];
        expect(sequenceIndexAt(delays, 0)).toBe(0);
        expect(sequenceIndexAt(delays, 29.6)).toBe(1);
        expect(sequenceIndexAt(delays, 75)).toBe(2);
        expect(sequenceIndexAt(delays, 120)).toBe(0);
    });

    it("throws for a sequence with no duration", () => {
        expect(() => sequenceIndexAt([], 0)).toThrow(EMPTY_SEQUENCE);
        expect(() => sequenceIndexAt([0, 0], 0)).toThrow(EMPTY_SEQUENCE);
    });
});

describe("startClock", () => {
    it("emits the first sample on the first animation frame and stops when disposed", () => {
        const queued: ((time: number) => void)[] = [];
        const canceled: number[] = [];
        Reflect.set(globalThis, "requestAnimationFrame", (callback: (time: number) => void): number => {
            queued.push(callback);
            return queued.length;
        });
        Reflect.set(globalThis, "cancelAnimationFrame", (handle: number): void => {
            canceled.push(handle);
        });
        const seen: number[] = [];
        const stop = startClock({ fps: 20, frames: 60, keyFrame: 0, loop: true }, 33, (frame) => {
            seen.push(frame);
        });
        queued[0]?.(performance.now());
        stop();
        expect(seen).toStrictEqual([0]);
        expect(canceled).toHaveLength(1);
    });
});

describe("playWhileVisible", () => {
    it("paints only while the element is on screen and skips frames while a paint is pending", async () => {
        const visibility = stubVisibility();
        const queued = stubFrames();
        const painted: number[] = [];
        const pending: (() => void)[] = [];
        const stop = playWhileVisible(
            document.createElement("div"),
            TIMELINE,
            33,
            async (frame) => {
                painted.push(frame);
                return new Promise<void>((settle) => {
                    pending.push(settle);
                });
            },
            noFailure,
        );
        expect(queued).toHaveLength(0);
        visibility.show(true);
        queued[0]?.(performance.now());
        queued[1]?.(performance.now() + 100);
        expect(painted).toHaveLength(1);
        pending[0]?.();
        await Promise.resolve();
        visibility.show(false);
        stop();
        expect(visibility.disconnected()).toBe(true);
    });

    it("reports a failed paint once and stays stopped when the element shows again", async () => {
        const visibility = stubVisibility();
        const queued = stubFrames();
        const failures: unknown[] = [];
        playWhileVisible(
            document.createElement("div"),
            TIMELINE,
            33,
            async () => {
                await Promise.resolve();
                throw new Error("broken");
            },
            (failure) => {
                failures.push(failure);
            },
        );
        visibility.show(true);
        queued[0]?.(performance.now());
        await new Promise((settle) => {
            setTimeout(settle, 0);
        });
        visibility.show(true);
        expect(failures).toHaveLength(1);
        expect(queued).toHaveLength(2);
    });
});
