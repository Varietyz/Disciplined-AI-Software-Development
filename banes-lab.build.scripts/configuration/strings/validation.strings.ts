export const DISCOVERY_CLEAN =
    "[discovery] every route is pre-rendered, described, linked, listed, indexable and served as json and markdown\n";

export const discoveryFindingsHeading = function discoveryFindingsHeading(count: number): string {
    return `[discovery] ${String(count)} finding(s):`;
};

export const MISSING_BUILD_FILE = "The build did not produce this file.";

export const EMPTY_MISSING_PAGE = "The 404 page is empty.";

export const UNREFERENCED_FILE = "Nothing served references this file; the build ships only what a page reaches.";
