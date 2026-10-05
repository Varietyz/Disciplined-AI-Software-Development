import { ABSENT_SENTINEL, digestOf, fingerprint, fingerprintOf, hashFile } from "@govlab/content-fingerprint";
import {
    HASH_ALGORITHM,
    HASH_ENCODING,
    RECORD_SEPARATOR,
    UNIT_SEPARATOR,
} from "@govlab/content-fingerprint/configuration/constants/fingerprint.constants.ts";
import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { withTemp } from "./fingerprint.fixture.ts";
import { writeVerbatim } from "@govlab/canonical-write";

describe("hashFile", () => {
    it("hashes file bytes deterministically and returns a sentinel for a missing file", () => {
        withTemp((dir) => {
            const file = join(dir, "a.txt");
            writeVerbatim(file, "one");
            expect(hashFile(file)).toBe(createHash(HASH_ALGORITHM).update("one").digest(HASH_ENCODING));
            expect(hashFile(join(dir, "missing.txt"))).toBe(ABSENT_SENTINEL);
        });
    });
});

describe("fingerprint", () => {
    it("is independent of input order but sensitive to content", () => {
        withTemp((dir) => {
            const a = join(dir, "a.txt");
            const b = join(dir, "b.txt");
            writeVerbatim(a, "alpha");
            writeVerbatim(b, "beta");
            const forward = fingerprint([a, b]);
            expect(fingerprint([b, a])).toBe(forward);
            writeVerbatim(b, "beta-changed");
            expect(fingerprint([a, b])).not.toBe(forward);
        });
    });

    it("folds each path and its content hash between the unit and record separators", () => {
        withTemp((dir) => {
            const a = join(dir, "a.txt");
            writeVerbatim(a, "alpha");
            const expected = createHash(HASH_ALGORITHM)
                .update(`${a}${UNIT_SEPARATOR}${hashFile(a)}${RECORD_SEPARATOR}`)
                .digest(HASH_ENCODING);
            expect(fingerprint([a])).toBe(expected);
        });
    });
});

describe("digestOf", () => {
    it("hashes a body's exact bytes, so it differs from the separated composite of the same body", () => {
        const body = '{"a":1}\n';
        expect(digestOf(body)).toBe(createHash(HASH_ALGORITHM).update(body).digest(HASH_ENCODING));
        expect(digestOf(body)).not.toBe(fingerprintOf([body]));
    });
});

describe("fingerprintOf", () => {
    it("combines ordered parts deterministically", () => {
        const combined = fingerprintOf(["shared", "own"]);
        expect(fingerprintOf(["shared", "own"])).toBe(combined);
        expect(fingerprintOf(["own", "shared"])).not.toBe(combined);
    });
});
