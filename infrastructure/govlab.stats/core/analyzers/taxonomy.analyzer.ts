import type {
    AssessedFile,
    ContainerStat,
    RootScan,
    TaxonomyRootStats,
    TaxonomyStats,
    UngovernedArea,
} from "#types/taxonomy.types";
import {
    containersFor,
    governedRoots,
    isIgnoredName,
    isSpecialContainer,
    layerFor,
    rootFor,
    vocabularyFor,
} from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import { extensionOf, posixOf } from "#core/selectors/source.selector";
import { isAuthoredRole, roleOf } from "#core/classifiers/source.classifier";
import { isExempt, isParsed, parseFilename } from "@ssot/govlab/shared/matchers/filename.matcher.ts";
import { memberIndex, ownerOf } from "#core/resolvers/package.resolver";
import type { PathExclusion } from "@govlab/quality/config";
import { isGeneratedPath } from "#core/predicates/source.predicate";
import path from "node:path";
import { vocabularyRows } from "#core/converters/taxonomy.converter";
import { walkFiles } from "#core/loaders/folder.loader";

const isAssessable = function isAssessable(abs: string, root?: string): boolean {
    const name = path.basename(abs);
    const role = roleOf(extensionOf(name));
    return !isIgnoredName(name, root) && isAuthoredRole(role) && !isGeneratedPath(abs, abs);
};

const bump = function bump<K>(counts: Map<K, number>, key: K): void {
    counts.set(key, (counts.get(key) ?? 0) + 1);
};

const assessedUnder = function assessedUnder(
    workspaceRoot: string,
    root: string,
    ignore: PathExclusion,
): AssessedFile[] {
    const base = path.join(workspaceRoot, root);
    return walkFiles(base, ignore)
        .filter((abs) => rootFor(posixOf(path.relative(workspaceRoot, abs))) === root && isAssessable(abs, root))
        .map((abs) => {
            const segments = path.relative(base, abs).split(path.sep);
            return { abs, folders: segments.slice(0, -1), name: segments.at(-1) ?? "" };
        });
};

const scanRoot = function scanRoot(workspaceRoot: string, root: string, ignore: PathExclusion): RootScan {
    const vocabulary = vocabularyFor(root);
    const scan: RootScan = {
        layerHits: new Map(),
        stats: {
            assessed: 0,
            conformant: 0,
            containers: [],
            declared: containersFor(root).length,
            depth: new Map(),
            overCap: 0,
            present: 0,
            root,
        },
        usedConcerns: new Set(),
        usedSubjects: new Set(),
        usedVariants: new Set(),
    };
    const perContainer = new Map<string, number>();
    for (const file of assessedUnder(workspaceRoot, root, ignore)) {
        scan.stats.assessed += 1;
        bump(scan.stats.depth, file.folders.length);
        scan.stats.overCap += file.folders.length > vocabulary.maxDepth ? 1 : 0;
        const [container] = file.folders;
        if (container !== undefined) {
            bump(perContainer, container);
        }
        const parsed = parseFilename(file.name, root);
        scan.stats.conformant += isParsed(parsed) || isExempt(parsed) ? 1 : 0;
        if (isParsed(parsed)) {
            scan.usedConcerns.add(parsed.concern);
            scan.usedSubjects.add(parsed.subject);
            if (parsed.variant !== null) {
                scan.usedVariants.add(parsed.variant);
            }
            bump(scan.layerHits, layerFor(parsed.concern, root) ?? "");
        }
    }
    scan.stats.containers = [...perContainer.entries()]
        .map(([name, files]): ContainerStat => ({
            files,
            kind: isSpecialContainer(root, name) ? "bucket" : "declared",
            name,
        }))
        .toSorted((a, b) => b.files - a.files);
    scan.stats.present = scan.stats.containers.length;
    return scan;
};

const isClaimed = function isClaimed(rel: string, claims: readonly string[]): boolean {
    return claims.some((claim) => rel === claim || rel.startsWith(`${claim}/`));
};

const collectUngoverned = function collectUngoverned(
    workspaceRoot: string,
    ignore: PathExclusion,
    claims: readonly string[],
): UngovernedArea[] {
    const members = memberIndex(workspaceRoot);
    const counts = new Map<string, number>();
    for (const abs of walkFiles(workspaceRoot, ignore)) {
        const rel = posixOf(path.relative(workspaceRoot, abs));
        if (rootFor(rel) === undefined && !isClaimed(rel, claims) && isAssessable(abs)) {
            bump(counts, ownerOf(members, rel) ?? rel.split("/").at(0) ?? "");
        }
    }
    return [...counts.entries()].map(([area, files]) => ({ area, files })).toSorted((a, b) => b.files - a.files);
};

const sumOf = function sumOf(roots: readonly TaxonomyRootStats[], pick: (root: TaxonomyRootStats) => number): number {
    return roots.reduce((total, root) => total + pick(root), 0);
};

export const collectTaxonomy = function collectTaxonomy(
    workspaceRoot: string,
    ignore: PathExclusion,
    claims: readonly string[],
): TaxonomyStats {
    const host = vocabularyFor();
    const scans = governedRoots().map((root) => scanRoot(workspaceRoot, root, ignore));
    const roots = scans.map((scan) => scan.stats).toSorted((a, b) => b.assessed - a.assessed);
    const layerTotals = new Map<string, number>();
    for (const [layer, hits] of scans.flatMap((scan) => [...scan.layerHits])) {
        layerTotals.set(layer, (layerTotals.get(layer) ?? 0) + hits);
    }
    const layers = [...new Set([...host.byTag.values()].map((concern) => concern.layer))];
    const ungoverned = collectUngoverned(workspaceRoot, ignore, claims);
    const declared = sumOf(roots, (root) => root.declared);
    const present = sumOf(roots, (root) => root.present);
    return {
        layers: layers
            .map((layer) => ({ files: layerTotals.get(layer) ?? 0, layer }))
            .toSorted((a, b) => b.files - a.files),
        maxDepth: host.maxDepth,
        roots,
        totals: {
            assessed: sumOf(roots, (root) => root.assessed),
            atRoot: sumOf(roots, (root) => root.depth.get(0) ?? 0),
            conformant: sumOf(roots, (root) => root.conformant),
            declared,
            overCap: sumOf(roots, (root) => root.overCap),
            present,
        },
        ungoverned,
        ungovernedFiles: ungoverned.reduce((sum, area) => sum + area.files, 0),
        vocabulary: vocabularyRows(host, scans, { declared, layerTotals, layers: layers.length, present }),
    };
};
