import type { Dialect, GrammarRoles, Placement, Splitter, Vocabulary } from "../../types/taxonomy.types.ts";
import { JURISDICTION } from "../registries/taxonomy.registry.ts";
import { matchesPattern } from "../matchers/pattern.matcher.ts";
import { undeclaredConcernTag } from "../strings/taxonomy.strings.ts";

const HOST: Vocabulary = JURISDICTION.host;

export const COMPOUND_MARKERS: readonly string[] = HOST.compoundMarkers;
export const SEPARATOR: string = HOST.separator;
export const CASE: string = HOST.case;
export const DIALECTS: readonly Dialect[] = HOST.dialects;
export const FILE_SHAPES: readonly string[] = HOST.fileShapes;
export const MAX_DEPTH: number = HOST.maxDepth;
export const GRAMMAR_ROLES: GrammarRoles = HOST.roles;

const {
    containers: CONTAINERS,
    foreign: FOREIGN,
    mirrors: MIRRORS,
    roots: TAXONOMY_ROOTS,
    special: SPECIAL,
    vocabularies: VOCABULARY_BY_ROOT,
} = JURISDICTION;

const posix = function posix(value: string): string {
    return value.split("\\").join("/");
};

export const taxonomyRoots = function taxonomyRoots(): string[] {
    return [...TAXONOMY_ROOTS];
};

export const governedRoots = function governedRoots(): string[] {
    return TAXONOMY_ROOTS.filter((root) => !MIRRORS.has(root));
};

export const mirrorSourceOf = function mirrorSourceOf(root: string | undefined): string | undefined {
    return root === undefined ? undefined : MIRRORS.get(root);
};

export const vocabularyFor = function vocabularyFor(root?: string): Vocabulary {
    return root === undefined ? HOST : (VOCABULARY_BY_ROOT.get(root) ?? HOST);
};

export const isImportedRoot = function isImportedRoot(root: string | undefined): boolean {
    return vocabularyFor(root) !== HOST;
};

export const isTestRoot = function isTestRoot(root: string | undefined): boolean {
    return root !== undefined && MIRRORS.has(root);
};

const markerSegmentOf = function markerSegmentOf(basename: string): string {
    const segments = basename.split(HOST.separator);
    return segments.length > 2 ? (segments.at(-2) ?? "") : "";
};

export const testMarkerOf = function testMarkerOf(basename: string): string | undefined {
    const marker = markerSegmentOf(basename);
    return HOST.testMarkers.includes(marker) ? marker : undefined;
};

export const fixtureMarkerOf = function fixtureMarkerOf(basename: string, root?: string): string | undefined {
    const marker = markerSegmentOf(basename);
    return vocabularyFor(root).fixtureMarkers.includes(marker) ? marker : undefined;
};

export const testMarkers = function testMarkers(): string[] {
    return [...HOST.testMarkers, ...HOST.fixtureMarkers];
};

export const containersFor = function containersFor(root: string): string[] {
    return [...(CONTAINERS.get(root) ?? []), ...(SPECIAL.get(root) ?? [])].toSorted((a, b) => a.localeCompare(b));
};

export const rootFor = function rootFor(filePath: string): string | undefined {
    const norm = posix(filePath);
    return TAXONOMY_ROOTS.find((root) => norm.includes(`/${root}/`) || norm.startsWith(`${root}/`));
};

export const isEnforced = function isEnforced(filePath: string): boolean {
    return rootFor(filePath) !== undefined;
};

export const isContainer = function isContainer(root: string, segment: string): boolean {
    return CONTAINERS.get(root)?.has(segment) === true;
};

export const isSpecialContainer = function isSpecialContainer(root: string, segment: string): boolean {
    return SPECIAL.get(root)?.has(segment) === true;
};

export const isForeignContainer = function isForeignContainer(root: string, segment: string): boolean {
    return FOREIGN.get(root)?.has(segment) === true;
};

export const isDeclaredContainer = function isDeclaredContainer(root: string, segment: string): boolean {
    return isContainer(root, segment) || isSpecialContainer(root, segment);
};

export const isNestedRoot = function isNestedRoot(root: string, segment: string): boolean {
    return CONTAINERS.has(`${root}/${segment}`);
};

export const isIgnoredName = function isIgnoredName(name: string, root?: string): boolean {
    return vocabularyFor(root).ignoredNames.some((pattern) => matchesPattern(pattern, name));
};

export const isGeneratedFolder = function isGeneratedFolder(name: string, root?: string): boolean {
    const form = vocabularyFor(root).generatedFolder;
    if (form === null) {
        return false;
    }
    const suffix = `${vocabularyFor(root).separator}${form.marker}`;
    return name.startsWith(form.prefix) && name.endsWith(suffix) && name.length > form.prefix.length + suffix.length;
};

export const excludedTrees = function excludedTrees(): string[] {
    return [...HOST.excludedTrees];
};

