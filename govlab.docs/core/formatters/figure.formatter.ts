import type { DiagramContext, DiagramKind, RenderedDiagram } from "#types/figure.types";
import {
    SOURCES_CLOSE,
    SOURCES_SUMMARY,
    SOURCES_TABLE_HEAD,
    chartsHeading,
    legendLine,
} from "#configuration/strings/figure.strings";
import { DIAGRAM_KINDS } from "#core/loaders/diagram.loader";

const MERMAID_OPEN = "```mermaid";
const FENCE_CLOSE = "```";

const mermaidBlock = function mermaidBlock(mermaid: string): string[] {
    return [MERMAID_OPEN, mermaid, FENCE_CLOSE, ""];
};

const partBlocks = function partBlocks(rendered: RenderedDiagram): string[] {
    const parts = rendered.parts ?? [];
    if (parts.length === 0) {
        return mermaidBlock(rendered.mermaid);
    }
    return parts.flatMap((part) => [`### ${part.caption}`, "", ...mermaidBlock(part.mermaid)]);
};

const legendBlock = function legendBlock(rendered: RenderedDiagram): string[] {
    return rendered.legend.length > 0 ? [legendLine(rendered.legend), ""] : [];
};

const sourcesBlock = function sourcesBlock(rendered: RenderedDiagram): string[] {
    if (rendered.sources.length === 0) {
        return [];
    }
    return [
        SOURCES_SUMMARY,
        "",
        ...SOURCES_TABLE_HEAD,
        ...rendered.sources.map((source) => `| ${source.label} | \`${source.file}:${source.line}\` |`),
        "",
        SOURCES_CLOSE,
    ];
};

const chartBlock = function chartBlock(kind: DiagramKind, context: DiagramContext): string[] {
    const rendered = kind.appliesTo(context) ? kind.render(context) : null;
    if (rendered === null) {
        return [];
    }
    return [
        [`## ${kind.title}`, "", ...partBlocks(rendered), ...legendBlock(rendered), ...sourcesBlock(rendered)].join(
            "\n",
        ),
    ];
};

export const renderCharts = function renderCharts(context: DiagramContext): string | null {
    const blocks = DIAGRAM_KINDS.flatMap((kind) => chartBlock(kind, context));
    if (blocks.length === 0) {
        return null;
    }
    return `${chartsHeading(context.moduleName)}\n\n${blocks.join("\n\n")}\n`;
};
