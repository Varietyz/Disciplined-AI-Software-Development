import {
    BYTES_PER_GB,
    BYTES_PER_MB,
    CLOCK_FILL,
    CLOCK_PAD,
    CLOCK_SEPARATOR,
    DECIMALS,
    MS_PER_SECOND,
    SECONDS_PER_HOUR,
    SECONDS_PER_MINUTE,
    STAMP_LENGTH,
    STAMP_SEPARATOR,
} from "#configuration/constants/deployment.constants";
import { GIGABYTE, MEGABYTE } from "#configuration/strings/notification.strings";

const STAMP_PUNCTUATION = new Set([":", ".", "T"]);

export const formatBytes = function formatBytes(bytes: number): string {
    if (bytes >= BYTES_PER_GB) {
        return (bytes / BYTES_PER_GB).toFixed(DECIMALS) + GIGABYTE;
    }
    return (bytes / BYTES_PER_MB).toFixed(DECIMALS) + MEGABYTE;
};

export const formatDuration = function formatDuration(milliseconds: number): string {
    return (milliseconds / MS_PER_SECOND).toFixed(DECIMALS);
};

const padded = function padded(value: number): string {
    return String(value).padStart(CLOCK_PAD, CLOCK_FILL);
};

export const formatClock = function formatClock(seconds: number): string {
    const whole = Math.max(0, Math.round(seconds));
    const hours = Math.floor(whole / SECONDS_PER_HOUR);
    const minutes = Math.floor((whole % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
    return [hours, minutes, whole % SECONDS_PER_MINUTE].map(padded).join(CLOCK_SEPARATOR);
};

export const stamp = function stamp(): string {
    const iso = new Date().toISOString().slice(0, STAMP_LENGTH);
    let out = "";
    for (const character of iso) {
        out += STAMP_PUNCTUATION.has(character) ? STAMP_SEPARATOR : character;
    }
    return out;
};

export const truncate = function truncate(text: string, limit: number, marker: string): string {
    return text.length > limit ? text.slice(0, limit) + marker : text;
};
