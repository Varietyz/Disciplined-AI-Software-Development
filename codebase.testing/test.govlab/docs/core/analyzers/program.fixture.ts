import { dirname, join } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import type { ProgramAnalysis } from "@govlab/docs/types/code.types.ts";
import { moduleCompilerOptions } from "@govlab/docs/core/resolvers/program.resolver.ts";
import { tmpdir } from "node:os";
import ts from "typescript";
import { writeVerbatim } from "@govlab/canonical-write";

export interface ProgramFixture {
    analysis: ProgramAnalysis;
    dir: string;
    dispose: () => void;
}

export const programFor = function programFor(files: Readonly<Record<string, string>>): ProgramFixture {
    const dir = mkdtempSync(join(tmpdir(), "doc-program-"));
    const paths = Object.entries(files).map(([rel, body]) => {
        const full = join(dir, ...rel.split("/"));
        mkdirSync(dirname(full), { recursive: true });
        writeVerbatim(full, body);
        return full;
    });
    const program = ts.createProgram(paths, moduleCompilerOptions(dir));
    return {
        analysis: { checker: program.getTypeChecker(), dirPosix: dir.split("\\").join("/"), program },
        dir,
        dispose: () => {
            rmSync(dir, { force: true, recursive: true });
        },
    };
};

export const defined = function defined<T>(value: T | null | undefined, label: string): T {
    if (value === undefined || value === null) {
        throw new Error(label);
    }
    return value;
};

export const sourceFileOf = function sourceFileOf(fixture: ProgramFixture, rel: string): ts.SourceFile {
    const file = fixture.analysis.program.getSourceFile(
        join(fixture.dir, ...rel.split("/"))
            .split("\\")
            .join("/"),
    );
    if (file === undefined) {
        throw new Error(rel);
    }
    return file;
};
