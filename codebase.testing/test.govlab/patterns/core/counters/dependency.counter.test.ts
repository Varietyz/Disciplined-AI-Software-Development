import { describe, expect, it } from "vitest";
import type { ModuleUnit } from "@govlab/patterns/types/code.types.ts";
import { crossModuleFanIn } from "@govlab/patterns/core/counters/dependency.counter.ts";
import { keyOf } from "@govlab/patterns/core/formatters/definition.formatter.ts";

describe("crossModuleFanIn", () => {
    it("counts distinct importing modules by import source", () => {
        const importers = ["/b", "/d"];
        const units: ModuleUnit[] = [
            ...importers.map((moduleDir) => ({
                imports: [{ importedNames: ["parse"], source: "@scope/a" }],
                moduleDir,
            })),
            { imports: [], moduleDir: "/a" },
        ];
        const fanIn = crossModuleFanIn(units, new Map([["@scope/a", "/a"]]));
        expect(fanIn.get(keyOf("/a", "parse"))).toBe(importers.length);
    });

    it("ignores unresolved sources and self-imports", () => {
        const units: ModuleUnit[] = [
            { imports: [{ importedNames: ["x"], source: "./local.ts" }], moduleDir: "/a" },
            { imports: [{ importedNames: ["x"], source: "@scope/a" }], moduleDir: "/a" },
        ];
        expect(crossModuleFanIn(units, new Map([["@scope/a", "/a"]])).size).toBe(0);
    });
});
