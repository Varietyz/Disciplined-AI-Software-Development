import {
    chunkLabel,
    jobFailed,
    jobTimedOut,
    listFailed,
    modeBanner,
    parallelPlan,
    parallelSummary,
} from "@govlab/docs/configuration/strings/invocation.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the invocation strings", () => {
    it("carry every operand they are given", () => {
        const plan = parallelPlan({ changed: 3, chunks: 2, map: "", mode: "check", modules: 9, unchanged: 6 });
        const summary = parallelSummary({ chunks: 2, failed: 1, map: "", unchanged: 6 });
        expect(
            unmatched([
                [jobTimedOut("chunk 1", 500), "timed out after 500ms"],
                [jobFailed("chunk 1", "boom"), "chunk 1: boom"],
                [listFailed("oops"), "oops"],
                [chunkLabel(0), "chunk 1"],
                [plan, "9 modules, 3 to (re)generate across 2 chunk(s)"],
                [summary, "1 job(s)"],
                [modeBanner("validate", "authored documents"), "docs:validate — authored documents"],
            ]),
        ).toStrictEqual([]);
    });
});
