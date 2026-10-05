import type {
    AnatomyFile,
    AnatomyFolder,
    AnatomySnapshot,
    DefinitionView,
    DocumentView,
    FindingView,
} from "@banes-lab/web/types/anatomy.types.js";
import type {
    AnatomyInputs,
    DerivedTree,
    RecordReader,
    ReferenceReader,
    ReferenceSite,
    TreeOptions,
    WalkAssets,
} from "#types/anatomy.types";
import type { DiskFile, DiskFolder } from "#types/structure.types";
import { type FileEntry, STATE_LEGEND, syntaxDistribution } from "@govlab/patterns";
import { definitionsByFile, fileStatsOf, findingView, flaggedOf } from "#core/converters/report.converter";
import { fileLayerOf, folderLayerOf, slotsOf, sumStats } from "#core/converters/structure.converter";
import { fileWalkOf, folderWalkOf, recordsAssetOf, referencesAssetOf, sourceOf } from "#core/converters/walk.converter";
import { isPublished } from "#core/predicates/exclusion.predicate";

const PATH_SEPARATOR = "/";

interface Lookups {
    readonly assets: WalkAssets;
    readonly documents: ReadonlyMap<string, DocumentView>;
    readonly definitions: ReadonlyMap<string, readonly DefinitionView[]>;
    readonly edgesByFile: ReadonlyMap<string, number>;
    readonly entries: ReadonlyMap<string, FileEntry>;
    readonly findingsByFile: ReadonlyMap<string, readonly FindingView[]>;
    readonly flagged: ReadonlyMap<string, string>;
    readonly inputs: AnatomyInputs;
}

const groupBy = function groupBy<T>(items: readonly T[], keyOf: (item: T) => string): Map<string, T[]> {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        groups.set(keyOf(item), [...(groups.get(keyOf(item)) ?? []), item]);
    }
    return groups;
};

const countBy = function countBy<T>(items: readonly T[], keyOf: (item: T) => string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const item of items) {
        counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1);
    }
    return counts;
};

const lookupsOf = function lookupsOf(inputs: AnatomyInputs, assets: WalkAssets): Lookups {
    return {
        assets,
        definitions: definitionsByFile(inputs.report),
        documents: inputs.documents,
        edgesByFile: countBy(inputs.report.edges, (edge) => edge.file),
        entries: new Map(inputs.entries.map((entry) => [entry.rel, entry])),
        findingsByFile: groupBy(inputs.report.findings.map(findingView), (finding) => finding.file),
        flagged: flaggedOf(inputs.report.findings),
        inputs,
    };
};

const isHiddenSource = function isHiddenSource(
    file: DiskFile,
    document: DocumentView | null,
    generatedSources: boolean,
): boolean {
    return file.excluded !== undefined || (file.generated && document === null && !generatedSources);
};

const fileOf = function fileOf(lookups: Lookups, file: DiskFile, root?: string): AnatomyFile {
    const definitions = lookups.definitions.get(file.path) ?? [];
    const findings = lookups.findingsByFile.get(file.path) ?? [];
    const entry = lookups.entries.get(file.path);
    const slots = slotsOf(file.name, root);
    const document = lookups.documents.get(file.path) ?? null;
    const hidden = isHiddenSource(file, document, lookups.inputs.generatedSources === true);
    return {
        definitions,
        distribution: syntaxDistribution(entry?.records ?? []),
        document,
        ...(file.excluded === undefined ? {} : { excluded: file.excluded }),
        findings,
        generated: file.generated,
        id: file.path,
        inherited: file.inherited,
        layer: fileLayerOf(slots, root),
        name: file.name,
        path: file.path,
        slots,
        source: hidden ? null : sourceOf(lookups.assets, file.text),
        stats: fileStatsOf(file, definitions, lookups.edgesByFile.get(file.path) ?? 0, findings),
        walk: fileWalkOf(lookups.assets, entry, lookups.flagged),
    };
};

