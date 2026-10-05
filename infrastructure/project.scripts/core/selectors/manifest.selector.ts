import { WILDCARD } from "#configuration/constants/closure.constants";
import { isRecord } from "@banes-lab/build-scripts/core/selectors/base.selector.ts";

export const stringAt = function stringAt(value: unknown, key: string): string {
    const found = isRecord(value) ? value[key] : undefined;
    return typeof found === "string" ? found : "";
};

export const stringRecordAt = function stringRecordAt(value: unknown, key: string): Readonly<Record<string, string>> {
    const nested = isRecord(value) ? value[key] : undefined;
    if (!isRecord(nested)) {
        return {};
    }
    return Object.fromEntries(
        Object.entries(nested).flatMap(([name, target]) => (typeof target === "string" ? [[name, target]] : [])),
    );
};

export const exportPatternsOf = function exportPatternsOf(manifest: unknown): readonly (readonly [string, string])[] {
    return Object.entries(stringRecordAt(manifest, "exports"))
        .flatMap(([key, target]): [string, string][] =>
            key.endsWith(WILDCARD) ? [[key.slice(0, -WILDCARD.length), target]] : [],
        )
        .toSorted(([left], [right]) => right.length - left.length);
};
