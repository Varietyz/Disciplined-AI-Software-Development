import { SUPERSEDED_MARKER, barrelEntry, barrelHeading, barrelSection } from "#configuration/strings/catalog.strings";
import type { DocNode } from "#types/document.types";
import { titleCase } from "#core/formatters/markdown.formatter";

const LINE_BREAK = "\n";

const byTypeThenName = function byTypeThenName(left: DocNode, right: DocNode): number {
    return left.type.localeCompare(right.type) || left.name.localeCompare(right.name);
};

const sectionLines = function sectionLines(type: string): string[] {
    return ["", barrelSection(titleCase(type)), ""];
};

export const renderConcernBarrel = function renderConcernBarrel(
    concern: string,
    nodes: readonly DocNode[],
    context: { rootPrefix: string; superseded: ReadonlySet<string> },
): string {
    const sorted = nodes.toSorted(byTypeThenName);
    const lines = sorted.flatMap((node, index) => {
        const entry = barrelEntry(
            node.name,
            node.relPath.slice(context.rootPrefix.length),
            node.summary,
            context.superseded.has(node.name) ? SUPERSEDED_MARKER : "",
        );
        return sorted[index - 1]?.type === node.type ? [entry] : [...sectionLines(node.type), entry];
    });
    return [barrelHeading(titleCase(concern)), "", ...lines, ""].join(LINE_BREAK);
};
