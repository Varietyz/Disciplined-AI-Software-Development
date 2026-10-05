import { NOT_A_SCHEMA, missingSchema } from "#configuration/strings/catalog.strings";
import { fileOfAddress, schemaLeaf } from "#core/resolvers/catalog.resolver";
import { instanceDefects, schemaShapeDefects } from "#core/validators/schema.validator";
import type { Finding } from "#types/validation.types";
import type { JsonSchema } from "#types/schema.types";
import { SCHEMA_KIND } from "#configuration/constants/catalog.constants";
import { isObjectValue } from "#core/converters/schema.converter";
import { join } from "node:path";
import { kindOrNull } from "#core/converters/catalog.grammar.converter";
import { readFileSync } from "node:fs";

const JSON_EXTENSION = ".json";
const SLASH = "/";
const ROOT_PATH = "$";

const jsonAt = function jsonAt(outDir: string, file: string): unknown {
    return JSON.parse(readFileSync(join(outDir, file), "utf8"));
};

const addressOf = function addressOf(file: string): string {
    return SLASH + file.slice(0, -JSON_EXTENSION.length);
};

const schemaOf = function schemaOf(outDir: string, kind: string, present: ReadonlySet<string>): JsonSchema | null {
    const file = fileOfAddress(schemaLeaf(kind).json);
    if (!present.has(file)) {
        return null;
    }
    const parsed = jsonAt(outDir, file);
    return isObjectValue(parsed) ? parsed : null;
};

const shapeFindings = function shapeFindings(outDir: string, file: string): Finding[] {
    const parsed = jsonAt(outDir, file);
    const shape = isObjectValue(parsed) ? schemaShapeDefects(parsed, ROOT_PATH) : [NOT_A_SCHEMA];
    return shape.map((message) => ({ file, message }));
};

export const schemaFindings = function schemaFindings(
    outDir: string,
    files: readonly string[],
    present: ReadonlySet<string>,
): Finding[] {
    const schemas = new Map<string, JsonSchema | null>();
    const schemaFor = function schemaFor(kind: string): {
        readonly found: Finding[];
        readonly schema: JsonSchema | null;
    } {
        if (schemas.has(kind)) {
            return { found: [], schema: schemas.get(kind) ?? null };
        }
        const schema = schemaOf(outDir, kind, present);
        schemas.set(kind, schema);
        const found =
            schema === null ? [{ file: fileOfAddress(schemaLeaf(kind).json), message: missingSchema(kind) }] : [];
        return { found, schema };
    };
    const findingsOf = function findingsOf(file: string): Finding[] {
        const kind = kindOrNull(addressOf(file));
        if (kind === null) {
            return [];
        }
        if (kind === SCHEMA_KIND) {
            return shapeFindings(outDir, file);
        }
        const { found, schema } = schemaFor(kind);
        const defects =
            schema === null
                ? []
                : instanceDefects(jsonAt(outDir, file), schema, ROOT_PATH).map((message) => ({ file, message }));
        return [...found, ...defects];
    };
    return files.flatMap(findingsOf);
};
