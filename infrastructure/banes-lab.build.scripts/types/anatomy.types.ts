import type {
    AnatomyFile,
    AnatomyFolder,
    AnatomySnapshot,
    DefinitionView,
    DocumentView,
    FindingView,
} from "@banes-lab/web/types/anatomy.types.js";
import type { FileEntry, ModuleReport, RepoContext, WalkCell } from "@govlab/patterns";
import type { AnatomyRecords } from "@banes-lab/web/types/record.types.js";
import type { DiskFolder } from "#types/structure.types";
import type { SourceReferences } from "@banes-lab/web/types/code.types.js";
import type { docsHostFor } from "@govlab/docs";

export interface WalkAssets {
    readonly cells: Map<string, readonly WalkCell[]>;
    readonly sources: Map<string, string>;
    readonly walks: Map<string, string>;
}

export interface AnatomyInputs {
    readonly cells: ReadonlyMap<string, readonly WalkCell[]>;
    readonly charts: AnatomySnapshot["charts"];
    readonly documents: ReadonlyMap<string, DocumentView>;
    readonly entries: readonly FileEntry[];
    readonly generatedSources?: boolean;
    readonly imports: AnatomySnapshot["imports"];
    readonly report: ModuleReport;
    readonly tree: DiskFolder;
    readonly vectors: ReadonlyMap<string, string>;
}

export interface AnatomyLookups {
    readonly assets: WalkAssets;
    readonly documents: ReadonlyMap<string, DocumentView>;
    readonly definitions: ReadonlyMap<string, readonly DefinitionView[]>;
    readonly edgesByFile: ReadonlyMap<string, number>;
    readonly entries: ReadonlyMap<string, FileEntry>;
    readonly findingsByFile: ReadonlyMap<string, readonly FindingView[]>;
    readonly flagged: ReadonlyMap<string, string>;
    readonly inputs: AnatomyInputs;
}

export type ReferenceReader = (path: string, text: string, document: boolean) => SourceReferences;

export type ReferenceChannel = keyof Pick<SourceReferences, "spans" | "strings" | "words">;

export interface CatalogRule {
    readonly canonical?: readonly string[] | undefined;
    readonly ruleId: string;
}

export interface ReferenceSite {
    readonly references: SourceReferences;
    readonly source: string;
}

export interface ExactReference {
    readonly channel: ReferenceChannel;
    readonly path: string;
    readonly text: string;
}

export interface RecordReader {
    readonly file: (file: AnatomyFile) => AnatomyRecords;
    readonly folder: (folder: AnatomyFolder) => AnatomyRecords;
}

export type SpecifierResolver = (specifier: string, fromPath: string) => string | null;

export interface TreeOptions {
    readonly qualifyPath: (tab: string, path: string) => string;
    readonly record: ((roots: readonly AnatomyFolder[]) => RecordReader) | null;
    readonly refer: ((roots: readonly AnatomyFolder[]) => ReferenceReader) | null;
    readonly specifiers: ((files: ReadonlySet<string>) => SpecifierResolver) | null;
}

export interface DerivedTree {
    readonly exportName: string;
    readonly snapshot: AnatomySnapshot;
    readonly tab: string;
}

export interface AnatomyFiles {
    readonly anatomy: string;
    readonly sources: string;
    readonly walks: string;
}

export interface AnatomyScope {
    readonly assets: WalkAssets;
    readonly context: RepoContext;
    readonly host: Awaited<ReturnType<typeof docsHostFor>>;
    readonly options: TreeOptions;
    readonly pruned: (folder: string) => boolean;
}
