import { describe, expect, it } from "vitest";
import { replacementText, scanSourceFile } from "@ssot/govlab/codemods/analyzers/code-point.analyzer.ts";
import type { CodePointFinding as Finding } from "@ssot/govlab/types/analyzer.types.ts";
import ts from "typescript";

const FILE = "probe.ts";

const scan = function scan(code: string): Finding[] {
    const source = ts.createSourceFile(FILE, code, ts.ScriptTarget.Latest, true);
    const host: ts.CompilerHost = {
        fileExists: (name) => name === FILE,
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: () => "",
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        getNewLine: () => "\n",
        getSourceFile: (name) => (name === FILE ? source : undefined),
        readFile: (name) => (name === FILE ? code : undefined),
        useCaseSensitiveFileNames: () => true,
        writeFile: () => {},
    };
    const program = ts.createProgram({ host, options: {}, rootNames: [FILE] });
    return scanSourceFile(program.getTypeChecker(), program.getSourceFile(FILE) ?? source);
};

describe("scanSourceFile", () => {
    it("finds a string receiver and marks it convertible", () => {
        const [finding] = scan('const s = "abc";\nconst n = s.charCodeAt(0);');
        expect(finding?.reason).toBeNull();
        expect(finding?.receiver).toBe("s");
        expect(finding?.args).toBe("0");
    });

    it("blocks a call carrying no index argument", () => {
        const [finding] = scan('const s = "abc";\nconst n = s.charCodeAt();');
        expect(finding?.reason).toContain("expected exactly one index argument");
    });

    it("blocks an optional call, whose receiver may be nullish", () => {
        const [finding] = scan('const s: string | null = "abc";\nconst n = s?.charCodeAt(0);');
        expect(finding?.reason).toContain("optional call");
    });

    it("blocks a receiver that is not a string, since the method is then not the String one", () => {
        const [finding] = scan("const o = { charCodeAt: (i: number) => i };\nconst n = o.charCodeAt(0);");
        expect(finding?.reason).toContain("is not the String method");
    });

    it("finds nothing when the method is not the one being migrated", () => {
        expect(scan('const s = "abc";\nconst n = s.codePointAt(0);')).toStrictEqual([]);
    });

    it("finds nothing in source with no call at all", () => {
        expect(scan("const a = 1;")).toStrictEqual([]);
    });
});

describe("replacementText", () => {
    it("composes the migration and defaults the nullable result", () => {
        const [finding] = scan('const s = "abc";\nconst n = s.charCodeAt(0);');
        expect(finding === undefined ? "" : replacementText(finding)).toBe("(s.codePointAt(0) ?? 0)");
    });
});
