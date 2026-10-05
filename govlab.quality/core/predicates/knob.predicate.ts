import { THRESHOLD_PARTS } from "#configuration/constants/knob.constants";

export const isThreshold = function isThreshold(name: string): boolean {
    const lowered = name.toLowerCase();
    return THRESHOLD_PARTS.some((part) => lowered.includes(part));
};
