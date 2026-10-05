import { describe, expect, it } from "vitest";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const SEED = 42;
const OTHER_SEED = 7;
const SAMPLES = 100;

describe("createRng", () => {
    it("is deterministic for a given seed", () => {
        const a = createRng(SEED);
        const b = createRng(SEED);
        expect([a.next(), a.next(), a.next()]).toStrictEqual([b.next(), b.next(), b.next()]);
    });

    it("stays within [0, 1)", () => {
        const rng = createRng(OTHER_SEED);
        for (let i = 0; i < SAMPLES; i += 1) {
            const value = rng.next();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    it("treats a zero seed as a usable state", () => {
        expect(createRng(0).next()).toBeGreaterThan(0);
    });
});
