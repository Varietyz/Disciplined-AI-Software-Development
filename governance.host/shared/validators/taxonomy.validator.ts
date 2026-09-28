import {
    DUPLICATE_CONCERN_FOLDER,
    DUPLICATE_CONCERN_TAG,
    bucketNotConcern,
    containerAndBucket,
    doubleBoundExtension,
    duplicateContainer,
    duplicateSplitter,
    emptyRoot,
    extensionIgnore,
    malformedJoiner,
    markerFolderShadowsConcern,
    markerShadowsConcern,
    mirrorIsRoot,
    redundantSubject,
    shallowCap,
    unboundDialect,
    unboundMarkerFolder,
    unboundTestMarker,
    undeclaredBucketRoot,
    unknownMirrorSource,
    unknownSplitter,
    wildcardIgnore,
} from "../strings/taxonomy.strings.ts";
import type { TaxonomyView } from "../../types/taxonomy.types.ts";
import { isWellFormedJoiner } from "../matchers/segment.matcher.ts";

const MIN_DEPTH = 2;

const tagCountOf = function tagCountOf(view: TaxonomyView): number {
    return [...view.byFolder.values()].filter((concern) => concern.collection !== undefined).length + view.byFolder.size;
};

const assertConcerns = function assertConcerns(view: TaxonomyView, concernCount: number): void {
    if (view.byFolder.size !== concernCount) {
        throw new Error(DUPLICATE_CONCERN_FOLDER);
    }
    if (view.byTag.size !== tagCountOf(view)) {
        throw new Error(DUPLICATE_CONCERN_TAG);
    }
    for (const subject of view.subjects) {
        if (view.byTag.has(subject)) {
            throw new Error(redundantSubject(subject));
        }
    }
    for (const marker of view.compoundMarkers) {
        if (view.byTag.has(marker)) {
            throw new Error(markerShadowsConcern(marker));
        }
    }
    if (view.generatedFolder !== null && !view.compoundMarkers.includes(view.generatedFolder.marker)) {
        throw new Error(unboundMarkerFolder(view.generatedFolder.marker));
    }
    for (const marker of [...view.testMarkers, ...view.fixtureMarkers]) {
        if (!view.compoundMarkers.includes(marker)) {
            throw new Error(unboundTestMarker(marker));
        }
    }
    for (const [marker, folder] of view.markerFolders) {
        if (!view.compoundMarkers.includes(marker)) {
            throw new Error(unboundMarkerFolder(marker));
        }
        if (view.byFolder.has(folder)) {
            throw new Error(markerFolderShadowsConcern(marker, folder));
        }
    }
};

const assertRoot = function assertRoot(view: TaxonomyView, root: string, declared: readonly string[]): void {
    if (declared.length === 0) {
        throw new Error(emptyRoot(root));
    }
    if (view.containers.get(root)?.size !== declared.length) {
        throw new Error(duplicateContainer(root));
    }
    for (const special of view.special.get(root) ?? []) {
        if (view.containers.get(root)?.has(special) === true) {
            throw new Error(containerAndBucket(root, special));
        }
        if (!view.byFolder.has(special)) {
            throw new Error(bucketNotConcern(root, special));
        }
    }
};

const assertIgnored = function assertIgnored(view: TaxonomyView): void {
    for (const pattern of view.ignoredNames) {
        const literal = pattern.split("*").join("");
        if (literal === "") {
            throw new Error(wildcardIgnore(pattern));
        }
        if (literal.startsWith(".") && !literal.includes("/") && pattern.startsWith("*")) {
            throw new Error(extensionIgnore(pattern));
        }
    }
};

const assertSplitters = function assertSplitters(view: TaxonomyView): ReadonlySet<string> {
    const names = new Set<string>();
    for (const splitter of view.splitters) {
        if (names.has(splitter.name)) {
            throw new Error(duplicateSplitter(splitter.name));
        }
        if (splitter.joiner !== null && !isWellFormedJoiner(splitter.joiner)) {
            throw new Error(malformedJoiner(splitter.name, splitter.joiner));
        }
        names.add(splitter.name);
    }
    return names;
};

const assertDialects = function assertDialects(view: TaxonomyView): void {
    const declared = assertSplitters(view);
    const claimed = new Set<string>();
    for (const dialect of view.dialects) {
        if (!declared.has(dialect.splitter)) {
            throw new Error(unknownSplitter(dialect.splitter, [...declared]));
        }
        if (dialect.extensions.length === 0) {
            throw new Error(unboundDialect(dialect.splitter));
        }
        for (const ext of dialect.extensions) {
            if (claimed.has(ext)) {
                throw new Error(doubleBoundExtension(ext));
            }
            claimed.add(ext);
        }
    }
};

export const assertMirrors = function assertMirrors(
    mirrors: Readonly<Record<string, string>>,
    roots: ReadonlySet<string>,
): void {
    for (const [mirror, source] of Object.entries(mirrors)) {
        if (roots.has(mirror)) {
            throw new Error(mirrorIsRoot(mirror));
        }
        if (!roots.has(source)) {
            throw new Error(unknownMirrorSource(mirror, source));
        }
    }
};

export const assertTaxonomy = function assertTaxonomy(view: TaxonomyView, concernCount: number): void {
    assertDialects(view);
    assertConcerns(view, concernCount);
    for (const [root, declared] of Object.entries(view.declaredContainers)) {
        assertRoot(view, root, declared);
    }
    for (const root of Object.keys(view.declaredSpecial)) {
        if (!view.containers.has(root)) {
            throw new Error(undeclaredBucketRoot(root));
        }
    }
    assertIgnored(view);
    if (!Number.isInteger(view.maxDepth) || view.maxDepth < MIN_DEPTH) {
        throw new Error(shallowCap(String(view.maxDepth), MIN_DEPTH));
    }
};
