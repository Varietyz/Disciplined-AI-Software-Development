import type { BakedTabs, LinkedPage, PageContent, VocabularyEntry } from "@banes-lab/web/types/vocabulary.types.js";
import { isAbsolute, relative } from "node:path";
import type { AnatomyIndex } from "@banes-lab/web/types/record.types.js";
import type { ModuleImporter } from "#types/loader.types";
import { RUNNER_MODULES } from "#configuration/constants/loader.constants";
import { absolutePath } from "@ssot/paths";
import { createServerModuleRunner } from "vite";
import { installDocument } from "#core/adapters/document.adapter";
import { moduleServer } from "#core/factories/server.factory";
import { renderAnatomyIndex } from "#core/formatters/anatomy.formatter";
import { renderBakedTabs } from "#core/formatters/tab.formatter";
import { writeCanonicalText } from "@govlab/canonical-write";

const GENERATED_MARK = ".generated.";
const GENERATED_EXTENSION = ".generated.ts";
const INDEX_STEM = "anatomy.index";
const PARENT = "..";

interface SiteContent {
    readonly ANATOMY_INDEX: AnatomyIndex;
    readonly BAKED_TABS: readonly BakedTabs[];
    readonly CHAPTER_PAGES: readonly PageContent[];
    readonly LINKED_PAGES: readonly LinkedPage[];
}

interface Linking {
    readonly linkPages: (
        pages: readonly PageContent[],
        linked: readonly LinkedPage[],
        vocabulary: readonly VocabularyEntry[],
    ) => readonly LinkedPage[];
}

interface Baked {
    readonly entries: readonly BakedTabs[];
    readonly index: AnatomyIndex;
    readonly pages: number;
}

export const bakedTabsOf = async function bakedTabsOf(runner: ModuleImporter): Promise<Baked> {
    const [site, vocabulary, linking] = await Promise.all([
        runner.import<SiteContent>(RUNNER_MODULES.site.path),
        runner.import<{ readonly VOCABULARY: readonly VocabularyEntry[] }>(RUNNER_MODULES.vocabularyAsset.path),
        runner.import<Linking>(RUNNER_MODULES.linking.path),
    ]);
    const linked = linking.linkPages(site.CHAPTER_PAGES, site.LINKED_PAGES, vocabulary.VOCABULARY);
    return { entries: [...linked, ...site.BAKED_TABS], index: site.ANATOMY_INDEX, pages: linked.length };
};

const byStem = function byStem(entries: readonly BakedTabs[]): ReadonlyMap<string, readonly BakedTabs[]> {
    const grouped = new Map<string, BakedTabs[]>();
    for (const entry of entries) {
        grouped.set(entry.stem, [...(grouped.get(entry.stem) ?? []), entry]);
    }
    return grouped;
};

export const writeLinkedPages = async function writeLinkedPages(root: string): Promise<number> {
    const server = await moduleServer(root);
    try {
        const runner = createServerModuleRunner(server.environments.ssr);
        const links = await runner.import<{ readonly SITE_URL: string }>(RUNNER_MODULES.links.path);
        installDocument(links.SITE_URL);
        const baked = await bakedTabsOf(runner);
        await Promise.all([
            ...[...byStem(baked.entries)].map(async ([stem, entries]) =>
                writeCanonicalText(absolutePath("app.pages", stem + GENERATED_EXTENSION), renderBakedTabs(entries)),
            ),
            writeCanonicalText(
                absolutePath("app.pages", INDEX_STEM + GENERATED_EXTENSION),
                renderAnatomyIndex(baked.index),
            ),
        ]);
        return baked.pages;
    } finally {
        await server.close();
    }
};

const isSourceOf = function isSourceOf(root: string, file: string): boolean {
    const local = relative(root, file);
    return local.length > 0 && !local.startsWith(PARENT) && !isAbsolute(local) && !local.includes(GENERATED_MARK);
};

export const createRelinker = function createRelinker(
    root: string,
    report: (error: unknown) => void,
): (file: string) => void {
    let running: Promise<void> = Promise.resolve();
    let queued = false;
    return (file) => {
        if (queued || !isSourceOf(root, file)) {
            return;
        }
        queued = true;
        running = running
            .then(async () => {
                queued = false;
                await writeLinkedPages(root);
            })
            .catch(report);
    };
};
