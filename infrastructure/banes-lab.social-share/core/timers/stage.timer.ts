import type { Disposer } from "@banes-lab/web/types/base.types.ts";
import { EMPTY_SEQUENCE } from "#configuration/strings/card.strings";
import { MILLISECONDS } from "#configuration/constants/card.constants";
import type { Timeline } from "#types/card.types";

export const samplesOf = function samplesOf(timeline: Timeline, rate: number): readonly number[] {
    if (timeline.frames <= 1) {
        return [0];
    }
    const span = timeline.loop ? timeline.frames : timeline.frames - 1;
    const count = Math.max(2, Math.round((span / timeline.fps) * rate) + (timeline.loop ? 0 : 1));
    const step = timeline.loop ? span / count : span / (count - 1);
    return Array.from({ length: count }, (_, index) => index * step);
};

export const sampleAt = function sampleAt(elapsed: number, count: number, rate: number, loop: boolean): number {
    const raw = Math.floor((Math.max(0, elapsed) * rate) / MILLISECONDS);
    return loop ? raw % count : Math.min(raw, count - 1);
};

export const sequenceIndexAt = function sequenceIndexAt(delays: readonly number[], elapsedMs: number): number {
    const total = delays.reduce((sum, delay) => sum + delay, 0);
    if (delays.length === 0 || total <= 0) {
        throw new RangeError(EMPTY_SEQUENCE);
    }
    let remaining = Math.round(elapsedMs) % total;
    for (const [index, delay] of delays.entries()) {
        if (remaining < delay) {
            return index;
        }
        remaining -= delay;
    }
    return delays.length - 1;
};

interface Playback {
    busy: boolean;
    failed: boolean;
    stop: Disposer | null;
}

export const playWhileVisible = function playWhileVisible(
    element: Element,
    timeline: Timeline,
    rate: number,
    paint: (frame: number) => Promise<void>,
    onFailure: (failure: unknown) => void,
): Disposer {
    const state: Playback = { busy: false, failed: false, stop: null };
    const pause = (): void => {
        state.stop?.();
        state.stop = null;
    };
    const fail = (failure: unknown): void => {
        state.failed = true;
        pause();
        onFailure(failure);
    };
    const settle = (): void => {
        state.busy = false;
    };
    const play = (): void => {
        if (state.stop !== null || state.failed) {
            return;
        }
        state.stop = startClock(timeline, rate, (frame) => {
            if (state.busy) {
                return;
            }
            state.busy = true;
            paint(frame).then(settle, fail);
        });
    };
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                play();
            } else {
                pause();
            }
        }
    });
    observer.observe(element);
    return () => {
        observer.disconnect();
        pause();
    };
};

export const startClock = function startClock(
    timeline: Timeline,
    rate: number,
    onFrame: (frame: number) => void,
): Disposer {
    const samples = samplesOf(timeline, rate);
    const started = performance.now();
    let shown = -1;
    let handle = 0;
    const tick = function tick(now: number): void {
        const index = sampleAt(now - started, samples.length, rate, timeline.loop);
        if (index !== shown) {
            shown = index;
            onFrame(samples[index] ?? 0);
        }
        handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => {
        cancelAnimationFrame(handle);
    };
};
