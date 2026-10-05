import { isRecord, recordAt } from "#core/selectors/record.selector";

const parseOr = function parseOr<T>(text: string, read: (parsed: unknown) => T, fallback: T): T {
    try {
        return read(JSON.parse(text));
    } catch (error) {
        if (error instanceof SyntaxError) {
            return fallback;
        }
        throw error;
    }
};

export const parseJsonRecords = (text: string): Record<string, unknown>[] =>
    parseOr(text, (parsed) => (Array.isArray(parsed) ? parsed.filter(isRecord) : []), []);

export const jsonRecordsAt = (text: string, key: string): Record<string, unknown>[] =>
    parseOr(
        text,
        (parsed) => {
            const list = isRecord(parsed) ? parsed[key] : [];
            return Array.isArray(list) ? list.filter(isRecord) : [];
        },
        [],
    );

export const jsonRecord = (text: string): Record<string, unknown> =>
    parseOr(text, (parsed) => (isRecord(parsed) ? parsed : {}), {});

export const jsonRecordsFlexible = (text: string): Record<string, unknown>[] =>
    parseOr(
        text,
        (parsed) => {
            if (Array.isArray(parsed)) {
                return parsed.filter(isRecord);
            }
            return isRecord(parsed) ? [parsed] : [];
        },
        [],
    );

export const jsonArray = (text: string): unknown[] =>
    parseOr(text, (parsed): unknown[] => (Array.isArray(parsed) ? parsed.map((item: unknown) => item) : []), []);

export const objectEntriesAt = (text: string, key: string): [string, Record<string, unknown>][] =>
    Object.entries(recordAt(jsonRecord(text), key)).filter((entry): entry is [string, Record<string, unknown>] =>
        isRecord(entry[1]),
    );
