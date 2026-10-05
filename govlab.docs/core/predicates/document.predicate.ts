import {
    DOC_BOUNDARY_FILENAMES,
    FRONTMATTER_FENCE,
    GENERATED_DOC_MARKS,
    GENERATED_SCAN_CLOSE_OFFSET,
    GENERATED_SCAN_LINES,
    HOW_TO_PREFIX,
    INSTALL_ARTIFACT_SUFFIX,
    MARKDOWN_SUFFIX,
} from "#configuration/constants/document.constants";

export const isBoundaryFilename = function isBoundaryFilename(filename: string): boolean {
    if (DOC_BOUNDARY_FILENAMES.includes(filename)) {
        return true;
    }
    return filename.startsWith(HOW_TO_PREFIX) && filename.endsWith(MARKDOWN_SUFFIX);
};

export const isHarnessOwned = function isHarnessOwned(relDoc: string, harnessRoot: string | null): boolean {
    return harnessRoot !== null && relDoc.startsWith(harnessRoot);
};

export const isHostBoundary = function isHostBoundary(filename: string, boundaryDocs: ReadonlySet<string>): boolean {
    return boundaryDocs.has(filename) || filename.endsWith(INSTALL_ARTIFACT_SUFFIX);
};

const scanLimit = function scanLimit(lines: readonly string[]): number {
    if (lines[0] !== FRONTMATTER_FENCE) {
        return GENERATED_SCAN_LINES;
    }
    const close = lines.indexOf(FRONTMATTER_FENCE, 1);
    return close === -1 ? GENERATED_SCAN_LINES : close + GENERATED_SCAN_CLOSE_OFFSET;
};

const hasGeneratedMark = function hasGeneratedMark(line: string): boolean {
    const lower = line.toLowerCase();
    return GENERATED_DOC_MARKS.some((mark) => lower.includes(mark));
};

export const isGeneratedDoc = function isGeneratedDoc(source: string): boolean {
    const lines = source.split("\n");
    return lines.slice(0, Math.min(lines.length, scanLimit(lines))).some(hasGeneratedMark);
};
