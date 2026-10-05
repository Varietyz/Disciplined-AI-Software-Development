import type { Logger } from "#types/ontology.types";
import { debugLine } from "#configuration/strings/ontology.strings";
import process from "node:process";

export const NOOP_LOGGER: Logger = { warn: () => {} };

export const debugLogger = function debugLogger(enabled: boolean): Logger {
    if (!enabled) {
        return NOOP_LOGGER;
    }
    return {
        warn: (message, detail) => {
            process.stderr.write(`${debugLine(message)} ${JSON.stringify(detail ?? null)}\n`);
        },
    };
};
