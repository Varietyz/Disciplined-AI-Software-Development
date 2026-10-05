import {
    ANATOMY_TREE_LABEL,
    anatomyLine,
    lostReference,
    lostReferencesLine,
    treeSummaryLine,
    unlabeledTree,
} from "#configuration/strings/anatomy.strings";
import type { AnatomyScope, DerivedTree, ReferenceSite, TreeOptions } from "#types/anatomy.types";
import type { AnatomySnapshot, AnatomyTreeDeclaration } from "@banes-lab/web/types/anatomy.types.js";
import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import { buildContext, buildModuleReport, discoverModules } from "@govlab/patterns";
import { convertAnatomy, countFolders, referencedTrees, withRepository } from "#core/converters/anatomy.converter";
import { currentCandidates, exactReferencesOf, lostReferences } from "#core/converters/baseline.converter";
import { documentsOf, filesOf } from "#core/converters/document.converter";
import { persistBaseline, readBaseline } from "#core/persistence/baseline.persistence";
import { readDeclaredTree, treeDeclarations } from "#core/loaders/tree.loader";
import { renderAnatomy, renderAnatomyMeasures } from "#core/formatters/anatomy.formatter";
import { TREE_TAB } from "@banes-lab/web/ids/anatomy.ids";
import { UNQUALIFIED } from "#configuration/constants/anatomy.constants";
import { anatomyMeasures } from "#core/converters/metric.converter";
import { chartsOf } from "#core/converters/figure.converter";
import { createWalkAssets } from "#core/factories/walk.factory";
import { docsHostFor } from "@govlab/docs";
import { excludeMatcher } from "@govlab/quality/config";
import { extractConfigs } from "#core/coordinators/config.coordinator";
import { importEdgesOf } from "#core/converters/specifier.converter";
import { join } from "node:path";
import { persistTreeDeclarations } from "#core/persistence/tree.persistence";
import process from "node:process";
import { qualifiedSnapshot } from "#core/converters/snapshot.converter";
import { qualifyWalks } from "#core/converters/walk.converter";
import { replaceFolderFiles } from "#core/persistence/asset.persistence";
import { withInherited } from "#core/loaders/heritage.loader";
import { writeCanonicalText } from "@govlab/canonical-write";

const deriveTree = async function deriveTree(
    source: AnatomyTreeDeclaration,
    scope: AnatomyScope,
): Promise<AnatomySnapshot> {
    const moduleDir = join(ROOT, source.folder);
    const report = { pruned: scope.pruned, root: ROOT };
    const { built, entries } = await buildModuleReport(moduleDir, scope.context, report);
    const tree = withInherited(moduleDir, readDeclaredTree(source, scope.pruned));
    const snapshot = convertAnatomy(
        {
            cells: built.cells,
            charts: await chartsOf(moduleDir, source.tab === TREE_TAB ? ANATOMY_TREE_LABEL : source.tab),
            documents: documentsOf(tree, scope.host, moduleDir),
            entries,
            generatedSources: source.generatedSources,
            imports:
                scope.options.specifiers === null ? [] : await importEdgesOf(filesOf(tree), scope.options.specifiers),
            report: built.report,
            tree,
            vectors: built.svgs,
        },
        scope.assets,
    );
    const { repository, tab } = source;
    const linked =
        repository === null
            ? snapshot
            : { ...snapshot, tree: withRepository(snapshot.tree, repository, source.generatedSources) };
    if (tab === TREE_TAB) {
        return linked;
    }
    const qualify = function qualify(path: string): string {
        return scope.options.qualifyPath(tab, path);
    };
    qualifyWalks(linked.tree, qualify, scope.assets);
    return qualifiedSnapshot(linked, qualify);
};

export const buildAnatomy = async function buildAnatomy(
    options: TreeOptions = UNQUALIFIED,
): Promise<readonly DerivedTree[]> {
    await extractConfigs();
    const pruned = await excludeMatcher(ROOT);
    const scope: AnatomyScope = {
        assets: createWalkAssets(),
        context: await buildContext(discoverModules(ROOT, pruned), { pruned, root: ROOT }),
        host: await docsHostFor(ROOT),
        options,
        pruned,
    };
    const declarations = treeDeclarations();
    await persistTreeDeclarations(declarations);
    const derived = await declarations.reduce<Promise<readonly DerivedTree[]>>(async (previous, source) => {
        const done = await previous;
        const snapshot = await deriveTree(source, scope);
        return [...done, { exportName: source.exportName, snapshot, tab: source.tab }];
    }, Promise.resolve([]));
    const sites = new Map<string, ReferenceSite>();
    const trees = referencedTrees(derived, options, scope.assets, sites);
    const baselineFile = absolutePath("app.baseline");
    const lost = lostReferences(readBaseline(baselineFile), sites);
    if (lost.length > 0) {
        const lines = lost.map((entry) =>
            lostReference(entry.path, entry.channel, entry.text, currentCandidates(entry, sites)),
        );
        throw new Error(lostReferencesLine(lines));
    }
    await persistBaseline(baselineFile, exactReferencesOf(sites));
    await writeCanonicalText(absolutePath("app.anatomy"), renderAnatomy(trees));
    const labels = new Map(declarations.map((declaration) => [declaration.tab, declaration.label]));
    const measures = anatomyMeasures(trees, (tab) => {
        const label = labels.get(tab);
        if (label === undefined) {
            throw new Error(unlabeledTree(tab));
        }
        return label;
    });
    await writeCanonicalText(absolutePath("app.anatomyMeasures"), renderAnatomyMeasures(measures));
    replaceFolderFiles(absolutePath("app.walks"), scope.assets.walks);
    replaceFolderFiles(absolutePath("app.sources"), scope.assets.sources);
    return trees;
};

export const deriveAnatomy = async function deriveAnatomy(options: TreeOptions = UNQUALIFIED): Promise<void> {
    const trees = await buildAnatomy(options);
    process.stdout.write(
        anatomyLine(
            trees.map((tree) => treeSummaryLine(tree, countFolders(tree.snapshot.tree))),
            {
                anatomy: relativePath("app.anatomy"),
                sources: relativePath("app.sources"),
                walks: relativePath("app.walks"),
            },
        ),
    );
};
