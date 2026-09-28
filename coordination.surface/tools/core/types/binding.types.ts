import type { RESOLUTION_STATES } from "../constants/binding.constants.ts";

export interface SlotUse {
    readonly name: string;
    readonly line: number;
}

export type Resolution = (typeof RESOLUTION_STATES)[number];
