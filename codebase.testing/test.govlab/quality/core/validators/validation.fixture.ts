import type { Finding } from "@govlab/quality/types/finding.types.ts";
import { loadValidators } from "@govlab/quality/core/coordinators/validation.coordinator.ts";

const validators = await loadValidators();

export const validateWith = function validateWith(
    id: string,
    entries: readonly [string, string][],
    consumerEntries: readonly [string, string][] = [],
): Finding[] {
    const files = entries.map(([path, content]) => ({ content, path }));
    const consumers = consumerEntries.map(([path, content]) => ({ content, path }));
    return validators
        .filter((validator) => validator.id === id)
        .flatMap((validator) => validator.validate(files, consumers));
};
