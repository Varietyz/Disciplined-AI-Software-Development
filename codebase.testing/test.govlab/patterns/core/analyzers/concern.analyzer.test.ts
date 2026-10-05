import { describe, expect, it } from "vitest";
import { crossConcernFindings } from "@govlab/patterns/core/analyzers/concern.analyzer.ts";
import { definition } from "./code.fixture.ts";

const edgesInto = function edgesInto(
    from: string,
    concerns: readonly string[],
): { file: string; from: string; line: number; to: string }[] {
    return concerns.map((concern) => ({ file: "core/a.ts", from, line: 1, to: `src/${concern}/x.ts::fn` }));
};

describe("crossConcernFindings", () => {
    it("flags a definition that calls into four or more concerns", () => {
        const found = crossConcernFindings(
            [definition("run", "core/a.ts")],
            edgesInto("core/a.ts::run", ["alpha", "beta", "gamma", "delta"]),
        );
        expect(found.map((finding) => finding.members)).toStrictEqual([["alpha", "beta", "delta", "gamma"]]);
    });

    it("spares a factory and a definition with a narrow reach", () => {
        const wide = ["alpha", "beta", "gamma", "delta"];
        expect(
            crossConcernFindings([definition("createAll", "core/a.ts")], edgesInto("core/a.ts::createAll", wide)),
        ).toStrictEqual([]);
        expect(
            crossConcernFindings([definition("run", "core/a.ts")], edgesInto("core/a.ts::run", ["alpha"])),
        ).toStrictEqual([]);
    });
});
