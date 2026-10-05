import type { Rng } from "#types/seed.types";

const TWO = 2;

export const gaussian = function gaussian(rng: Rng, mean = 0, stddev = 1): number {
    const u1 = 1 - rng.next();
    const u2 = rng.next();
    const z = Math.sqrt(-TWO * Math.log(u1)) * Math.cos(TWO * Math.PI * u2);
    return mean + z * stddev;
};
