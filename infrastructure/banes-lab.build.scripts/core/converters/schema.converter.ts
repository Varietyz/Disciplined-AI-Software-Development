import { GRAMMAR_LEVELS, SCHEMA_DESCRIPTION } from "#configuration/strings/catalog.strings";
import type { GrammarKind, Leaf } from "#types/catalog.types";
import { INDEX_KIND, MAP_KEY_THRESHOLD, SCHEMA_DIALECT, SCHEMA_KIND } from "#configuration/constants/catalog.constants";
import type { JsonSchema, KindSamples } from "#types/schema.types";
import { JSON_ROUTE } from "#configuration/constants/site.constants";
import { isRecord } from "#core/selectors/base.selector";
import { kindOfAddress } from "#core/converters/catalog.grammar.converter";
import { schemaLeaf } from "#core/resolvers/catalog.resolver";

const SCHEMA_REF = "api:schema/";

export const typeOf = function typeOf(value: unknown): string {
    if (value === null) {
        return "null";
    }
    if (Array.isArray(value)) {
        return "array";
    }
    if (typeof value === "number") {
        return Number.isInteger(value) ? "integer" : "number";
    }
    return typeof value;
};

const typesOf = function typesOf(values: readonly unknown[]): string | readonly string[] {
    const types = new Set(values.map(typeOf));
    if (types.has("number")) {
        types.delete("integer");
    }
    const sorted = [...types].toSorted((left, right) => left.localeCompare(right));
    return sorted.length === 1 ? (sorted[0] ?? "") : sorted;
};

const objectSchema = function objectSchema(objects: readonly Record<string, unknown>[]): JsonSchema {
    const keys = [...new Set(objects.flatMap((object) => Object.keys(object)))].toSorted((left, right) =>
        left.localeCompare(right),
    );
    if (keys.length > MAP_KEY_THRESHOLD) {
        return { additionalProperties: inferSchema(objects.flatMap((object) => Object.values(object))) };
    }
    const properties = Object.fromEntries(
        keys.map((key) => [key, inferSchema(objects.filter((object) => key in object).map((object) => object[key]))]),
    );
    const required = keys.filter((key) => objects.every((object) => key in object));
    return { properties, required };
};

export const isObjectValue = function isObjectValue(value: unknown): value is Record<string, unknown> {
    return isRecord(value) && !Array.isArray(value);
};

export const inferSchema = function inferSchema(values: readonly unknown[]): JsonSchema {
    const objects = values.filter(isObjectValue);
    const arrays = values.filter((value): value is readonly unknown[] => Array.isArray(value));
    return {
        type: typesOf(values),
        ...(objects.length === 0 ? {} : objectSchema(objects)),
        ...(arrays.length === 0 ? {} : { items: inferSchema(arrays.flat()) }),
    };
};

export const inferredKindOf = function inferredKindOf(address: string): GrammarKind | null {
    if (!address.startsWith(JSON_ROUTE)) {
        return null;
    }
    const kind = kindOfAddress(address);
    return kind === SCHEMA_KIND ? null : kind;
};

export const samplesOf = function samplesOf(files: ReadonlyMap<string, string>, drafts: readonly Leaf[]): KindSamples {
    const samples = new Map<GrammarKind, unknown[]>();
    const add = (address: string, data: () => unknown): void => {
        const kind = inferredKindOf(address);
        if (kind === null) {
            return;
        }
        const held = samples.get(kind);
        if (held === undefined) {
            samples.set(kind, [data()]);
        } else {
            held.push(data());
        }
    };
    for (const [address, body] of files) {
        add(address, () => JSON.parse(body));
    }
    for (const leaf of drafts) {
        add(leaf.identity.address.json, () => leaf.data);
    }
    return samples;
};

export const schemaLeaves = function schemaLeaves(samples: KindSamples, site: string): readonly Leaf[] {
    return [...samples.entries()].map(([kind, values]): Leaf => {
        const address = schemaLeaf(kind);
        const ref = SCHEMA_REF + kind;
        const title = GRAMMAR_LEVELS[kind];
        const data = {
            $id: site + address.json,
            $schema: SCHEMA_DIALECT,
            description: SCHEMA_DESCRIPTION,
            ref,
            title,
            ...inferSchema(values),
        };
        return { data, identity: { address, href: null, kind: INDEX_KIND, ref, summary: null, title }, markdown: null };
    });
};
