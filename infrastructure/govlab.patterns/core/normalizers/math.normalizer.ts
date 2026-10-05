const DECIMAL_BASE = 10;

export const roundTo = function roundTo(value: number, digits: number): number {
    const scale = DECIMAL_BASE ** digits;
    return Math.round(value * scale) / scale;
};

export const fixedTo = function fixedTo(value: number, digits: number): number {
    return Number(value.toFixed(digits));
};
