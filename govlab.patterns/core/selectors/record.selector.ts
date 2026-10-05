import { isRecord } from "#core/predicates/record.predicate";

export const foldRecords = function foldRecords(
    chunk: readonly unknown[],
    field: string,
    observe: (value: unknown) => void,
): void {
    for (const record of chunk) {
        if (isRecord(record) && field in record) {
            observe(record[field]);
        }
    }
};
