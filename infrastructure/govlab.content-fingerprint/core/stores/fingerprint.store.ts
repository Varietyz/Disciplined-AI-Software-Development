import type { FingerprintIndex, FingerprintIndexOptions } from "#types/fingerprint.types";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { INDEX_INDENT } from "#configuration/constants/fingerprint.constants";
import { dirname } from "node:path";
import { writeVerbatim } from "@govlab/canonical-write";

const isStringRecord = function isStringRecord(value: unknown): value is Record<string, string> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.values(value).every((held) => typeof held === "string")
    );
};

const parsedIndex = function parsedIndex(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch (error) {
        if (error instanceof SyntaxError) {
            return null;
        }
        throw error;
    }
};

const readIndex = function readIndex(file: string): Record<string, string> {
    if (!existsSync(file)) {
        return {};
    }
    const parsed = parsedIndex(readFileSync(file, "utf8"));
    return isStringRecord(parsed) ? parsed : {};
};

export const createFingerprintIndex = function createFingerprintIndex(
    options: FingerprintIndexOptions,
): FingerprintIndex {
    const state = readIndex(options.file);
    const force = options.force ?? false;
    return {
        flush(): void {
            mkdirSync(dirname(options.file), { recursive: true });
            writeVerbatim(options.file, `${JSON.stringify(state, null, INDEX_INDENT)}\n`);
        },
        unchanged(key: string, hash: string): boolean {
            return !force && state[key] === hash;
        },
        update(key: string, hash: string): void {
            state[key] = hash;
        },
    };
};
