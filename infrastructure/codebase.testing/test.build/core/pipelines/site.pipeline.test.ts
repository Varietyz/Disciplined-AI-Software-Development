import type { SiteOutcome, SiteState, SiteStep } from "@banes-lab/build-scripts/types/site.types.ts";
import {
    cacheDecision,
    discoverSteps,
    runPhase,
    wavesOf,
} from "@banes-lab/build-scripts/core/pipelines/site.pipeline.ts";
import { describe, expect, it, vi } from "vitest";
import type { FingerprintIndex } from "@govlab/content-fingerprint";
import type { PathLike } from "node:fs";
import { absolutePath } from "@ssot/paths";

const absent = vi.hoisted(() => new Set<string>());

interface FsModule {
    readonly existsSync: (path: PathLike) => boolean;
}

vi.mock("node:fs", async (importOriginal) => {
    const actual = await importOriginal<FsModule>();
    return { ...actual, existsSync: (path: PathLike) => !absent.has(String(path)) && actual.existsSync(path) };
});

const STATE: SiteState = {
    diagrams: { attribute: "data-walk", orderOf: () => "" },
    mode: "build",
    ontology: null,
    outDir: "out",
    root: "root",
};

const quiet = async function quiet(): Promise<SiteOutcome> {
    await Promise.resolve();
    return { gives: {}, line: "" };
};

const step = function step(name: string, extra: Partial<SiteStep> = {}): SiteStep {
    return {
        cache: null,
        gives: [name],
        modes: ["build", "serve"],
        name,
        needs: [],
        phase: "start",
        run: quiet,
        ...extra,
    };
};

const ledgerWith = function ledgerWith(held: Record<string, string>): FingerprintIndex {
    return {
        flush: () => {},
        unchanged: (key, hash) => held[key] === hash,
        update: (key, hash) => {
            held[key] = hash;
        },
    };
};

const namesOf = function namesOf(waves: readonly (readonly SiteStep[])[]): readonly (readonly string[])[] {
    return waves.map((wave) => wave.map((held) => held.name));
};

describe("wavesOf", () => {
    it("runs a step after every step it needs, and groups steps with nothing between them into one sorted wave", () => {
        const steps = [
            step("graph", { needs: ["ontology"] }),
            step("ontology"),
            step("icons"),
            step("diagrams", { needs: ["ontology"] }),
        ];
        expect(namesOf(wavesOf(steps, "start", "build"))).toStrictEqual([
            ["icons", "ontology"],
            ["diagrams", "graph"],
        ]);
    });

    it("lets a close step need what a start step gave, and leaves out a step not run in the mode", () => {
        const steps = [
            step("ontology"),
            step("prerender", { modes: ["build"], needs: ["ontology"], phase: "close" }),
            step("prune", { modes: ["build"], needs: ["prerender"], phase: "close" }),
        ];
        expect(namesOf(wavesOf(steps, "close", "build"))).toStrictEqual([["prerender"], ["prune"]]);
        expect(namesOf(wavesOf(steps, "close", "serve"))).toStrictEqual([]);
    });

    it("refuses a need nobody gives, a result two steps give, and steps that need each other", () => {
        expect(() => wavesOf([step("graph", { needs: ["nowhere"] })], "start", "build")).toThrow("nowhere");
        expect(() => wavesOf([step("a", { gives: ["x"] }), step("b", { gives: ["x"] })], "start", "build")).toThrow(
            "x",
        );
        expect(() => wavesOf([step("a", { needs: ["b"] }), step("b", { needs: ["a"] })], "start", "build")).toThrow();
    });
});

describe("discoverSteps", () => {
    it("registers every step file in the steps folder once, and the ontology step among them", async () => {
        const names = (await discoverSteps()).map((held) => held.name);
        expect(new Set(names).size).toBe(names.length);
        expect(names).toContain("ontology");
    }, 60_000);
});

describe("runPhase", () => {
    it("hands each wave the state the earlier waves gave, writes each step's line, and refuses an undeclared result", async () => {
        const written: string[] = [];
        const giver = step("relocate", {
            gives: ["outDir"],
            run: async () => {
                await Promise.resolve();
                return { gives: { outDir: "moved" }, line: "relocated " };
            },
        });
        const reader = step("reader", {
            needs: ["outDir"],
            run: async (state) => {
                await Promise.resolve();
                return { gives: {}, line: `read ${state.outDir} ` };
            },
        });
        const state = await runPhase([reader, giver], "start", STATE, (line) => {
            written.push(line);
        });
        expect(state.outDir).toBe("moved");
        expect(written).toHaveLength(2);
        expect(written[0]?.startsWith("relocated ")).toBe(true);
        expect(written[1]?.startsWith("read moved ")).toBe(true);
        const liar = step("liar", {
            run: async () => {
                await Promise.resolve();
                return { gives: { root: "elsewhere" }, line: "" };
            },
        });
        await expect(runPhase([liar], "start", STATE, () => {})).rejects.toThrow("root");
    });
});

describe("cacheDecision", () => {
    it("runs an uncached step, and skips a cached one only when its key matches and its outputs exist", () => {
        const ledger = ledgerWith({ cached: "same" });
        expect(cacheDecision(step("plain"), STATE, ledger)).toStrictEqual({ key: null, skip: false });
        const cached = step("cached", { cache: { key: () => "same", outputs: ["docArch"] } });
        expect(cacheDecision(cached, STATE, ledger)).toStrictEqual({ key: "same", skip: true });
        const moved = step("cached", { cache: { key: () => "other", outputs: ["docArch"] } });
        expect(cacheDecision(moved, STATE, ledger)).toStrictEqual({ key: "other", skip: false });
        absent.add(absolutePath("docArch"));
        expect(cacheDecision(cached, STATE, ledger)).toStrictEqual({ key: "same", skip: false });
        absent.clear();
    });

    it("refuses a cached step that returns state, since a skip could not restore it", async () => {
        const hoarder = step("hoarder", {
            cache: { key: () => "k", outputs: [] },
            gives: ["outDir"],
            run: async () => {
                await Promise.resolve();
                return { gives: { outDir: "kept" }, line: "" };
            },
        });
        await expect(runPhase([hoarder], "start", { ...STATE, root: process.cwd() }, () => {})).rejects.toThrow(
            "hoarder",
        );
    });
});
