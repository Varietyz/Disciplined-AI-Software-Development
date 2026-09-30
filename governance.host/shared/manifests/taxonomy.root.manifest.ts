import { JURISDICTION } from "../registries/taxonomy.registry.ts";
import { vocabularyFor } from "./taxonomy.manifest.ts";

const { mirrors: MIRRORS, roots: TAXONOMY_ROOTS } = JURISDICTION;

export const taxonomyRoots = function taxonomyRoots(): string[] {
    return [...TAXONOMY_ROOTS];
};

export const mirrorSourceOf = function mirrorSourceOf(root?: string): string | undefined {
    return root === undefined ? undefined : MIRRORS.get(root);
};

export const isTestRoot = function isTestRoot(root?: string): boolean {
    return root !== undefined && MIRRORS.has(root);
};

const markerSegmentOf = function markerSegmentOf(basename: string): string {
    const segments = basename.split(vocabularyFor().separator);
    return segments.length > 2 ? (segments.at(-2) ?? "") : "";
};

export const testMarkerOf = function testMarkerOf(basename: string): string | undefined {
    const marker = markerSegmentOf(basename);
    return vocabularyFor().testMarkers.includes(marker) ? marker : undefined;
};

export const fixtureMarkerOf = function fixtureMarkerOf(basename: string, root?: string): string | undefined {
    const marker = markerSegmentOf(basename);
    return vocabularyFor(root).fixtureMarkers.includes(marker) ? marker : undefined;
};

export const testMarkers = function testMarkers(): string[] {
    const host = vocabularyFor();
    return [...host.testMarkers, ...host.fixtureMarkers];
};
