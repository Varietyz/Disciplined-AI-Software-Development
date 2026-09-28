import {
    CODEMOD_TSCONFIGS,
    inRepo,
    lineOf,
    programFor,
    relPath,
    repoSourceFiles,
    toPosix,
} from "../selectors/program.selector.ts";
import type { SpecifierFinding, WorkspaceMember } from "../../types/analyzer.types.ts";
import { isManifestRecord, manifestAt, memberRels } from "../../shared/loaders/manifest.loader.ts";
import { ROOT } from "@ssot/paths";
import path from "node:path";
import { specifierNodes } from "../../shared/selectors/specifier.selector.ts";
import type ts from "typescript";

const ROOT_POSIX = toPosix(ROOT);

const manifestOf = function manifestOf(memberRel: string): WorkspaceMember {
    const { exports, name } = manifestAt(path.join(ROOT, memberRel));
    return {
        exports: isManifestRecord(exports) ? exports : null,
        name: typeof name === "string" ? name : "",
        rel: memberRel,
    };
};

const buildMembers = function buildMembers(): WorkspaceMember[] {
    return memberRels()
        .map(manifestOf)
        .toSorted((a, b) => b.rel.length - a.rel.length);
};

const MEMBERS = buildMembers();

export const memberOf = function memberOf(relative: string): WorkspaceMember | null {
    return MEMBERS.find((member) => relative === member.rel || relative.startsWith(`${member.rel}/`)) ?? null;
};

const exactMatch = function exactMatch(
    member: WorkspaceMember,
    entries: [string, unknown][],
    subpath: string,
): string | null {
    const hit = entries.find(
        ([key, target]) => typeof target === "string" && !key.includes("*") && target === `./${subpath}`,
    );
    if (hit === undefined) {
        return null;
    }
    const [key] = hit;
    return key === "." ? member.name : `${member.name}${key.slice(1)}`;
};

const patternMatch = function patternMatch(
    member: WorkspaceMember,
    entries: [string, unknown][],
    subpath: string,
): string | null {
    for (const [key, target] of entries) {
        if (typeof target !== "string" || !key.includes("*")) {
            continue;
        }
        const targetPrefix = target.slice(2, target.indexOf("*"));
        if (subpath.startsWith(targetPrefix)) {
            const keyPrefix = key.slice(2, key.indexOf("*"));
            return `${member.name}/${keyPrefix}${subpath.slice(targetPrefix.length)}`;
        }
    }
    return null;
};

const publishedSpecifier = function publishedSpecifier(member: WorkspaceMember, subpath: string): string | null {
    if (member.name.length === 0) {
        return null;
    }
    if (member.exports === null) {
        return `${member.name}/${subpath}`;
    }
    const entries = Object.entries(member.exports);
    return exactMatch(member, entries, subpath) ?? patternMatch(member, entries, subpath);
};

const findingFor = function findingFor(source: ts.SourceFile, literal: ts.StringLiteral): SpecifierFinding | null {
    const specifier = literal.text;
    if (!specifier.startsWith(".")) {
        return null;
    }
    const fileRel = relPath(source.fileName);
    const from = memberOf(fileRel);
    if (from === null) {
        return null;
    }
    const absolute = toPosix(path.resolve(path.dirname(source.fileName), specifier));
    if (!absolute.startsWith(`${ROOT_POSIX}/`)) {
        return null;
    }
    const targetRel = absolute.slice(ROOT_POSIX.length + 1);
    const to = memberOf(targetRel);
    if (to === null || to.rel === from.rel) {
        return null;
    }
    const published = publishedSpecifier(to, targetRel.slice(to.rel.length + 1));
    return {
        end: literal.getEnd() - 1,
        file: fileRel,
        from: specifier,
        line: lineOf(source, literal),
        reason:
            published === null
                ? `'${to.name.length > 0 ? to.name : to.rel}' publishes no subpath covering '${targetRel.slice(to.rel.length + 1)}' — add the pattern to its exports map`
                : null,
        start: literal.getStart(source) + 1,
        to: published ?? specifier,
    };
};

const findingsInSource = function findingsInSource(source: ts.SourceFile): SpecifierFinding[] {
    return specifierNodes(source)
        .map((literal) => findingFor(source, literal))
        .filter((finding): finding is SpecifierFinding => finding !== null);
};

const findingsInProgram = function findingsInProgram(tsconfig: string): SpecifierFinding[] {
    return repoSourceFiles(programFor(tsconfig))
        .filter((source) => inRepo(source.fileName))
        .flatMap(findingsInSource);
};

export const collectSpecifierFindings = function collectSpecifierFindings(): SpecifierFinding[] {
    const seen = new Set<string>();
    const isFirstAtSite = function isFirstAtSite(finding: SpecifierFinding): boolean {
        const key = `${finding.file}:${String(finding.start)}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    };
    return CODEMOD_TSCONFIGS.flatMap(findingsInProgram).filter(isFirstAtSite);
};