export const isCompoundMarker = function isCompoundMarker(segment: string, root?: string): boolean {
    return vocabularyFor(root).compoundMarkers.includes(segment);
};

export const splitterFor = function splitterFor(ext: string, root?: string): Splitter | null {
    const vocabulary = vocabularyFor(root);
    const dialect = vocabulary.dialects.find((declared) => declared.extensions.includes(ext));
    return dialect === undefined ? null : (vocabulary.splitters.get(dialect.splitter) ?? null);
};

export const isNameExempt = function isNameExempt(basename: string, root?: string): boolean {
    const vocabulary = vocabularyFor(root);
    if (isIgnoredName(basename, root) || vocabulary.boundaryDocuments.has(basename)) {
        return true;
    }
    const segments = basename.split(vocabulary.separator);
    return segments.length > 2 && isCompoundMarker(segments.at(-2) ?? "", root);
};

export const markerFolderOf = function markerFolderOf(basename: string, root?: string): string | undefined {
    const vocabulary = vocabularyFor(root);
    const segments = basename.split(vocabulary.separator);
    return segments.length > 2 ? vocabulary.markerFolders.get(segments.at(-2) ?? "") : undefined;
};

export const isMarkerFolder = function isMarkerFolder(folder: string, root?: string): boolean {
    return [...vocabularyFor(root).markerFolders.values()].includes(folder);
};

const segmentsBelowRoot = function segmentsBelowRoot(filePath: string, root: string): string[] {
    const norm = posix(filePath);
    const marker = `${root}/`;
    const at = norm.lastIndexOf(marker);
    if (at === -1) {
        return [];
    }
    return norm.slice(at + marker.length).split("/");
};

export const placementOf = function placementOf(filePath: string): Placement | undefined {
    const root = rootFor(filePath);
    if (root === undefined) {
        return undefined;
    }
    const segments = segmentsBelowRoot(filePath, root);
    const container = segments[0] ?? "";
    if (!isDeclaredContainer(root, container)) {
        return undefined;
    }
    const tail = segments.slice(1);
    const firstBelow = tail[0] ?? "";
    if (firstBelow === "") {
        return undefined;
    }
    const kind = isSpecialContainer(root, container) ? "special" : "container";
    const depth = segments.length - 1;
    return { container, depth, firstBelow, kind, root };
};

export const isConcern = function isConcern(tag: string, root?: string): boolean {
    return vocabularyFor(root).byTag.has(tag);
};

export const isConcernFolder = function isConcernFolder(folder: string, root?: string): boolean {
    return vocabularyFor(root).byFolder.has(folder);
};

export const isLegalSubject = function isLegalSubject(word: string, root?: string): boolean {
    return vocabularyFor(root).legalSubjects.has(word);
};

export const isDeclaredSubject = function isDeclaredSubject(word: string, root?: string): boolean {
    return vocabularyFor(root).subjects.has(word);
};

export const isDeclaredVariant = function isDeclaredVariant(word: string, root?: string): boolean {
    return vocabularyFor(root).variants.has(word);
};

export const folderFor = function folderFor(tag: string): string | undefined {
    return HOST.byTag.get(tag)?.folder;
};

export const layerFor = function layerFor(tag: string, root?: string): string | undefined {
    return vocabularyFor(root).byTag.get(tag)?.layer;
};

export const tagForFolder = function tagForFolder(folderSegment: string, root?: string): string | undefined {
    const vocabulary = vocabularyFor(root);
    const tail = folderSegment.slice(folderSegment.lastIndexOf(vocabulary.separator) + 1);
    return vocabulary.byFolder.get(tail)?.tag;
};

export const tagsForFolder = function tagsForFolder(folderSegment: string, root?: string): readonly string[] {
    const vocabulary = vocabularyFor(root);
    const concern = vocabulary.byFolder.get(folderSegment.slice(folderSegment.lastIndexOf(vocabulary.separator) + 1));
    if (concern === undefined) {
        return [];
    }
    return concern.collection === undefined ? [concern.tag] : [concern.tag, concern.collection];
};

export const concernForPath = function concernForPath(filePath: string): string | undefined {
    const norm = posix(filePath);
    const cut = norm.lastIndexOf("/");
    if (cut === -1) {
        return undefined;
    }
    const parent = norm.slice(0, cut);
    const start = parent.lastIndexOf("/");
    return tagForFolder(start === -1 ? parent : parent.slice(start + 1), rootFor(filePath));
};

export const concernSuffix = function concernSuffix(tag: string, ext = "ts"): string {
    if (!HOST.byTag.has(tag)) {
        throw new Error(undeclaredConcernTag(tag));
    }
    return `.${tag}.${ext}`;
};

export const concernTags = function concernTags(): string[] {
    return [...HOST.byTag.keys()];
};

export const legalSubjects = function legalSubjects(): string[] {
    return [...HOST.legalSubjects];
};
