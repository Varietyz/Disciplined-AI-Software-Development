import { describe, expect, it } from "vitest";
import { disjoint, splice } from "@ssot/govlab/codemods/selectors/edit.selector.ts";
import type { Edit } from "@ssot/govlab/types/codemod.types.ts";
import type { WriteFinding } from "@ssot/govlab/types/analyzer.types.ts";
import { scanSourceFile } from "@ssot/govlab/codemods/analyzers/sink.analyzer.ts";
import ts from "typescript";

const FILE = "probe.ts";
const OWNER = "owner.ts";

const scanAs = function scanAs(file: string, code: string, declared: boolean): WriteFinding[] {
    const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);
    const host: ts.CompilerHost = {
        fileExists: (name) => name === file,
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: () => "",
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        getNewLine: () => "\n",
        getSourceFile: (name) => (name === file ? source : undefined),
        readFile: (name) => (name === file ? code : undefined),
        useCaseSensitiveFileNames: () => true,
        writeFile: () => {},
    };
    const program = ts.createProgram({ host, options: {}, rootNames: [file] });
    return scanSourceFile(program.getTypeChecker(), program.getSourceFile(file) ?? source, {
        declaresWriter: () => declared,
        owners: new Set([OWNER]),
    });
};

const scan = function scan(code: string): WriteFinding[] {
    return scanAs(FILE, code, true);
};

const rewrite = function rewrite(code: string): string {
    const findings = scan(code).filter((finding) => finding.reason === null);
    const edits: Edit[] = [
        ...(findings[0]?.importEdits ?? []),
        ...findings.map((finding) => ({ end: finding.end, replacement: finding.replacement, start: finding.start })),
    ];
    return splice(code, disjoint(edits.toSorted((a, b) => b.start - a.start)));
};

describe("scanSourceFile", () => {
    it("routes a sole raw write through the owner's writer and replaces the primitive import", () => {
        const code = 'import { writeFileSync } from "node:fs";\nwriteFileSync(target, "x");\n';
        expect(rewrite(code)).toBe(
            'import { writeVerbatim } from "@govlab/canonical-write";\nwriteVerbatim(target, "x");\n',
        );
    });

    it("keeps the other primitive imports and drops a text encoding argument", () => {
        const code =
            'import { readFileSync, writeFileSync } from "node:fs";\nwriteFileSync(target, readFileSync(source), "utf8");\n';
        expect(rewrite(code)).toBe(
            'import { writeVerbatim } from "@govlab/canonical-write";\nimport { readFileSync } from "node:fs";\nwriteVerbatim(target, readFileSync(source));\n',
        );
    });

    it("blocks a write whose encoding is not text", () => {
        const code = 'import { writeFileSync } from "node:fs";\nwriteFileSync(target, "x", "latin1");\n';
        expect(scan(code)[0]?.reason).toContain("'latin1' encoding");
    });

    it("extends an existing import of the owner's package instead of adding a second one", () => {
        const code =
            'import { writeCanonicalJson } from "@govlab/canonical-write";\nimport { writeFileSync } from "node:fs";\nwriteFileSync(target, "x");\n';
        expect(rewrite(code)).toBe(
            'import { writeCanonicalJson, writeVerbatim } from "@govlab/canonical-write";\nwriteVerbatim(target, "x");\n',
        );
    });

    it("blocks a write whose options object the owner's writer does not take, and keeps the import", () => {
        const code = 'import { writeFileSync } from "node:fs";\nwriteFileSync(target, "x", { flag: "a" });\n';
        const [finding] = scan(code);
        expect(finding?.reason).toContain("3 arguments");
        expect(rewrite(code)).toBe(code);
    });

    it("keeps the primitive import while a reference other than a call remains", () => {
        const code =
            'import { writeFileSync } from "node:fs";\nconst write = writeFileSync;\nwriteFileSync(target, "x");\n';
        expect(rewrite(code)).toBe(
            'import { writeVerbatim } from "@govlab/canonical-write";\nimport { writeFileSync } from "node:fs";\nconst write = writeFileSync;\nwriteVerbatim(target, "x");\n',
        );
    });

    it("blocks every write in a file whose package does not declare the owner's package", () => {
        const [finding] = scanAs(
            FILE,
            'import { writeFileSync } from "node:fs";\nwriteFileSync(target, "x");\n',
            false,
        );
        expect(finding?.reason).toContain("does not declare");
    });

    it("leaves the owner module alone", () => {
        expect(
            scanAs(OWNER, 'import { writeFileSync } from "node:fs";\nwriteFileSync(target, "x");\n', true),
        ).toStrictEqual([]);
    });

    it("finds nothing when the primitive is not imported by name", () => {
        expect(scan('import fs from "node:fs";\nfs.readFileSync(target);\n')).toStrictEqual([]);
    });
});
