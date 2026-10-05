import type { SearchCorpus, SearchIndex, SearchSource } from "@banes-lab/web/types/search.types.js";
import type { AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import type { DefinitionIndex } from "@banes-lab/web/types/definition.types.js";
import type { Evidence } from "@banes-lab/web/types/evidence.types.js";
import type { LearningBlock } from "@banes-lab/web/types/learning.types.js";
import type { ModuleRunner } from "vite/module-runner";
import type { ReferenceTarget } from "@banes-lab/web/types/reference.types.js";
import type { Section } from "@banes-lab/web/types/document.types.js";
import type { SourceTree } from "#types/source.types";

export interface WebModules {
    readonly anatomyConstants: { readonly LINE_INFIX: string };
    readonly anatomyIds: { readonly DEFINITION_ANCHOR: string };
    readonly analyzer: {
        readonly anchorPath: (source: SearchSource, section: string) => string;
        readonly textsOf: (value: unknown) => readonly string[];
    };
    readonly anatomy: { readonly ANATOMY_TREES: readonly Omit<SourceTree, "label">[] };
    readonly company: Readonly<Record<string, string>>;
    readonly corpus: { readonly loadCorpus: () => Promise<SearchCorpus> };
    readonly definition: { readonly definitionIndexOf: (roots: readonly AnatomyFolder[]) => DefinitionIndex };
    readonly evidence: {
        readonly evidenceFor: (target: ReferenceTarget, registry: readonly Evidence[]) => readonly Evidence[];
    };
    readonly evidenceConstants: { readonly EVIDENCE: readonly Evidence[] };
    readonly folder: { readonly localPath: (path: string) => string };
    readonly learning: { readonly LEARNING: readonly LearningBlock[] };
    readonly links: Readonly<Record<string, unknown>>;
    readonly markup: { readonly summarizeMarkup: (markup: string, fallback: string) => string };
    readonly matcher: { readonly markupWords: (markup: string) => readonly string[] };
    readonly ontology: { readonly hrefOf: (ref: string) => string | null };
    readonly reference: { readonly plainMarkdown: (text: string) => string };
    readonly search: {
        readonly indexOf: (corpus: SearchCorpus) => SearchIndex;
        readonly positionOf: (index: SearchIndex, source: SearchSource, section: Section) => number;
    };
    readonly searchConstants: { readonly FUZZY_MIN_TERM_LENGTH: number };
    readonly source: {
        readonly fileId: (path: string) => string;
        readonly folderHref: (path: string) => string;
        readonly folderId: (path: string) => string;
        readonly languageOf: (name: string) => string;
        readonly nodeHref: (file: string, line: number | null) => string;
        readonly nodeRoute: (path: string, folder: boolean) => string;
        readonly sourceTitle: (path: string) => string;
        readonly treeLabelOf: (tab: string) => string;
    };
    readonly vocabulary: {
        readonly ANATOMY_FACE: string;
        readonly CHAPTER_FACE: string;
        readonly WORD_CHARACTERS: string;
    };
}

export interface RunnerModule {
    readonly names: readonly string[] | "*";
    readonly path: string;
}

export type ModuleImporter = Pick<ModuleRunner, "import">;
