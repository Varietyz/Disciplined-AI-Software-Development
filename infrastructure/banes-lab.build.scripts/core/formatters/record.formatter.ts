import { addressLines, blocks, code, heading, quote } from "#core/formatters/markdown.formatter";
import { linkText, placementLine, relationSections } from "#core/formatters/link.formatter";
import { FORMED_BY_LABEL } from "@banes-lab/web/strings/ontology.strings";
import type { RecordData } from "#types/record.types";

const SEPARATOR = ", ";

const textField = function textField(data: object, key: string): string | null {
    const value: unknown = Reflect.get(data, key);
    if (Array.isArray(value)) {
        return value.length === 0 ? null : value.join(SEPARATOR);
    }
    return typeof value === "string" && value.length > 0 ? value : null;
};

export const renderRecordLeaf = function renderRecordLeaf(data: RecordData): string {
    return blocks([
        heading(data.name),
        quote(data.summary),
        addressLines([
            ["Record", code(data.ref)],
            ["Kind", data.kind],
            ["Layer", data.layer === null ? null : linkText(data.layer)],
            ["Severity", textField(data, "severity")],
            ["Scope", textField(data, "scope")],
            ["Aliases", textField(data, "aliases")],
            [FORMED_BY_LABEL, textField(data, "formedBy")],
            ["Canonical", data.href],
            ["Closure", textField(data, "closure")],
        ]),
        placementLine(data),
        ...relationSections(data.relations),
    ]);
};
