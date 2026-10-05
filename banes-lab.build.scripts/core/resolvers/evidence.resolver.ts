import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import type { CodeTarget } from "@banes-lab/web/types/code.types.js";
import type { DefinitionIndex } from "@banes-lab/web/types/definition.types.js";
import type { EvidenceNode } from "@banes-lab/web/types/evidence.types.js";
import type { SourceIds } from "#types/graph.types";
import { unknownTargetKind } from "#configuration/strings/graph.strings";

const KEY_JOINER = "\n";
const PATH_SEPARATOR = "/";

const filesOf = function filesOf(folder: AnatomyFolder): readonly AnatomyFile[] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

const definitionKey = function definitionKey(file: string, line: number, name: string): string {
    return [file, String(line), name].join(KEY_JOINER);
};

const definitionIdsOf = function definitionIdsOf(roots: readonly AnatomyFolder[]): ReadonlyMap<string, string> {
    return new Map(
        roots
            .flatMap(filesOf)
            .flatMap((file) =>
                file.definitions.map(
                    (definition) =>
                        [definitionKey(file.path, definition.line, definition.name), definition.id] as const,
                ),
            ),
    );
};

export const codeTargetRefOf = function codeTargetRefOf(
    roots: readonly AnatomyFolder[],
    ids: Pick<SourceIds, "fileId" | "folderId">,
): (target: CodeTarget) => string | null {
    const definitions = definitionIdsOf(roots);
    return (target) => {
        switch (target.kind) {
            case "definition": {
                const { file, line, name } = target.location;
                const id = definitions.get(definitionKey(file, line, name));
                return id === undefined ? null : ANATOMY_PREFIX + id;
            }
            case "file": {
                return ANATOMY_PREFIX + ids.fileId(target.path);
            }
            case "folder": {
                return ANATOMY_PREFIX + ids.folderId(target.path);
            }
            case "record": {
                return target.ref;
            }
            case "candidates": {
                return null;
            }
            default: {
                throw new Error(unknownTargetKind(JSON.stringify(target)));
            }
        }
    };
};

export const evidenceTargetOf = function evidenceTargetOf(
    roots: readonly AnatomyFolder[],
    index: DefinitionIndex,
    ids: Pick<SourceIds, "fileId" | "folderId">,
): (node: EvidenceNode) => string | null {
    const definitions = definitionIdsOf(roots);
    return (node) => {
        if (node.kind === "definition") {
            const location = index.citedDefinition(node.name, node.file);
            const id =
                location === null
                    ? undefined
                    : definitions.get(definitionKey(location.file, location.line, location.name));
            return id === undefined ? null : ANATOMY_PREFIX + id;
        }
        if (node.kind === "file") {
            const path = index.resolvePath(node.name);
            return path === null ? null : ANATOMY_PREFIX + ids.fileId(path);
        }
        const folder = index.resolveFolder(node.words.join(PATH_SEPARATOR));
        return folder === null ? null : ANATOMY_PREFIX + ids.folderId(folder);
    };
};