const folderOf = function folderOf(lookups: Lookups, folder: DiskFolder): AnatomyFolder {
    const folders = folder.folders.map((child) => folderOf(lookups, child));
    const files = folder.files.map((file) => fileOf(lookups, file, folder.governedBy));
    return {
        files,
        findings: [...folders.flatMap((child) => child.findings), ...files.flatMap((file) => file.findings)],
        folders,
        id: folder.path,
        layer: folderLayerOf(folder),
        name: folder.name,
        path: folder.path,
        role: folder.role,
        stats: sumStats([...folders.map((child) => child.stats), ...files.map((file) => file.stats)]),
        walk: folderWalkOf(lookups.assets, folder.path, lookups.inputs.vectors, lookups.inputs.cells),
    };
};

export const convertAnatomy = function convertAnatomy(inputs: AnatomyInputs, assets: WalkAssets): AnatomySnapshot {
    const lookups = lookupsOf(inputs, assets);
    return {
        charts: inputs.charts,
        findings: inputs.report.findings.map(findingView),
        imports: inputs.imports,
        metrics: inputs.report.metrics,
        states: STATE_LEGEND.map((item) => ({ state: item.state, text: item.text })),
        tree: folderOf(lookups, inputs.tree),
        unresolvedCalls: inputs.report.unresolvedCalls,
    };
};

const repositoryPath = function repositoryPath(base: string, path: string): string {
    return path.length === 0 ? base : base + PATH_SEPARATOR + path;
};

export const withRepository = function withRepository(
    folder: AnatomyFolder,
    base: string,
    generatedSources: boolean,
): AnatomyFolder {
    return {
        ...folder,
        files: folder.files.map((file) =>
            isPublished(file, generatedSources) ? { ...file, repository: repositoryPath(base, file.path) } : file,
        ),
        folders: folder.folders.map((child) => withRepository(child, base, generatedSources)),
        repository: repositoryPath(base, folder.path),
    };
};

interface ReferenceScope {
    readonly assets: WalkAssets;
    readonly read: ReferenceReader;
    readonly sites: Map<string, ReferenceSite>;
}

const withReferences = function withReferences(folder: AnatomyFolder, scope: ReferenceScope): AnatomyFolder {
    return {
        ...folder,
        files: folder.files.map((file) => {
            const text = file.source === null ? undefined : scope.assets.sources.get(file.source);
            if (text === undefined) {
                return file;
            }
            const references = scope.read(file.path, text, file.document !== null);
            scope.sites.set(file.path, { references, source: text });
            return { ...file, references: referencesAssetOf(scope.assets, references) };
        }),
        folders: folder.folders.map((child) => withReferences(child, scope)),
    };
};

const withRecords = function withRecords(folder: AnatomyFolder, read: RecordReader, assets: WalkAssets): AnatomyFolder {
    return {
        ...folder,
        files: folder.files.map((file) => ({ ...file, records: recordsAssetOf(assets, read.file(file)) })),
        folders: folder.folders.map((child) => withRecords(child, read, assets)),
        records: recordsAssetOf(assets, read.folder(folder)),
    };
};

const recordedTrees = function recordedTrees(
    trees: readonly DerivedTree[],
    options: TreeOptions,
    assets: WalkAssets,
): readonly DerivedTree[] {
    if (options.record === null) {
        return trees;
    }
    const read = options.record(trees.map((tree) => tree.snapshot.tree));
    return trees.map((tree) => ({
        ...tree,
        snapshot: { ...tree.snapshot, tree: withRecords(tree.snapshot.tree, read, assets) },
    }));
};

export const referencedTrees = function referencedTrees(
    trees: readonly DerivedTree[],
    options: TreeOptions,
    assets: WalkAssets,
    sites: Map<string, ReferenceSite>,
): readonly DerivedTree[] {
    if (options.refer === null) {
        return recordedTrees(trees, options, assets);
    }
    const scope = { assets, read: options.refer(trees.map((tree) => tree.snapshot.tree)), sites };
    const referenced = trees.map((tree) => ({
        ...tree,
        snapshot: { ...tree.snapshot, tree: withReferences(tree.snapshot.tree, scope) },
    }));
    return recordedTrees(referenced, options, assets);
};

export const countFolders = function countFolders(folder: AnatomySnapshot["tree"]): number {
    return folder.folders.reduce((sum, child) => sum + 1 + countFolders(child), 0);
};
