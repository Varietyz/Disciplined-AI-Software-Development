import type { DocTypeSchema, MetaConcern, SchemaDefect } from "#types/document.types";
import { missingSection, sectionOutOfOrder } from "#configuration/strings/document.strings";
import { splitLines } from "#core/parsers/markdown.parser";

const HEADING_PREFIX = "## ";

const headings = function headings(source: string): string[] {
    return splitLines(source)
        .filter((line) => line.startsWith(HEADING_PREFIX))
        .map((line) => line.slice(HEADING_PREFIX.length).trim());
};

const firstMatch = function firstMatch(present: readonly string[], names: readonly string[], from: number): number {
    const at = present.slice(from).findIndex((heading) => names.includes(heading));
    return at === -1 ? -1 : at + from;
};

const namesOf = function namesOf(meta: MetaConcern): string[] {
    return [meta.concern, ...(meta.aliases ?? [])];
};

const missingDefect = function missingDefect(concern: string): SchemaDefect {
    return { code: "off-schema", concern, remediation: missingSection(concern) };
};

const orderedDefect = function orderedDefect(present: readonly string[], meta: MetaConcern): SchemaDefect {
    const outOfOrder = firstMatch(present, namesOf(meta), 0) !== -1;
    return {
        code: "off-schema",
        concern: meta.concern,
        remediation: outOfOrder ? sectionOutOfOrder(meta.concern) : missingSection(meta.concern),
    };
};

const unorderedDefects = function unorderedDefects(
    present: readonly string[],
    required: readonly MetaConcern[],
): SchemaDefect[] {
    return required
        .filter((meta) => firstMatch(present, namesOf(meta), 0) === -1)
        .map((meta) => missingDefect(meta.concern));
};

const orderedDefects = function orderedDefects(
    present: readonly string[],
    required: readonly MetaConcern[],
): SchemaDefect[] {
    const defects: SchemaDefect[] = [];
    let cursor = 0;
    for (const meta of required) {
        const at = firstMatch(present, namesOf(meta), cursor);
        if (at === -1) {
            defects.push(orderedDefect(present, meta));
        } else {
            cursor = at + 1;
        }
    }
    return defects;
};

export const offSchema = function offSchema(source: string, schema: DocTypeSchema): SchemaDefect[] {
    const present = headings(source);
    const required = schema.metaConcerns
        .toSorted((left, right) => left.order - right.order)
        .filter((meta) => meta.required);
    return schema.ordered === false ? unorderedDefects(present, required) : orderedDefects(present, required);
};
