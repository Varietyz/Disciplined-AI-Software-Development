import type {
    Links,
    Loaded,
    PageRegistry,
    PageRenderer,
    RouteExporter,
    TextConverter,
    TranscriptRenderer,
} from "#types/page.types";
import { type ViteDevServer, createServerModuleRunner } from "vite";
import { missingSectionElement, noSectionText } from "#configuration/strings/page.strings";
import type { Inline } from "#types/site.types";
import { RUNNER_MODULES } from "#configuration/constants/loader.constants";
import type { SectionExporter } from "#types/section.types";
import { assertFiguresFilled } from "#core/validators/figure.validator";
import { installDocument } from "#core/adapters/document.adapter";
import { loadRecordings } from "#core/loaders/surface.loader";

const sectionTexts = function sectionTexts(
    content: Element,
    path: string,
    ids: readonly string[],
    text: TextConverter,
): readonly string[] {
    return ids.map((id) => {
        const element = content.querySelector(`[id="${id}"]`);
        if (element === null) {
            throw new Error(missingSectionElement(path, id));
        }
        return text.exportText(element);
    });
};

const exporter = function exporter(
    renderer: PageRenderer,
    visit: (path: string) => void,
    text: TextConverter & TranscriptRenderer,
    exported: Map<string, readonly string[]>,
): RouteExporter {
    let recordings: readonly unknown[] | null = null;
    return (path, page, sections) => {
        visit(path);
        const content = renderer.renderStaticPage(page).at(0);
        if (content === undefined) {
            exported.set(path, []);
            return "";
        }
        recordings ??= loadRecordings();
        text.renderTranscripts(content, recordings);
        assertFiguresFilled(content, path);
        exported.set(path, sectionTexts(content, path, sections, text));
        return text.exportText(content);
    };
};

const sectionReader = function sectionReader(exported: ReadonlyMap<string, readonly string[]>): SectionExporter {
    return (path, ids) => {
        const held = exported.get(path);
        if (held?.length !== ids.length) {
            throw new Error(noSectionText(path, ids.length));
        }
        return held;
    };
};

export const loadFrom = async function loadFrom(server: ViteDevServer): Promise<Loaded> {
    const runner = createServerModuleRunner(server.environments.ssr);
    const links = await runner.import<Links>(RUNNER_MODULES.links.path);
    const visit = installDocument(links.SITE_URL);
    await runner.import(RUNNER_MODULES.records.path);
    const ids = await runner.import<Record<string, unknown>>(RUNNER_MODULES.pageIds.path);
    const registry = await runner.import<PageRegistry>(RUNNER_MODULES.pageRegistry.path);
    await Promise.all(
        Object.values(ids)
            .filter((id): id is string => typeof id === "string")
            .map(async (id) => registry.loadCompletePage(id)),
    );
    const site = await runner.import<{ readonly MAIN_ID: string }>(RUNNER_MODULES.siteIds.path);
    const strings = await runner.import<{ readonly HOME_DESCRIPTION: string; readonly SITE_NAME: string }>(
        RUNNER_MODULES.pageStrings.path,
    );
    const company = await runner.import<{ readonly COMPANY_OWNER: string }>(RUNNER_MODULES.company.path);
    const terms = await runner.import<{
        readonly TRAINING_LICENSE_TERMS: string;
        readonly TRAINING_PERMISSION: string;
    }>(RUNNER_MODULES.terms.path);
    const renderer = await runner.import<PageRenderer>(RUNNER_MODULES.pageRenderer.path);
    const markup = await runner.import<{ readonly markdownOf: Inline }>(RUNNER_MODULES.markup.path);
    const text = await runner.import<TextConverter>(RUNNER_MODULES.text.path);
    const surface = await runner.import<TranscriptRenderer>(RUNNER_MODULES.surface.path);
    const exported = new Map<string, readonly string[]>();
    return {
        author: company.COMPANY_OWNER,
        consent: `${terms.TRAINING_PERMISSION} ${terms.TRAINING_LICENSE_TERMS}`,
        exportSections: sectionReader(exported),
        exportText: exporter(renderer, visit, { ...text, ...surface }, exported),
        ids: Object.values(ids).filter((value): value is string => typeof value === "string"),
        inline: markup.markdownOf,
        links,
        main: site.MAIN_ID,
        name: strings.SITE_NAME,
        registry,
        renderer,
        runner,
        summary: strings.HOME_DESCRIPTION,
        visit,
    };
};
