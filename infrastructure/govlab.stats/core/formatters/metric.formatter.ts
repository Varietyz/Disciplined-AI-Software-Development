import {
    BYTES_PER_UNIT,
    BYTE_UNITS,
    NUMBER_LOCALE,
    ONE_DECIMAL,
    PERCENT,
} from "#configuration/constants/metric.constants";

export const humanBytes = function humanBytes(bytes: number): string {
    let value = bytes;
    let unit = 0;
    while (value >= BYTES_PER_UNIT && unit < BYTE_UNITS.length - 1) {
        value /= BYTES_PER_UNIT;
        unit += 1;
    }
    return `${value.toFixed(unit === 0 ? 0 : ONE_DECIMAL)} ${BYTE_UNITS.at(unit) ?? ""}`;
};

export const num = function num(value: number): string {
    return value.toLocaleString(NUMBER_LOCALE);
};

export const pct = function pct(part: number, whole: number): string {
    if (whole <= 0) {
        return `${(0).toFixed(ONE_DECIMAL)}%`;
    }
    return `${((part / whole) * PERCENT).toFixed(ONE_DECIMAL)}%`;
};
