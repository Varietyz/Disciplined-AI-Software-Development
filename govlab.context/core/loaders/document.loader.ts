import {
    DOCUMENT_EXTENSION,
    DOCUMENT_ROOTS,
    PATH_SEPARATOR,
    WINDOWS_SEPARATOR,
} from "#configuration/constants/document.constants";
import type { DocumentKind, DocumentSource } from "#types/grammar.document.types";
import { absolutePath, relativePath } from "@ssot/paths";
import { join } from "node:path";
import { readdirSync } from "node:fs";

const documentsUnder = function documentsUnder(base: string): string[] {
    return readdirSync(base, { withFileTypes: true }).flatMap((entry) => {
        const full = join(base, entry.name);
        if (entry.isDirectory()) {
            return documentsUnder(full);
        }
        return entry.name.endsWith(DOCUMENT_EXTENSION) ? [full] : [];
    });
};

const sourcesOf = function sourcesOf(kind: DocumentKind, key: string): DocumentSource[] {
    const root = absolutePath(key);
    const prefix = relativePath(key);
    return documentsUnder(root).map((path) => ({
        kind,
        path,
        relative: `${prefix}${PATH_SEPARATOR}${path
            .slice(root.length + 1)
            .split(WINDOWS_SEPARATOR)
            .join(PATH_SEPARATOR)}`,
    }));
};

export const executableDocuments = function executableDocuments(): DocumentSource[] {
    return DOCUMENT_ROOTS.flatMap(({ key, kind }) => sourcesOf(kind, key));
};
