import { collectOverrides, scanSourceFile } from "@ssot/govlab/codemods/analyzers/binding.analyzer.ts";
import { describe, expect, it } from "vitest";
import type { BindingFinding as Finding } from "@ssot/govlab/types/analyzer.types.ts";
import { sep } from "node:path";
import ts from "typescript";

const FILE = `${process.cwd().split(sep).join("/")}/probe.ts`;

interface Analysis {
    findings: Finding[];
    overrides: Map<ts.Symbol, Set<string>>;
}

const analyze = function analyze(code: string): Analysis {
    const source = ts.createSourceFile(FILE, code, ts.ScriptTarget.Latest, true);
    const host: ts.CompilerHost = {
        fileExists: (name) => name === FILE,
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: () => process.cwd(),
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        getNewLine: () => "\n",
        getSourceFile: (name) => (name === FILE ? source : undefined),
        readFile: (name) => (name === FILE ? code : undefined),
        useCaseSensitiveFileNames: () => true,
        writeFile: () => {},
    };
    const program = ts.createProgram({ host, options: {}, rootNames: [FILE] });
    const checker = program.getTypeChecker();
    const resolved = program.getSourceFile(FILE) ?? source;
    const overrides = collectOverrides(checker, [resolved]);
    return { findings: scanSourceFile(checker, resolved, overrides), overrides };
};

const CALLABLE_CONTRACT = "interface Runner { run: () => void; }";

describe("scanSourceFile", () => {
    it("finds a callable contract field satisfied by a method", () => {
        const { findings } = analyze(`${CALLABLE_CONTRACT}\nclass Job implements Runner { run() {} }`);
        expect(findings).toHaveLength(1);
        expect(findings[0]?.member).toBe("run");
    });

    it("accepts a class that already binds the field as a property", () => {
        const code = `${CALLABLE_CONTRACT}\nclass Job implements Runner { run = () => {}; }`;
        expect(analyze(code).findings).toStrictEqual([]);
    });

    it("ignores a contract field that is not callable", () => {
        const code = "interface Named { id: string; }\nclass Job implements Named { id = 'a'; }";
        expect(analyze(code).findings).toStrictEqual([]);
    });

    it("ignores a class that implements nothing", () => {
        expect(analyze("class Job { run() {} }").findings).toStrictEqual([]);
    });

    it("finds nothing in source with no class", () => {
        expect(analyze("export const a = 1;").findings).toStrictEqual([]);
    });
});

describe("collectOverrides", () => {
    it("returns a map, empty where no class overrides an inherited member", () => {
        expect(analyze("class Job { run() {} }").overrides.size).toBe(0);
    });

    it("records a member a subclass overrides, which blocks a naive rewrite of the base", () => {
        const code = "class Base { run() {} }\nclass Leaf extends Base { run() {} }";
        expect(analyze(code).overrides.size).toBeGreaterThan(0);
    });
});
