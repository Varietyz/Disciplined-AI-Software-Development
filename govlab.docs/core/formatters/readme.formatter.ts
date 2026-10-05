import { METRICS_LAYER, REPO_METRICS_LAYER } from "#configuration/constants/layer.constants";
import { README_HEADINGS, README_TEXT, chartsNote, defaultInstall } from "#configuration/strings/readme.strings";
import type { ReadmeLayer, RenderContext } from "#types/readme.types";
import {
    renderApi,
    renderConcepts,
    renderDeps,
    renderDomains,
    renderMetrics,
    renderPrinciples,
    renderRepoMetrics,
} from "#core/formatters/readme.section.formatter";
import {
    renderConfiguration,
    renderQuickStart,
    renderRenderable,
    titleCase,
} from "#core/formatters/markdown.formatter";
import { relativePath } from "@ssot/paths";
import { wrapLayer } from "#core/converters/layer.converter";

export const CORE_FIELDS: ReadonlySet<string> = new Set([
    "overview",
    "whenToUse",
    "whenNotToUse",
    "quickStart",
    "configuration",
    "disposal",
    "aiContext",
    "apiNotes",
    "api",
    "install",
]);

const section = function section(heading: string, body: string): string {
    return `## ${heading}\n\n${body}`;
};

const isRenderableSlot = function isRenderableSlot(value: unknown): boolean {
    return typeof value === "string" || Array.isArray(value);
};

const installLayer = function installLayer(context: RenderContext): string {
    const body = isRenderableSlot(context.docs.install)
        ? renderRenderable(context.docs.install)
        : defaultInstall(context.scoped);
    const install = body.trim() === "" ? "" : `${section(README_HEADINGS.install, body)}\n\n`;
    return install + section(README_HEADINGS.quickStart, renderQuickStart(context.docs.quickStart));
};

const apiLayer = function apiLayer(context: RenderContext): string {
    if (context.surface.length > 0) {
        return section(README_HEADINGS.api, renderApi(context.surface, context.docs.apiNotes));
    }
    const body = isRenderableSlot(context.docs.api) ? renderRenderable(context.docs.api) : README_TEXT.noSurface;
    return section(README_HEADINGS.api, body);
};

const useLayer = function useLayer(context: RenderContext): string {
    const toUse = section(README_HEADINGS.whenToUse, renderRenderable(context.docs.whenToUse));
    return `${toUse}\n\n${section(README_HEADINGS.whenNotToUse, renderRenderable(context.docs.whenNotToUse))}`;
};

const chartsLayer = function chartsLayer(context: RenderContext): string | null {
    return context.hasCharts ? section(README_HEADINGS.charts, chartsNote(relativePath("moduleInfo.charts"))) : null;
};

const LAYERS: readonly ReadmeLayer[] = [
    { id: "overview", render: (context) => section(README_HEADINGS.purpose, renderRenderable(context.docs.overview)) },
    { id: "use", render: useLayer },
    { id: "charts", render: chartsLayer },
    { id: "install", render: installLayer },
    { id: "api", render: apiLayer },
    {
        id: "config",
        render: (context) => section(README_HEADINGS.configuration, renderConfiguration(context.docs.configuration)),
    },
    { id: "deps", render: (context) => section(README_HEADINGS.dependencies, renderDeps(context.pkg)) },
    {
        id: "ai-context",
        render: (context) => section(README_HEADINGS.aiContext, renderRenderable(context.docs.aiContext)),
    },
    { id: "domains", render: (context) => (context.domains.length > 0 ? renderDomains(context.domains) : null) },
    {
        id: "principles",
        render: (context) => (context.principles.length > 0 ? renderPrinciples(context.principles) : null),
    },
    {
        id: "quality-governance",
        render: (context) => (context.concepts.length > 0 ? renderConcepts(context.concepts) : null),
    },
    { id: "disposal", render: (context) => section(README_HEADINGS.disposal, renderRenderable(context.docs.disposal)) },
];

const coreLayers = function coreLayers(context: RenderContext): string[] {
    return LAYERS.flatMap((layer) => {
        const body = layer.render(context);
        return body === null || body === "" ? [] : [wrapLayer(layer.id, body)];
    });
};

const customLayers = function customLayers(context: RenderContext): string[] {
    return Object.keys(context.docs)
        .filter((key) => !CORE_FIELDS.has(key))
        .map((key) => wrapLayer(key, section(titleCase(key), renderRenderable(context.docs[key]))));
};

const repoLayer = function repoLayer(context: RenderContext): string[] {
    const body = renderRepoMetrics(context.repo);
    return body === "" ? [] : [wrapLayer(REPO_METRICS_LAYER, body)];
};

export const generateModuleDoc = function generateModuleDoc(context: RenderContext): string {
    const parts = [
        `# ${context.scoped}`,
        ...coreLayers(context),
        ...customLayers(context),
        ...repoLayer(context),
        wrapLayer(METRICS_LAYER, renderMetrics(context)),
    ];
    return `${parts.join("\n\n")}\n`;
};
