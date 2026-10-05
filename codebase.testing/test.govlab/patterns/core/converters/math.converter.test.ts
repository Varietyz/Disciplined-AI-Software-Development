import { describe, expect, it } from "vitest";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";
import { gaussian } from "@govlab/patterns/core/converters/math.converter.ts";

const SEED = 1;
const MEAN = 10;
const SPREAD = 0;

describe("gaussian", () => {
    it("is reproducible under a fixed seed", () => {
        expect(gaussian(createRng(SEED))).toBe(gaussian(createRng(SEED)));
    });

    it("returns the mean exactly when the spread is zero", () => {
        expect(gaussian(createRng(SEED), MEAN, SPREAD)).toBe(MEAN);
    });
});
