import type { Document, Edit, Finding, Hit, RenameMap, Report, SegmentPattern } from "../types/segment.types.ts";
import {
    applyEdits,
    editsFromFieldPrefixes,
    editsFromFieldValues,
    editsFromInlinePrefixes,
    editsFromInlines,
} from "../transformers/segment.transformer.ts";
import { projectRoot, surfacePrefix } from "../../../config/surface.config.ts";
import { readSource, toPosix, walk } from "../iterators/file.iterator.ts";
import { rehearsalLine, segmentCounts, segmentSummary } from "../strings/segment.strings.ts";
import { toEditRecords, toHitRecords, verdictOf, writeReport } from "../reporters/segment.reporter.ts";
import { NO_FIX_FLAG } from "../constants/path.constants.ts";
import { REFERENCE_FIELDS } from "../matchers/reference.matcher.ts";
import { isStringMap } from "../predicates/schema.predicate.ts";
import { loadTaxonomy } from "../resolvers/taxonomy.resolver.ts";
import { matchAll } from "../matchers/segment.matcher.ts";
import { readDocument } from "../readers/document.reader.ts";
import { readJson } from "../readers/json.reader.ts";
import { resolve } from "node:path";
import { writeFileSync } from "node:fs";

const REPO_ROOT = projectRoot();

export const RESTATES: readonly string[] = [
    "mutation_preview_first",
    "healing_is_default_in_every_entrypoint",
    "pattern_references_verified_after_rename",
];

const PATTERNS: SegmentPattern[] = [
    { id: "record-cross-reference", predicates: [{ keyEquals: "see", kind: "field" }] },
    { id: "record-source-pointer", predicates: [{ keyEquals: "source", kind: "field", valueStartsWith: "local:" }] },
    { id: "import-directive", predicates: [{ inlineKind: "import-path" }] },
    {
        id: "record-header",
        predicates: [
            { depthEquals: 3, kind: "heading" },
            { keyEquals: "type", kind: "field" },
        ],
    },
];

interface Args {
    readonly scan: string | null;
    readonly renameMap: string | null;
    readonly apply: boolean;
    readonly patternId: string | null;
}

interface Scanned {
    readonly hits: readonly Hit[];
    readonly edits: readonly Edit[];
    readonly extension: string;
}

const valueAfter = function valueAfter(argv: readonly string[], flag: string): string | null {
    const at = argv.lastIndexOf(flag);
    return at === -1 ? null : (argv[at + 1] ?? null);
};

const parseArgs = function parseArgs(argv: readonly string[]): Args {
    return {
        apply: !argv.includes(NO_FIX_FLAG),
        patternId: valueAfter(argv, "--pattern"),
        renameMap: valueAfter(argv, "--rename"),
        scan: valueAfter(argv, "--scan"),
    };
};

const renameEdits = function renameEdits(document: Document, map: RenameMap): Edit[] {
    return [
        ...editsFromInlines(document, map, ["link-target", "inline-code", "import-path"]),
        ...REFERENCE_FIELDS.flatMap((key) => editsFromFieldValues(document, key, map)),
        ...editsFromFieldPrefixes(document, REFERENCE_FIELDS, map),
        ...editsFromInlinePrefixes(document, map, ["link-target", "inline-code"]),
    ];
};

const scanFile = function scanFile(file: string, patterns: readonly SegmentPattern[], map: RenameMap | null): Scanned {
    const relPath = toPosix(REPO_ROOT, file);
    const dot = relPath.lastIndexOf(".");
    const document = readDocument(relPath, readSource(file));
    return {
        edits: map === null ? [] : renameEdits(document, map),
        extension: dot === -1 ? "(none)" : relPath.slice(dot),
        hits: matchAll(document, patterns),
    };
};

const applyByPath = function applyByPath(edits: readonly Edit[]): Edit[] {
    const byPath = Map.groupBy(edits, (edit) => edit.path);
    return [...byPath].flatMap(([relPath, fileEdits]) => {
        const absolute = resolve(REPO_ROOT, relPath);
        const result = applyEdits(readSource(absolute), fileEdits);
        if (result.rejected.length === 0) {
            writeFileSync(absolute, result.text, "utf8");
        }
        return [...result.rejected];
    });
};

const overlapFinding = function overlapFinding(bad: Edit): Finding {
    return {
        actual: bad.reason,
        expected: null,
        healed: false,
        line: 0,
        locus: `bytes ${bad.start}..${bad.end}`,
        path: bad.path,
        remediation: {
            action: "split",
            decide: "two rename-map entries resolve to overlapping spans in this file — narrow one key so the spans are disjoint, then re-run",
            deterministic: false,
            from: bad.reason,
            target: bad.path,
            to: null,
        },
        rule: "segment/editOverlap",
        stack: [
            { check: "applyEdits", resolved: "right-to-left" },
            { check: "boundary", resolved: `edit end ${bad.end} crossed a prior edit start` },
        ],
    };
};

const renameMapOf = function renameMapOf(mapPath: string | null): RenameMap | null {
    return mapPath === null
        ? null
        : readJson(readSource(resolve(REPO_ROOT, mapPath)), isStringMap, mapPath, "RenameMap");
};

const extensionCounts = function extensionCounts(scanned: readonly Scanned[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const { extension } of scanned) {
        counts[extension] = (counts[extension] ?? 0) + 1;
    }
    return counts;
};

const main = function main(): void {
    const args = parseArgs(process.argv.slice(2));
    const root = resolve(REPO_ROOT, args.scan ?? surfacePrefix());
    const files = walk({ extensions: [".md", ".ts"], ignored: loadTaxonomy().ignored, root });
    const patterns = args.patternId === null ? PATTERNS : PATTERNS.filter((pattern) => pattern.id === args.patternId);
    const map = renameMapOf(args.renameMap);

    const scanned = files.map((file) => scanFile(file, patterns, map));
    const hits = scanned.flatMap((scan) => scan.hits);
    const edits = scanned.flatMap((scan) => scan.edits);
    const rehearsal = map !== null && !args.apply;
    const rejected = map !== null && args.apply ? applyByPath(edits) : [];
    const findings = rejected.map(overlapFinding);

    const report: Report = {
        coverage: { filesByExtension: extensionCounts(scanned), roots: [toPosix(REPO_ROOT, root) || "."] },
        edits: toEditRecords(edits),
        findings,
        hits: toHitRecords(hits),
        rejected: toEditRecords(rejected),
        scanned: files.length,
        tool: "segment",
        verdict: verdictOf(findings, rejected),
    };

    const target = writeReport(REPO_ROOT, "segment", report);
    const counts = segmentCounts(report.scanned, report.hits.length, report.edits.length, report.rejected.length);
    const rehearsed = rehearsal ? rehearsalLine(NO_FIX_FLAG) : "";

    process.stdout.write(segmentSummary(report.verdict.toUpperCase(), counts, toPosix(REPO_ROOT, target), rehearsed));

    process.exit(report.verdict === "pass" ? 0 : 1);
};

main();
