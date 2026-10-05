import type { DefinitionData, SourceData } from "#types/source.types";
import { addressLines, blocks, code, fenced, heading, quote, section } from "#core/formatters/markdown.formatter";
import { placementLine, relationSections } from "#core/formatters/link.formatter";

const definitionLine = function definitionLine(definition: DefinitionData): string {
    const exported = definition.exported ? ", exported" : "";
    return `${code(definition.name)} (${definition.kind}, line ${String(definition.line)}${exported})`;
};

export const renderSourceLeaf = function renderSourceLeaf(
    data: SourceData,
    treeLabel: string,
    text: string | null,
): string {
    return blocks([
        heading(data.path),
        quote(data.summary),
        addressLines([
            ["Tree", treeLabel],
            ["Language", data.language],
            ["Layer", data.layer],
            ["Canonical", data.href],
            ["Source text", data.text],
        ]),
        placementLine(data),
        section("Definitions", data.definitions.map(definitionLine)),
        ...relationSections(data.relations),
        text === null ? null : `## Source\n\n${fenced(text, data.language)}`,
    ]);
};
