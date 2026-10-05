import type { Edit } from "../../types/codemod.types.ts";
import { extname } from "node:path";
import { readFileSync } from "node:fs";
import { syntaxRefusal } from "../strings/codemod.strings.ts";
import ts from "typescript";
import { writeVerbatim } from "@govlab/canonical-write";

const JSON_EXTENSION = ".json";

export const parsesAsJson = function parsesAsJson(content: string): boolean {
    try {
        JSON.parse(content);
        return true;
    } catch (error) {
        if (error instanceof SyntaxError) {
            return false;
        }
        throw error;
    }
};

const overlaps = function overlaps(left: Edit, right: Edit): boolean {
    return left.start < right.end && right.start < left.end;
};

export const disjoint = function disjoint(edits: readonly Edit[]): Edit[] {
    const kept: Edit[] = [];
    for (const edit of edits) {
        if (!kept.some((other) => overlaps(edit, other))) {
            kept.push(edit);
        }
    }
    return kept;
};

const syntaxErrors = function syntaxErrors(target: string, content: string): number {
    if (extname(target) === JSON_EXTENSION) {
        return parsesAsJson(content) ? 0 : 1;
    }
    const result = ts.transpileModule(content, {
        compilerOptions: { target: ts.ScriptTarget.ESNext },
        fileName: target,
        reportDiagnostics: true,
    });
    return (result.diagnostics ?? []).length;
};

export const splice = function splice(content: string, edits: readonly Edit[]): string {
    let out = content;
    for (const edit of edits) {
        out = out.slice(0, edit.start) + edit.replacement + out.slice(edit.end);
    }
    return out;
};

export const applyEdits = function applyEdits(fileName: string, edits: readonly Edit[]): number {
    if (edits.length === 0) {
        return 0;
    }
    const ordered = disjoint([...edits].sort((a, b) => b.start - a.start));
    const original = readFileSync(fileName, "utf8");
    const next = splice(original, ordered);
    if (syntaxErrors(fileName, next) > syntaxErrors(fileName, original)) {
        throw new Error(syntaxRefusal(fileName));
    }
    writeVerbatim(fileName, next);
    return ordered.length;
};

export const applyByFile = function applyByFile(byFile: ReadonlyMap<string, Edit[]>): number {
    let applied = 0;
    for (const [fileName, edits] of byFile) {
        applied += applyEdits(fileName, edits);
    }
    return applied;
};
