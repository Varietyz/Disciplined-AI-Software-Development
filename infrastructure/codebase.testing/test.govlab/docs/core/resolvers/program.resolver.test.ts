import { afterAll, describe, expect, it } from "vitest";
import { PROGRAM_OPTIONS } from "@govlab/docs/configuration/constants/program.constants.ts";
import { absolutePath } from "@ssot/paths";
import { hasSymbolFlag } from "@govlab/docs/core/predicates/program.predicate.ts";
import { inPackageSources } from "@govlab/docs/core/selectors/program.selector.ts";
import { moduleCompilerOptions } from "@govlab/docs/core/resolvers/program.resolver.ts";
import { programFor } from "../analyzers/program.fixture.ts";
import ts from "typescript";

const fixture = programFor({ "a.ts": "export const a = 1;\n", "types.d.ts": "export type T = 1;\n" });

afterAll(() => {
    fixture.dispose();
});

describe("moduleCompilerOptions", () => {
    it("layers the nearest compiler config under the overrides, and falls back to the defaults without one", () => {
        const options = moduleCompilerOptions(absolutePath("govlab.docs"));
        expect([options.declaration, options.noEmit]).toStrictEqual([false, true]);
        expect(moduleCompilerOptions(fixture.dir)).toBe(PROGRAM_OPTIONS);
    });
});

describe("inPackageSources", () => {
    it("keeps the package's own sources and drops declaration files", () => {
        const names = inPackageSources(fixture.analysis.program, fixture.analysis.dirPosix).map(
            (file) => file.fileName,
        );
        expect(names.map((name) => name.slice(name.lastIndexOf("/") + 1))).toStrictEqual(["a.ts"]);
    });
});

describe("hasSymbolFlag", () => {
    it("tests one bit of a symbol flag set", () => {
        const flags = ts.SymbolFlags.Alias + ts.SymbolFlags.Function;
        expect([hasSymbolFlag(flags, ts.SymbolFlags.Alias), hasSymbolFlag(flags, ts.SymbolFlags.Class)]).toStrictEqual([
            true,
            false,
        ]);
    });
});
