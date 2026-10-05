import { isPlainRecord, isStringList } from "#core/predicates/record.predicate";
import { PATH_MARK } from "#configuration/constants/field.constants";

const stepInto = function stepInto(held: unknown, key: string): unknown {
    if (Array.isArray(held)) {
        return held.flatMap((item) => {
            const value = stepInto(item, key);
            return value === undefined ? [] : [value];
        });
    }
    return isPlainRecord(held) ? held[key] : undefined;
};

export const fieldValue = function fieldValue(record: unknown, path: string): unknown {
    return path.split(PATH_MARK).reduce(stepInto, record);
};

export const valuesAt = function valuesAt(record: unknown, path: string): string[] {
    const value = fieldValue(record, path);
    if (typeof value === "string") {
        return [value];
    }
    return isStringList(value) ? value : [];
};
