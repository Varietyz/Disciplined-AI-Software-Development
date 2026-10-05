import { DataLoadError } from "#core/classifiers/schema.classifier";
import { FieldAccumulator } from "#core/aggregators/field.aggregator";
import type { FieldSchema } from "#types/schema.types";
import { isRecord } from "#core/predicates/record.predicate";
import { notAnObject } from "#configuration/strings/schema.strings";

const accumulatorFor = function accumulatorFor(fields: Map<string, FieldAccumulator>, key: string): FieldAccumulator {
    const existing = fields.get(key);
    if (existing) {
        return existing;
    }
    const created = new FieldAccumulator();
    fields.set(key, created);
    return created;
};

export const detectSchema = function detectSchema(
    records: Iterable<unknown>,
    floatFields: ReadonlySet<string> = new Set(),
): FieldSchema[] {
    const fields = new Map<string, FieldAccumulator>();
    let count = 0;
    for (const record of records) {
        if (!isRecord(record)) {
            throw new DataLoadError(notAnObject(JSON.stringify(record)));
        }
        count += 1;
        for (const [key, value] of Object.entries(record)) {
            accumulatorFor(fields, key).observe(value, floatFields.has(key));
        }
    }
    return [...fields.entries()].map(([name, accumulator]) => accumulator.result(name, count));
};
