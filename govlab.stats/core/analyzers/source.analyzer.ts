import type {
    Bucket,
    ExcludedObservation,
    FileClass,
    FileRole,
    LineCount,
    Observation,
    ScanScope,
    State,
    Walk,
} from "#types/source.types";
import { LARGEST_KEEP, MANIFEST_FILE, MAX_TEXT_BYTES, ROOT_AREA } from "#configuration/constants/source.constants";
import { isAuthoredRole, roleOf } from "#core/classifiers/source.classifier";
import { isBinaryBuffer, isGeneratedHead, isGeneratedPath, isTestFile } from "#core/predicates/source.predicate";
import { readFileSync, statSync } from "node:fs";
import { countLines } from "#core/analyzers/text.analyzer";
import { extensionOf } from "#core/selectors/source.selector";
import { ownerOf } from "#core/resolvers/package.resolver";
import path from "node:path";
import { readdirSafe } from "#core/loaders/folder.loader";
import { relativePath } from "@ssot/paths";

const EMPTY_LINES: LineCount = { blank: 0, code: 0, total: 0 };

const areaOf = function areaOf(relPath: string, members: readonly string[]): string {
    const parts = relPath.split(path.sep);
    if (parts.length === 1) {
        return ROOT_AREA;
    }
    return ownerOf(members, relPath) ?? parts.at(0) ?? ROOT_AREA;
};

const classOf = function classOf(abs: string, rel: string, text: string, role: FileRole): FileClass {
    if (isGeneratedPath(abs, rel) || isGeneratedHead(text)) {
        return "generated";
    }
    return isAuthoredRole(role) ? "authored" : "ingested";
};

const observe = function observe(scope: ScanScope, abs: string, name: string): Observation {
    const { size } = statSync(abs);
    const rel = path.relative(scope.root, abs);
    const ext = extensionOf(name);
    const role = roleOf(ext);
    const buffer = size > MAX_TEXT_BYTES ? null : readFileSync(abs);
    const binary = buffer === null || isBinaryBuffer(buffer);
    const text = binary ? "" : buffer.toString("utf8");
    return {
        area: areaOf(rel, scope.members),
        class: binary ? "binary" : classOf(abs, rel, text, role),
        ext,
        lines: binary ? EMPTY_LINES : countLines(text),
        manifest: name === MANIFEST_FILE,
        rel,
        role,
        size,
        test: isTestFile(name, rel, relativePath("codebase.testing")),
    };
};

const walk = function walk(scope: ScanScope, absDir: string): Walk {
    const walks = readdirSafe(absDir).map((entry): Walk => {
        const abs = path.join(absDir, entry.name);
        if (entry.isDirectory() && !scope.ignore(abs)) {
            const inner = walk(scope, abs);
            return { dirs: inner.dirs + 1, files: inner.files };
        }
        return { dirs: 0, files: entry.isFile() ? [observe(scope, abs, entry.name)] : [] };
    });
    return { dirs: walks.reduce((sum, inner) => sum + inner.dirs, 0), files: walks.flatMap((inner) => inner.files) };
};

const bucketsBy = function bucketsBy<F extends Observation, K>(
    files: readonly F[],
    keyOf: (file: F) => K,
): Map<K, Bucket> {
    const buckets = new Map<K, Bucket>();
    for (const file of files) {
        const bucket = buckets.get(keyOf(file)) ?? { blank: 0, bytes: 0, code: 0, files: 0, total: 0 };
        buckets.set(keyOf(file), {
            blank: bucket.blank + file.lines.blank,
            bytes: bucket.bytes + file.size,
            code: bucket.code + file.lines.code,
            files: bucket.files + 1,
            total: bucket.total + file.lines.total,
        });
    }
    return buckets;
};

const sumOf = function sumOf(files: readonly Observation[], pick: (file: Observation) => number): number {
    return files.reduce((sum, file) => sum + pick(file), 0);
};

export const runScan = function runScan(scope: ScanScope): State {
    const { dirs, files } = walk(scope, scope.root);
    const authored = files.filter((file) => file.class === "authored");
    const excluded = files.filter((file): file is ExcludedObservation => file.class !== "authored");
    const sources = authored.filter((file) => file.role === "source");
    return {
        authored: bucketsBy(authored, (file) => file.role),
        byArea: bucketsBy(authored, (file) => file.area),
        byExt: bucketsBy(authored, (file) => file.ext),
        bytes: sumOf(files, (file) => file.size),
        dirs,
        excluded: bucketsBy(excluded, (file) => file.class),
        fileLineCounts: sources.map((file) => file.lines.total),
        files: files.length,
        largest: sources
            .map((file) => ({ lines: file.lines.total, path: file.rel }))
            .toSorted((a, b) => b.lines - a.lines)
            .slice(0, LARGEST_KEEP),
        lines: {
            blank: sumOf(authored, (file) => file.lines.blank),
            code: sumOf(authored, (file) => file.lines.code),
            total: sumOf(authored, (file) => file.lines.total),
        },
        manifestFiles: files.filter((file) => file.manifest).length,
        maxDepth: files.reduce((deepest, file) => Math.max(deepest, file.rel.split(path.sep).length), 0),
        testFiles: files.filter((file) => file.test).length,
        textFiles: files.filter((file) => file.class !== "binary").length,
        unclassified: bucketsBy(
            excluded.filter((file) => file.class === "ingested" && file.role === "other"),
            (file) => file.ext,
        ),
    };
};
