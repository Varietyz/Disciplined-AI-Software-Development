import type { LiteralFinding, LiteralPair } from "../../types/analyzer.types.ts";
import { disjoint, parsesAsJson, splice } from "../selectors/edit.selector.ts";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { MASTER_EXCLUDE_MARKERS } from "../../shared/generated/exclusions.generated.ts";
import { ROOT } from "@ssot/paths";
import { isExcludedPath } from "@govlab/quality/core/matchers/exclusions.matcher.ts";
import path from "node:path";
import { relPath } from "../selectors/program.selector.ts";

const JSON_EXTENSION = ".json";
const NEWLINE = "\n";

const lineAt = function lineAt(content: string, index: number): number {
    return content.slice(0, index).split(NEWLINE).length;
};

const sitesOf = function sitesOf(content: string, pair: LiteralPair): number[] {
    const sites: number[] = [];
    let index = content.indexOf(pair.from);
    while (index !== -1) {
        sites.push(index);
        index = content.indexOf(pair.from, index + pair.from.length);
    }
    return sites;
};

export const literalFindingsIn = function literalFindingsIn(
    fileName: string,
    content: string,
    pairs: readonly LiteralPair[],
): LiteralFinding[] {
    const found = pairs.flatMap((pair) =>
        sitesOf(content, pair).map((start) => ({
            end: start + pair.from.length,
            file: relPath(fileName),
            fileName,
            from: pair.from,
            line: lineAt(content, start),
            reason: null,
            start,
            to: pair.to,
        })),
    );
    if (found.length === 0 || path.extname(fileName) !== JSON_EXTENSION) {
        return found;
    }
    const edits = disjoint(
        found
            .map((finding) => ({ end: finding.end, replacement: finding.to, start: finding.start }))
            .toSorted((a, b) => b.start - a.start),
    );
    if (parsesAsJson(splice(content, edits))) {
        return found;
    }
    const reason = `replacing every match in ${relPath(fileName)} leaves it unparsable as JSON, so the file is left unchanged`;
    return found.map((finding) => ({ ...finding, reason }));
};

const isExcluded = function isExcluded(full: string): boolean {
    return isExcludedPath(path.relative(ROOT, full), MASTER_EXCLUDE_MARKERS);
};

const filesUnder = function filesUnder(target: string): string[] {
    if (!statSync(target).isDirectory()) {
        return [target];
    }
    return readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(target, entry.name);
        if (isExcluded(full)) {
            return [];
        }
        return entry.isDirectory() ? filesUnder(full) : [full];
    });
};

export const collectLiteralFindings = function collectLiteralFindings(
    roots: readonly string[],
    pairs: readonly LiteralPair[],
    extensions: readonly string[],
): LiteralFinding[] {
    const wanted = (fileName: string): boolean =>
        extensions.length === 0 || extensions.includes(path.extname(fileName));
    return roots
        .flatMap((root) => filesUnder(path.resolve(ROOT, root)))
        .filter(wanted)
        .flatMap((fileName) => literalFindingsIn(fileName, readFileSync(fileName, "utf8"), pairs));
};
