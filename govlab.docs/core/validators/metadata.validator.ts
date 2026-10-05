import type { FieldCheck, FieldSpec, FrontmatterSchema, FrontmatterSchemaDefect } from "#types/metadata.types";
import { fieldLine, listValues, parseFrontmatter } from "#core/parsers/metadata.parser";
import {
    invalidBoolean,
    invalidEnum,
    invalidInteger,
    invalidKebab,
    invalidList,
    invalidListEntry,
    missingRequiredField,
} from "#configuration/strings/document.strings";
import { isAsciiLower } from "#core/predicates/character.predicate";
import { isDigit } from "@govlab/constants";

const LIST_SEPARATOR = ", ";
const SAMPLE_SIZE = 2;
const KEBAB_JOIN = "-";
const BOOLEAN_VALUES: ReadonlySet<string> = new Set(["true", "false"]);

const everyChar = function everyChar(value: string, accept: (char: string) => boolean): boolean {
    if (value.length === 0) {
        return false;
    }
    for (const char of value) {
        if (!accept(char)) {
            return false;
        }
    }
    return true;
};

const isKebabChar = function isKebabChar(char: string): boolean {
    return isAsciiLower(char) || isDigit(char) || char === KEBAB_JOIN;
};

const typeDefect = function typeDefect(field: string, value: string, kind: FieldSpec["kind"]): string | null {
    if (kind === "integer" && !everyChar(value, isDigit)) {
        return invalidInteger(field, value);
    }
    if (kind === "boolean" && !BOOLEAN_VALUES.has(value)) {
        return invalidBoolean(field, value);
    }
    if (kind === "kebab" && !everyChar(value, isKebabChar)) {
        return invalidKebab(field, value);
    }
    return null;
};

const itemsDefects = function itemsDefects(check: FieldCheck): FrontmatterSchemaDefect[] {
    const { source, field, value, spec } = check;
    const allowed = spec.items;
    if (!allowed) {
        return [];
    }
    const line = fieldLine(source, field);
    const entries = listValues(value);
    if (entries === null) {
        const sample = allowed.slice(0, SAMPLE_SIZE).join(LIST_SEPARATOR);
        return [{ code: "invalid-type", detail: invalidList(field, value, sample), field, line }];
    }
    const known = allowed.join(LIST_SEPARATOR);
    return entries
        .filter((entry) => !allowed.includes(entry))
        .map((entry): FrontmatterSchemaDefect => ({
            code: "invalid-enum",
            detail: invalidListEntry(field, entry, known),
            field,
            line,
        }));
};

const fieldDefects = function fieldDefects(check: FieldCheck): FrontmatterSchemaDefect[] {
    const { source, field, value, spec } = check;
    const line = fieldLine(source, field);
    const enumDefects: FrontmatterSchemaDefect[] =
        spec.enum && !spec.enum.includes(value)
            ? [{ code: "invalid-enum", detail: invalidEnum(field, value, spec.enum.join(LIST_SEPARATOR)), field, line }]
            : [];
    const typeError = typeDefect(field, value, spec.kind);
    const typeDefects: FrontmatterSchemaDefect[] =
        typeError === null ? [] : [{ code: "invalid-type", detail: typeError, field, line }];
    return [...itemsDefects(check), ...enumDefects, ...typeDefects];
};

export const frontmatterSchema = function frontmatterSchema(
    source: string,
    schema: FrontmatterSchema,
): FrontmatterSchemaDefect[] {
    const { fields } = parseFrontmatter(source);
    const missing: FrontmatterSchemaDefect[] = schema.required
        .filter((key) => (fields[key] ?? "") === "")
        .map((key): FrontmatterSchemaDefect => ({
            code: "missing-required",
            detail: missingRequiredField(key),
            field: key,
            line: 1,
        }));
    const invalid = Object.entries(fields).flatMap(([field, value]) => {
        const spec = schema.fields[field];
        return spec === undefined ? [] : fieldDefects({ field, source, spec, value });
    });
    return [...missing, ...invalid];
};
