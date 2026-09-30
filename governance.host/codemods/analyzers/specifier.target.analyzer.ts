import {
    CODEMOD_TSCONFIGS,
    inRepo,
    lineOf,
    programFor,
    relPath,
    repoSourceFiles,
    toPosix,
} from "../selectors/program.selector.ts";
import { ambiguousTarget, missingTarget } from "../strings/codemod.strings.ts";
import { basename, dirname, extname, relative, resolve } from "node:path";
import type { SpecifierFinding } from "../../types/analyzer.types.ts";
import { existsSync } from "node:fs";
import { memberOf } from "./specifier.analyzer.ts";
import { specifierNodes } from "../../shared/selectors/specifier.selector.ts";
import ts from "typescript";

const CURRENT = ".";
const SEPARATOR = "/";
const QUERY = "?";

export const filePartOf = function filePartOf(specifier: string): string {
    const query = specifier.indexOf(QUERY);
    return query === -1 ? specifier : specifier.slice(0, query);
};

export const targetCandidates = function targetCandidates(specifier: string, files: readonly string[]): string[] {
    const name = basename(filePartOf(specifier));
    const bare = extname(name).length === 0;
    return files.filter((file) => {
        const candidate = basename(file);
        return candidate === name || (bare && basename(candidate, extname(candidate)) === name);
    });
};

export const relocatedSpecifier = function relocatedSpecifier(
    fromFile: string,
    specifier: string,
    target: string,
): string {
    const folder = toPosix(relative(dirname(fromFile), dirname(target)));
    if (folder.length === 0) {
        return `${CURRENT}${SEPARATOR}${basename(specifier)}`;
    }
    const prefix = folder.startsWith(CURRENT) ? folder : `${CURRENT}${SEPARATOR}${folder}`;
    return `${prefix}${SEPARATOR}${basename(specifier)}`;
};

const reasonFor = function reasonFor(specifier: string, candidates: readonly string[]): string | null {
    if (candidates.length === 0) {
        return missingTarget(specifier, basename(filePartOf(specifier)));
    }
    return candidates.length > 1 ? ambiguousTarget(specifier, candidates.map(relPath)) : null;
};

const specifierTargetExists = function specifierTargetExists(
    source: ts.SourceFile,
    specifier: string,
    options: ts.CompilerOptions,
): boolean {
    if (existsSync(resolve(dirname(source.fileName), filePartOf(specifier)))) {
        return true;
    }
    return ts.resolveModuleName(specifier, source.fileName, options, ts.sys).resolvedModule !== undefined;
};

const findingFor = function findingFor(
    program: ts.Program,
    source: ts.SourceFile,
    literal: ts.StringLiteral,
): SpecifierFinding | null {
    const specifier = literal.text;
    if (!specifier.startsWith(CURRENT) || specifierTargetExists(source, specifier, program.getCompilerOptions())) {
        return null;
    }
    const member = memberOf(relPath(source.fileName));
    if (member === null) {
        return null;
    }
    const inMember = program
        .getRootFileNames()
        .filter((file) => inRepo(file) && memberOf(relPath(file))?.rel === member.rel);
    const candidates = targetCandidates(specifier, inMember);
    const [only] = candidates;
    const reason = reasonFor(specifier, candidates);
    return {
        end: literal.getEnd() - 1,
        file: relPath(source.fileName),
        from: specifier,
        line: lineOf(source, literal),
        reason,
        start: literal.getStart(source) + 1,
        to: only === undefined || reason !== null ? specifier : relocatedSpecifier(source.fileName, specifier, only),
    };
};

const findingsInProgram = function findingsInProgram(tsconfig: string): SpecifierFinding[] {
    const program = programFor(tsconfig);
    return repoSourceFiles(program).flatMap((source) =>
        specifierNodes(source)
            .map((literal) => findingFor(program, source, literal))
            .filter((finding): finding is SpecifierFinding => finding !== null),
    );
};

export const collectTargetFindings = function collectTargetFindings(): SpecifierFinding[] {
    const seen = new Set<string>();
    return CODEMOD_TSCONFIGS.flatMap(findingsInProgram).filter((finding) => {
        const key = `${finding.file}:${String(finding.start)}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};
