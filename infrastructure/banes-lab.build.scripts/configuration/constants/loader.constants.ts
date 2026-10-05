import type { RunnerModule } from "#types/loader.types";

const WEB = "@banes-lab/web";

export const WHOLE = "*";

export const MODULE_MANIFEST_NAME = "_manifest.json";

export const PACKAGE_MANIFEST_NAME = "package.json";

export const RUNNER_MODULES = {
    analyzer: { names: ["anchorPath", "textsOf"], path: `${WEB}/core/analyzers/search.analyzer.ts` },
    anatomy: { names: ["ANATOMY_TREES"], path: `${WEB}/core/registries/anatomy.registry.ts` },
    anatomyConstants: { names: ["LINE_INFIX"], path: `${WEB}/configuration/constants/anatomy.constants.ts` },
    anatomyIds: { names: ["DEFINITION_ANCHOR"], path: `${WEB}/core/ids/anatomy.ids.ts` },
    company: { names: WHOLE, path: `${WEB}/configuration/strings/company.strings.ts` },
    corpus: { names: ["loadCorpus", "searchPages"], path: `${WEB}/domain/loaders/search.loader.ts` },
    definition: { names: ["definitionIndexOf"], path: `${WEB}/core/converters/definition.converter.ts` },
    definitions: { names: ["listDefinitions"], path: `${WEB}/core/loaders/definition.loader.ts` },
    evidence: { names: ["evidenceFor"], path: `${WEB}/domain/converters/evidence.converter.ts` },
    evidenceConstants: { names: ["EVIDENCE"], path: `${WEB}/configuration/constants/evidence.source.constants.ts` },
    folder: { names: ["localPath"], path: `${WEB}/core/converters/folder.converter.ts` },
    learning: { names: ["LEARNING"], path: `${WEB}/core/generated/learning.generated.ts` },
    linking: { names: ["linkPages"], path: `${WEB}/domain/converters/link.vocabulary.converter.ts` },
    links: { names: WHOLE, path: `${WEB}/core/assets/link.assets.ts` },
    markup: { names: ["markdownOf", "summarizeMarkup"], path: `${WEB}/core/converters/markup.converter.ts` },
    matcher: { names: ["markupWords"], path: `${WEB}/core/matchers/search.matcher.ts` },
    ontology: { names: ["hrefOf"], path: `${WEB}/domain/converters/ontology.converter.ts` },
    pageIds: { names: WHOLE, path: `${WEB}/core/ids/page.ids.ts` },
    pageRegistry: {
        names: ["loadCompletePage", "loadPage", "loadedPage"],
        path: `${WEB}/domain/registries/page.registry.ts`,
    },
    pageRenderer: {
        names: ["applyHead", "headOf", "renderStaticPage", "sourceHead"],
        path: `${WEB}/presentation/renderers/page.renderer.ts`,
    },
    pageStrings: { names: ["HOME_DESCRIPTION", "SITE_NAME"], path: `${WEB}/configuration/strings/page.strings.ts` },
    records: { names: [], path: `${WEB}/presentation/records/records.barrel.ts` },
    reference: { names: ["plainMarkdown"], path: `${WEB}/domain/converters/reference.converter.ts` },
    search: {
        names: ["indexOf", "positionOf", "positionsOf"],
        path: `${WEB}/domain/converters/search.index.converter.ts`,
    },
    searchConstants: { names: ["FUZZY_MIN_TERM_LENGTH"], path: `${WEB}/configuration/constants/search.constants.ts` },
    site: {
        names: ["ANATOMY_INDEX", "BAKED_TABS", "CHAPTER_PAGES", "LINKED_PAGES"],
        path: `${WEB}/configuration/strings/site.strings.ts`,
    },
    siteIds: { names: ["MAIN_ID"], path: `${WEB}/core/ids/site.ids.ts` },
    source: {
        names: [
            "fileId",
            "folderHref",
            "folderId",
            "languageOf",
            "nodeHref",
            "nodeRoute",
            "sourceTitle",
            "treeLabelOf",
        ],
        path: `${WEB}/domain/converters/source.converter.ts`,
    },
    sourceBody: { names: ["renderSourceBody"], path: `${WEB}/presentation/renderers/source.renderer.ts` },
    surface: { names: ["renderTranscripts"], path: `${WEB}/presentation/renderers/surface.renderer.ts` },
    terms: {
        names: ["TRAINING_LICENSE_TERMS", "TRAINING_PERMISSION"],
        path: `${WEB}/configuration/strings/terms.strings.ts`,
    },
    text: { names: ["exportText"], path: `${WEB}/core/converters/text.converter.ts` },
    vocabulary: {
        names: ["ANATOMY_FACE", "CHAPTER_FACE", "WORD_CHARACTERS"],
        path: `${WEB}/configuration/constants/vocabulary.constants.ts`,
    },
    vocabularyAsset: { names: ["VOCABULARY"], path: `${WEB}/core/generated/vocabulary.generated.ts` },
} as const satisfies Readonly<Record<string, RunnerModule>>;
