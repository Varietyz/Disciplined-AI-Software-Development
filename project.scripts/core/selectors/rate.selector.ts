import { COUNT_MARKER, RECORD_MARKER, UPDATE_MARKER } from "#configuration/constants/rate.constants";
import type { RateRecord } from "#types/rate.types";
import { isRecord } from "@banes-lab/build-scripts/core/selectors/base.selector.ts";
import { unreadableRecord } from "#configuration/strings/rate.strings";

const OPEN = "{";
const CLOSE = "}";
const QUOTE = '"';
const ESCAPE = "\\";
const TAG_END = ">";
const TAG_START = "<";
const DEPTH_STEP: ReadonlyMap<string, number> = new Map([
    [OPEN, 1],
    [CLOSE, -1],
]);

const objectEnd = function objectEnd(text: string, start: number): number {
    let depth = 0;
    let inString = false;
    for (let at = start; at < text.length; at += 1) {
        const char = text.charAt(at);
        if (inString) {
            at += char === ESCAPE ? 1 : 0;
            inString = char !== QUOTE;
        } else {
            inString = char === QUOTE;
            depth += DEPTH_STEP.get(char) ?? 0;
            if (depth === 0 && char === CLOSE) {
                return at;
            }
        }
    }
    return -1;
};

const stringsOf = function stringsOf(value: unknown, fallback: unknown): string[] {
    const list: unknown[] = Array.isArray(value) ? value : [fallback];
    return list.filter((item): item is string => typeof item === "string");
};

const numberOf = function numberOf(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const rateOf = function rateOf(raw: Record<string, unknown>): number | null {
    const exact = numberOf(raw["dailyRateEur"]);
    if (exact !== null) {
        return exact;
    }
    const low = numberOf(raw["dayRateMin"]);
    const high = numberOf(raw["dayRateMax"]) ?? low;
    return low === null || high === null ? null : (low + high) / 2;
};

const recordOf = function recordOf(raw: unknown): RateRecord | null {
    if (!isRecord(raw)) {
        return null;
    }
    const rate = rateOf(raw);
    const id = raw["externalId"];
    if (rate === null || typeof id !== "string") {
        return null;
    }
    return {
        country: typeof raw["country"] === "string" ? raw["country"] : "",
        createdAt: numberOf(raw["createdAtUtc"]) ?? 0,
        id,
        rate,
        seniorities: stringsOf(raw["seniorities"], raw["seniority"]),
        titles: stringsOf(raw["jobTitles"], raw["jobTitle"]),
    };
};

const parsedAt = function parsedAt(text: string, start: number, end: number): RateRecord | null {
    try {
        const parsed: unknown = JSON.parse(text.slice(start, end + 1));
        return recordOf(parsed);
    } catch (error: unknown) {
        throw new Error(unreadableRecord(start), { cause: error });
    }
};

export const recordsIn = function recordsIn(html: string): readonly RateRecord[] {
    const byId = new Map<string, RateRecord>();
    let start = html.indexOf(RECORD_MARKER);
    while (start !== -1) {
        const end = objectEnd(html, start);
        const record = end === -1 ? null : parsedAt(html, start, end);
        if (record !== null) {
            byId.set(record.id, record);
        }
        start = end === -1 ? -1 : html.indexOf(RECORD_MARKER, end + 1);
    }
    return [...byId.values()];
};

const textAfter = function textAfter(html: string, marker: string): string {
    const at = html.indexOf(marker);
    const open = at === -1 ? -1 : html.indexOf(TAG_END, at);
    const close = open === -1 ? -1 : html.indexOf(TAG_START, open);
    return close === -1 ? "" : html.slice(open + 1, close).trim();
};

export const statedCount = function statedCount(html: string): number | null {
    const text = textAfter(html, COUNT_MARKER);
    const count = Number(text);
    return text.length > 0 && Number.isInteger(count) ? count : null;
};

export const statedUpdate = function statedUpdate(html: string): string {
    return textAfter(html, UPDATE_MARKER);
};
