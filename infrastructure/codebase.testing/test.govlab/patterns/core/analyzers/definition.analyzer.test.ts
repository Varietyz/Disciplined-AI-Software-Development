import { deadFindings, duplicateFindings } from "@govlab/patterns/core/analyzers/definition.analyzer.ts";
import { describe, expect, it } from "vitest";
import { definition } from "./code.fixture.ts";

const BODY = 200;

const identifier = function identifier(text: string): Record<string, unknown> {
    return { nodeType: "identifier", text };
};

describe("deadFindings", () => {
    it("flags an unreferenced module-level definition and spares a referenced or test-used one", () => {
        const symbols = [definition("orphan", "f.ts"), definition("used", "f.ts"), definition("tested", "f.ts")];
        const records = [identifier("orphan"), identifier("used"), identifier("used")];
        const dead = deadFindings(symbols, records, new Set(["tested"]));
        expect(dead.map((finding) => finding.name)).toStrictEqual(["orphan"]);
    });

    it("spares an exported definition and a Go entry point", () => {
        const symbols = [definition("api", "f.ts", { exported: true }), definition("main", "cmd.go")];
        expect(deadFindings(symbols, [], new Set())).toStrictEqual([]);
    });
});

describe("duplicateFindings", () => {
    it("flags an identical exported body in more than one file", () => {
        const twin = { exported: true, hash: "same", size: BODY };
        const found = duplicateFindings([definition("dup", "a.ts", twin), definition("dup", "b.ts", twin)]);
        expect(found.map((finding) => finding.members)).toStrictEqual([["a.ts", "b.ts"]]);
    });

    it("ignores an identical body too small to matter", () => {
        const small = { exported: true, hash: "same", size: 1 };
        expect(duplicateFindings([definition("s", "a.ts", small), definition("s", "b.ts", small)])).toStrictEqual([]);
    });
});
