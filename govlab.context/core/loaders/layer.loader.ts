import type { ReadAudit } from "#core/observers/record.observer";
import { absolutePath } from "@ssot/paths";
import { isObject } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { readJsonFile } from "#core/loaders/ontology.loader";

export const readLayerList = function readLayerList<T>(
    audit: ReadAudit,
    file: string,
    key: string,
    coerce: (value: unknown) => T | null,
): T[] {
    const raw = readJsonFile(join(absolutePath("govlab.context.layers"), file));
    if (!isObject(raw)) {
        audit.reject(raw, file);
        return [];
    }
    return audit.records(audit.track(raw, file)[key], file).flatMap((item) => {
        const coerced = coerce(item);
        if (coerced === null) {
            audit.reject(item, file);
            return [];
        }
        return [coerced];
    });
};
