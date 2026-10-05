import type {
    AnatomyFile,
    AnatomyFolder,
    AnatomySnapshot,
    DefinitionRef,
    DefinitionView,
    FindingView,
} from "@banes-lab/web/types/anatomy.types.js";

type Qualify = (path: string) => string;

const qualifiedRef = function qualifiedRef(qualify: Qualify, ref: DefinitionRef): DefinitionRef {
    return { ...ref, file: qualify(ref.file), id: qualify(ref.id) };
};

const qualifiedDefinition = function qualifiedDefinition(qualify: Qualify, definition: DefinitionView): DefinitionView {
    return {
        ...definition,
        callees: definition.callees.map((ref) => qualifiedRef(qualify, ref)),
        callers: definition.callers.map((ref) => qualifiedRef(qualify, ref)),
        file: qualify(definition.file),
        id: qualify(definition.id),
    };
};

const qualifiedFinding = function qualifiedFinding(qualify: Qualify, finding: FindingView): FindingView {
    return { ...finding, file: qualify(finding.file) };
};

const qualifiedFile = function qualifiedFile(qualify: Qualify, file: AnatomyFile): AnatomyFile {
    return {
        ...file,
        definitions: file.definitions.map((definition) => qualifiedDefinition(qualify, definition)),
        findings: file.findings.map((finding) => qualifiedFinding(qualify, finding)),
        id: qualify(file.id),
        path: qualify(file.path),
    };
};

const qualifiedFolder = function qualifiedFolder(qualify: Qualify, folder: AnatomyFolder): AnatomyFolder {
    return {
        ...folder,
        files: folder.files.map((file) => qualifiedFile(qualify, file)),
        findings: folder.findings.map((finding) => qualifiedFinding(qualify, finding)),
        folders: folder.folders.map((child) => qualifiedFolder(qualify, child)),
        id: qualify(folder.id),
        path: qualify(folder.path),
    };
};

export const qualifiedSnapshot = function qualifiedSnapshot(
    snapshot: AnatomySnapshot,
    qualify: Qualify,
): AnatomySnapshot {
    return {
        ...snapshot,
        findings: snapshot.findings.map((finding) => qualifiedFinding(qualify, finding)),
        imports: snapshot.imports.map((edge) => ({ ...edge, from: qualify(edge.from), to: qualify(edge.to) })),
        tree: qualifiedFolder(qualify, snapshot.tree),
    };
};
