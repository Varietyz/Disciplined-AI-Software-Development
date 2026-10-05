import {
    ABSENT_SENTINEL,
    HASH_ALGORITHM,
    HASH_ENCODING,
    RECORD_SEPARATOR,
    UNIT_SEPARATOR,
} from "#configuration/constants/fingerprint.constants";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

export const hashFile = function hashFile(file: string): string {
    if (!existsSync(file)) {
        return ABSENT_SENTINEL;
    }
    return createHash(HASH_ALGORITHM).update(readFileSync(file)).digest(HASH_ENCODING);
};

export const fingerprint = function fingerprint(files: readonly string[]): string {
    const hasher = createHash(HASH_ALGORITHM);
    for (const file of [...files].sort((a, b) => a.localeCompare(b))) {
        hasher.update(file);
        hasher.update(UNIT_SEPARATOR);
        hasher.update(hashFile(file));
        hasher.update(RECORD_SEPARATOR);
    }
    return hasher.digest(HASH_ENCODING);
};

export const digestOf = function digestOf(body: string): string {
    return createHash(HASH_ALGORITHM).update(body).digest(HASH_ENCODING);
};

export const fingerprintOf = function fingerprintOf(parts: readonly string[]): string {
    const hasher = createHash(HASH_ALGORITHM);
    for (const part of parts) {
        hasher.update(part);
        hasher.update(RECORD_SEPARATOR);
    }
    return hasher.digest(HASH_ENCODING);
};
