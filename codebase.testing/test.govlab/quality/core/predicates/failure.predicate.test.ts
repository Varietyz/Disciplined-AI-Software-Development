import { describe, expect, it } from "vitest";
import {
    isModuleMissing,
    isNotFound,
    signalKilled,
    statusIn,
} from "@govlab/quality/core/predicates/failure.predicate.ts";

const ARBITRARY_STATUS = 2;
const WINDOWS_KILL_STATUS = 3_221_226_505;

describe("signalKilled", () => {
    it("is true only for a null status, false for every real exit code", () => {
        expect(signalKilled(null)).toBe(true);
        expect(signalKilled(0)).toBe(false);
        expect(signalKilled(1)).toBe(false);
        expect(signalKilled(ARBITRARY_STATUS)).toBe(false);
        expect(signalKilled(WINDOWS_KILL_STATUS)).toBe(false);
    });
});

describe("isNotFound and statusIn", () => {
    it("recognizes a missing binary by its errno code", () => {
        const missing = Object.assign(new Error("spawn x ENOENT"), { code: "ENOENT" });
        expect(isNotFound(missing)).toBe(true);
        expect(isNotFound(new Error("other"))).toBe(false);
    });

    it("recognizes an unresolvable module by its code, and nothing that is not an error", () => {
        const missing = Object.assign(new Error("Cannot find module 'x'"), { code: "MODULE_NOT_FOUND" });
        expect(isModuleMissing(missing)).toBe(true);
        const esmMissing = Object.assign(new Error("esm"), { code: "ERR_MODULE_NOT_FOUND" });
        expect(isModuleMissing(esmMissing)).toBe(true);
        expect(isModuleMissing(new Error("other"))).toBe(false);
        expect(isModuleMissing({ code: "MODULE_NOT_FOUND" })).toBe(false);
    });

    it("treats a null status as zero when checking membership", () => {
        expect(statusIn(new Set([0]), null)).toBe(true);
        expect(statusIn(new Set([0]), ARBITRARY_STATUS)).toBe(false);
    });
});
