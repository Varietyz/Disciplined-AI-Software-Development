import { ArgvRefusedError, argvOf } from "@govlab/argv";
import { describe, expect, it } from "vitest";
import { GATE_ARGV } from "@govlab/pipeline/configuration/configs/invocation.config.ts";
import type { StageArgs } from "@govlab/pipeline/types/stage.types.ts";
import { stageArgsOf } from "@govlab/pipeline/core/converters/invocation.converter.ts";

const argsOf = function argsOf(words: readonly string[]): StageArgs {
    return stageArgsOf(argvOf(GATE_ARGV, words));
};

describe("stageArgsOf", () => {
    it("reads a list flag given as a separate argument", () => {
        expect([...argsOf(["--bypass", "linting"]).bypass]).toStrictEqual(["linting"]);
    });

    it("splits a comma list into separate slugs", () => {
        expect([...argsOf(["--member", "quality,pipeline"]).members]).toStrictEqual(["quality", "pipeline"]);
    });

    it("accumulates a repeated flag instead of keeping only the last", () => {
        expect([...argsOf(["--tag", "docs", "--tag", "lint"]).tags]).toStrictEqual(["docs", "lint"]);
    });

    it("reports report mode only when the flag is present, and accepts it twice", () => {
        expect(argsOf(["--report"]).report).toBe(true);
        expect(argsOf(["--report", "--member", "stats", "--report"]).report).toBe(true);
        expect(argsOf([]).report).toBe(false);
    });

    it("keeps every flag on its own axis", () => {
        const args = argsOf(["--only", "Lint surfaces", "--skip-tag", "docs", "--run", "build"]);
        expect([...args.only]).toStrictEqual(["Lint surfaces"]);
        expect([...args.skipTags]).toStrictEqual(["docs"]);
        expect([...args.run]).toStrictEqual(["build"]);
    });

    it("drops empty entries from a comma list", () => {
        expect([...argsOf(["--run", ",prepare,"]).run]).toStrictEqual(["prepare"]);
    });

    it("refuses a bare argument the contract does not declare", () => {
        expect(() => argsOf(["--bypass", "linting", "stray"])).toThrow(ArgvRefusedError);
    });

    it("refuses a list flag followed by another flag instead of a value", () => {
        expect(() => argsOf(["--bypass", "--report"])).toThrow(ArgvRefusedError);
    });
});
