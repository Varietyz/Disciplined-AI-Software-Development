import type { DiskFile, DiskFolder } from "#types/structure.types";
import {
    analyzeSync,
    bodyStart,
    codeLineMask,
    describeFindings,
    docMeta,
    isBoundaryFilename,
    mermaidBlocks,
    pathReferences,
    refScanOf,
    splitLines,
} from "@govlab/docs";
import type { DocsHost } from "@govlab/docs";
import type { DocumentView } from "@banes-lab/web/types/anatomy.types.js";
import { join } from "node:path";

const DOCUMENT_SUFFIX = ".md";
const HEADING_MARK = "#";

export const isDocument = function isDocument(file: DiskFile): boolean {
    return file.name.endsWith(DOCUMENT_SUFFIX);
};

const headingCount = function headingCount(source: string): number {
    const lines = splitLines(source);
    const mask = codeLineMask(lines, bodyStart(lines));
    return lines.filter((line, index) => !mask[index] && line.startsWith(HEADING_MARK)).length;
};

export const filesOf = function filesOf(folder: DiskFolder): DiskFolder["files"] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

export const documentOf = function documentOf(host: DocsHost, memberDir: string, file: DiskFile): DocumentView {
    const meta = docMeta(host.ctx, join(memberDir, ...file.path.split("/")), file.text);
    const findings = describeFindings(analyzeSync(host.ctx, meta));
    return {
        boundary: meta.hostBoundary || isBoundaryFilename(meta.docFilename),
        concern: meta.fmConcern.length === 0 ? null : meta.fmConcern,
        constructs: refScanOf(host.ctx, meta).constructs.length,
        fields: Object.keys(meta.fields),
        findings,
        form: meta.fmType ?? null,
        headings: headingCount(file.text),
        mermaid: mermaidBlocks(file.text).length,
        paths: pathReferences(file.text).length,
    };
};

export const documentsOf = function documentsOf(
    tree: DiskFolder,
    host: DocsHost,
    moduleDir: string,
): Map<string, DocumentView> {
    return new Map(
        filesOf(tree)
            .filter(isDocument)
            .map((file) => [file.path, documentOf(host, moduleDir, file)] as const),
    );
};
