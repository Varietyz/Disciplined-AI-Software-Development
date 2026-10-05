import { DIAGRAM_KINDS, diagramContextFor } from "@govlab/docs";
import type { DiagramContext, RenderedDiagram } from "@govlab/docs";
import type { ChartView } from "@banes-lab/web/types/anatomy.types.js";
import { basename } from "node:path";

const EXCLUDED_CHARTS: ReadonlySet<string> = new Set(["dependency", "lifecycle"]);

const chartView = function chartView(
    id: string,
    title: string,
    rendered: RenderedDiagram,
    relabel: (text: string) => string,
): ChartView {
    const parts =
        rendered.parts && rendered.parts.length > 0
            ? rendered.parts.map((part) => ({ caption: relabel(part.caption), text: relabel(part.mermaid) }))
            : [{ caption: title, text: relabel(rendered.mermaid) }];
    return { id, legend: rendered.legend, parts, title };
};

export const chartsOf = async function chartsOf(moduleDir: string, label: string): Promise<ChartView[]> {
    const context = await diagramContextFor(moduleDir, label, label);
    if (context === null) {
        return [];
    }
    const scoped: DiagramContext = { ...context, moduleDeps: [] };
    const member = basename(moduleDir);
    const relabel = function relabel(text: string): string {
        return text.split(member).join(label);
    };
    return DIAGRAM_KINDS.filter((kind) => !EXCLUDED_CHARTS.has(kind.id) && kind.appliesTo(scoped)).flatMap((kind) => {
        const rendered = kind.render(scoped);
        return rendered === null ? [] : [chartView(kind.id, kind.title, rendered, relabel)];
    });
};
