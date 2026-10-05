import type { AnatomyFile, AnatomySnapshot } from "@banes-lab/web/types/anatomy.types.js";
import type { Identity, Link, Linker, Placed, PlacementOf, Relation } from "#types/catalog.types";
import type { SourceBody } from "@banes-lab/web/types/page.types.js";

export interface SourceTree {
    readonly label: string;
    readonly snapshot: AnatomySnapshot;
    readonly tab: string;
}

export interface SourceTools {
    readonly definitionAnchor: string;
    readonly fileId: (path: string) => string;
    readonly lineInfix: string;
    readonly languageOf: (name: string) => string;
    readonly localPath: (path: string) => string;
    readonly nodeHref: (path: string, line: number | null) => string;
}

export interface SourceFile {
    readonly file: AnatomyFile;
    readonly identity: Identity;
    readonly tree: SourceTree;
}

export interface NamedSource {
    readonly file: Pick<AnatomyFile, "path"> & {
        readonly definitions: readonly Pick<AnatomyFile["definitions"][number], "name">[];
    };
    readonly identity: Identity;
}

export interface SourceSources {
    readonly checks: (ref: string) => readonly Relation[];
    readonly folder: (ref: string) => FolderRelations | null;
    readonly grounds: (ref: string) => Promise<readonly Link[]>;
    readonly linkedBy: (ref: string) => readonly Link[];
    readonly linker: Linker;
    readonly placement: PlacementOf;
    readonly textOf: (name: string) => string | null;
    readonly tools: SourceTools;
}

export interface DefinitionData {
    readonly exported: boolean;
    readonly kind: string;
    readonly line: number;
    readonly name: string;
}

export interface SourceData extends Placed {
    readonly definitions: readonly DefinitionData[];
    readonly href: string | null;
    readonly language: string;
    readonly layer: string | null;
    readonly path: string;
    readonly relations: readonly Relation[];
    readonly summary: string | null;
    readonly text: string | null;
}

export interface SourceRouteTools {
    readonly languageOf: (name: string) => string;
    readonly license: (tab: string) => string | null;
    readonly localPath: (path: string) => string;
    readonly nodeRoute: (path: string, folder: boolean) => string;
    readonly sourceTitle: (path: string) => string;
    readonly tabPath: (tab: string) => string;
}

export interface SourceRoute extends SourceBody {
    readonly text: string | null;
}

export interface FolderTools {
    readonly fileId: (path: string) => string;
    readonly folderHref: (path: string) => string;
}

export interface FolderRelations {
    readonly containedIn: Link | null;
    readonly contains: readonly Link[];
}
