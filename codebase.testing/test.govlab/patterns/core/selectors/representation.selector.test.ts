import {
    applicableAnalyses,
    registeredRepresentations,
    runtimeFor,
} from "@govlab/patterns/core/selectors/representation.selector.ts";
import { describe, expect, it } from "vitest";

describe("the representation selectors", () => {
    it("list the built-in representations in order", () => {
        expect(registeredRepresentations()).toStrictEqual([
            "distribution",
            "graph",
            "grid",
            "sequence",
            "tree",
            "vector",
        ]);
    });

    it("hand out a runtime factory for a registered name only", () => {
        expect(runtimeFor("vector")).toBeTypeOf("function");
        expect(runtimeFor("unregistered")).toBeUndefined();
    });

    it("name the analyses each representation supports", () => {
        expect(applicableAnalyses("distribution")).toStrictEqual(["statistical", "frequency", "anomaly"]);
        expect(applicableAnalyses("unregistered")).toStrictEqual([]);
    });
});
