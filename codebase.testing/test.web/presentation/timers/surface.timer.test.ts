import { afterEach, describe, expect, it, vi } from "vitest";
import { STEP_LIMIT_MS } from "@banes-lab/web/configuration/constants/surface.constants.ts";
import { SurfaceTimer } from "@banes-lab/web/presentation/timers/surface.timer.ts";

type FrameCallback = (now: number) => void;

const frames: FrameCallback[] = [];

const runFrame = function runFrame(now: number): void {
    frames.shift()?.(now);
};

const stubFrames = function stubFrames(): ReturnType<typeof vi.fn> {
    frames.length = 0;
    const cancel = vi.fn(() => {
        frames.length = 0;
    });
    vi.stubGlobal("requestAnimationFrame", (callback: FrameCallback) => frames.push(callback));
    vi.stubGlobal("cancelAnimationFrame", cancel);
    return cancel;
};

interface Recording {
    readonly events: string[];
    readonly on: (entry: string) => () => void;
}

const recording = function recording(): Recording {
    const events: string[] = [];
    return {
        events,
        on: (entry) => () => {
            events.push(entry);
        },
    };
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("SurfaceTimer", () => {
    it("begins each segment once, reports its progress, and carries leftover time into the next segment as it loops", () => {
        stubFrames();
        const { events, on } = recording();
        const timer = new SurfaceTimer([
            {
                advance: (progress) => {
                    events.push(`a ${String(progress)}`);
                },
                begin: on("begin a"),
                ms: 40,
            },
            { begin: on("begin b"), ms: 40 },
        ]);
        timer.run();
        runFrame(0);
        runFrame(20);
        runFrame(60);
        runFrame(100);
        expect(events).toStrictEqual(["begin a", "a 0", "a 0.5", "a 1", "begin b", "begin a", "a 0.5"]);
    });

    it("caps one frame's step, so a tab that slept does not skip the script", () => {
        stubFrames();
        const progress: number[] = [];
        const timer = new SurfaceTimer([
            {
                advance: (value) => {
                    progress.push(value);
                },
                ms: STEP_LIMIT_MS * 4,
            },
        ]);
        timer.run();
        runFrame(0);
        runFrame(STEP_LIMIT_MS * 100);
        expect(progress).toStrictEqual([0, 0.25]);
    });

    it("applies the first segments at once on settle, and stops asking for frames on halt", () => {
        const cancel = stubFrames();
        const { events, on } = recording();
        const timer = new SurfaceTimer([
            {
                advance: (value) => {
                    events.push(`a ${String(value)}`);
                },
                begin: on("begin a"),
                ms: 10,
            },
            { begin: on("begin b"), ms: 10 },
        ]);
        timer.settle(1);
        expect(events).toStrictEqual(["begin a", "a 1"]);
        timer.run();
        timer.halt();
        expect(cancel).toHaveBeenCalledTimes(1);
        expect(frames).toHaveLength(0);
        new SurfaceTimer([]).run();
        expect(frames).toHaveLength(0);
    });
});
