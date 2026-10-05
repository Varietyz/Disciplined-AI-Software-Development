import { FLAG_PARITY } from "#configuration/constants/program.constants";

export const hasSymbolFlag = function hasSymbolFlag(flags: number, mask: number): boolean {
    return Math.floor(flags / mask) % FLAG_PARITY === 1;
};
