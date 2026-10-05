import type { Rng } from "#types/seed.types";

const MODULUS = 2_147_483_647;
const MULTIPLIER = 16_807;

export const createRng = function createRng(seed: number): Rng {
    let state = Math.abs(Math.floor(seed)) % MODULUS;
    if (state === 0) {
        state = 1;
    }
    return {
        next(): number {
            state = (state * MULTIPLIER) % MODULUS;
            return state / MODULUS;
        },
    };
};
