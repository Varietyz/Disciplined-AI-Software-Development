import { delimitersIn } from "../analyzers/fence.analyzer.ts";

const INDENT = "           ";

const WRAP_WIDTH = 120;

const ORDINAL_SEPARATOR = "-";

const TO_PREFIX = "To ";

export const KIND_FIELD = "kind:";

export const AT_FIELD = "at:";

export const TO_FIELD = "to:";

export const READ_FIELD = "read:";

const ADDRESS_PUNCTUATION = new Set([",", ":", ";", "."]);

const wrappedSegment = function wrappedSegment(text: string): string[] {
    const out: string[] = [];
    let line = "";

    for (const word of text.split(" ")) {
        if (line.length > 0 && line.length + word.length + 1 > WRAP_WIDTH) {
            out.push(`${INDENT}${line}`);
            line = word;
        } else {
            line = line.length === 0 ? word : `${line} ${word}`;
        }
    }

    if (line.length > 0) {
        out.push(`${INDENT}${line}`);
    }
    return out;
};

const wrapped = function wrapped(text: string): string[] {
    return text.split("\n").flatMap((segment) => (segment.trim().length === 0 ? [""] : wrappedSegment(segment)));
};

export const isItemId = function isItemId(text: string): boolean {
    const cut = text.indexOf(ORDINAL_SEPARATOR);
    if (cut <= 0 || cut === text.length - 1) {
        return false;
    }

    for (let i = 0; i < cut; i += 1) {
        const char = text.charAt(i);
        if (char < "A" || char > "Z") {
            return false;
        }
    }

    for (let i = cut + 1; i < text.length; i += 1) {
        const char = text.charAt(i);
        if (char < "0" || char > "9") {
            return false;
        }
    }

    return true;
};

const highestIn = function highestIn(text: string, agent: string): number {
    const prefix = `${agent}${ORDINAL_SEPARATOR}`;
    let highest = 0;
    let cursor = text.indexOf(prefix);

    while (cursor !== -1) {
        let end = cursor + prefix.length;
        while (end < text.length) {
            const char = text.charAt(end);
            if (char < "0" || char > "9") {
                break;
            }
            end += 1;
        }

        const ordinal = Number(text.slice(cursor + prefix.length, end));
        if (Number.isFinite(ordinal) && ordinal > highest) {
            highest = ordinal;
        }
        cursor = text.indexOf(prefix, end);
    }

    return highest;
};

export const nextOrdinal = function nextOrdinal(sources: readonly string[], agent: string, archive: string): number {
    let highest = 0;

    for (const source of sources) {
        for (const mark of delimitersIn(source)) {
            if (!mark.agent.startsWith(`${agent}${ORDINAL_SEPARATOR}`)) {
                continue;
            }

            const ordinal = Number(mark.agent.slice(agent.length + 1));
            if (Number.isFinite(ordinal) && ordinal > highest) {
                highest = ordinal;
            }
        }
    }

    const archived = highestIn(archive, agent);
    return (archived > highest ? archived : highest) + 1;
};

const ADDRESS_CONNECTORS: ReadonlySet<string> = new Set(["AND", "and"]);

const addressToken = function addressToken(word: string): string {
    let token = word;
    while (token.length > 0 && ADDRESS_PUNCTUATION.has(token.slice(-1))) {
        token = token.slice(0, -1);
    }
    return token;
};

const isSeatLetter = function isSeatLetter(token: string): boolean {
    return token.length === 1 && token >= "A" && token <= "Z";
};

export const addresseesOf = function addresseesOf(text: string): string[] {
    if (!text.startsWith(TO_PREFIX)) {
        return [];
    }
    const tokens = text.slice(TO_PREFIX.length).split(" ").map(addressToken);
    const end = tokens.findIndex((token) => !isSeatLetter(token) && !ADDRESS_CONNECTORS.has(token));
    return tokens.slice(0, end === -1 ? tokens.length : end).filter(isSeatLetter);
};

export const itemKindOf = function itemKindOf(source: string, key: string): string {
    const opener = `┌─── AGENT ${key} ───`;

    for (const line of source.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith(opener)) {
            continue;
        }

        const at = trimmed.indexOf(KIND_FIELD);
        if (at === -1) {
            return "";
        }

        const rest = trimmed.slice(at + KIND_FIELD.length);
        const stop = rest.indexOf(" ");
        return stop === -1 ? rest : rest.slice(0, stop);
    }

    return "";
};

export const CITES_FIELD = "cites:";

export const stampOf = function stampOf(marker: string): number {
    const at = marker.indexOf(AT_FIELD);
    if (at === -1) {
        return 0;
    }

    const rest = marker.slice(at + AT_FIELD.length);
    const stop = rest.indexOf(" ");
    const held = Number((stop === -1 ? rest : rest.slice(0, stop)).trim());

    return Number.isFinite(held) ? held : 0;
};

const REFERENCE_JOIN = "`: `";

const BACKTICK = "`";

const citedPathOf = function citedPathOf(line: string): string | null {
    const trimmed = line.trim();
    const join = trimmed.indexOf(REFERENCE_JOIN);
    if (!trimmed.startsWith(BACKTICK) || !trimmed.endsWith(BACKTICK) || join === -1) {
        return null;
    }
    const path = trimmed.slice(join + REFERENCE_JOIN.length, -1).trim();
    return path.length === 0 || path.includes(" ") || path.includes(",") ? null : path;
};

export const citedSurfaces = function citedSurfaces(text: string): string[] {
    const out: string[] = [];
    for (const line of text.split("\n")) {
        const path = citedPathOf(line);
        if (path !== null && !out.includes(path)) {
            out.push(path);
        }
    }
    return out;
};

const STAMP_MARK = "@";

const citationOf = function citationOf(entry: string): { path: string; at: number } | null {
    const mark = entry.lastIndexOf(STAMP_MARK);
    const stamp = Number(entry.slice(mark + 1));
    return mark <= 0 || !Number.isFinite(stamp) ? null : { at: stamp, path: entry.slice(0, mark) };
};

export const stampedCitations = function stampedCitations(marker: string): { path: string; at: number }[] {
    const at = marker.indexOf(CITES_FIELD);
    if (at === -1) {
        return [];
    }
    const rest = marker.slice(at + CITES_FIELD.length);
    const stop = rest.indexOf(" ");
    const held = stop === -1 ? rest : rest.slice(0, stop);
    return held.split(",").flatMap((entry) => {
        const citation = citationOf(entry);
        return citation === null ? [] : [citation];
    });
};

const stampEntry = function stampEntry(entry: { path: string; at: number }): string {
    return `${entry.path}${STAMP_MARK}${String(entry.at)}`;
};

export const citationStamp = function citationStamp(cited: readonly { path: string; at: number }[]): string {
    return cited.length === 0 ? "" : ` ${CITES_FIELD}${cited.map(stampEntry).join(",")}`;
};

export const fencedItem = function fencedItem(
    key: string,
    text: string,
    at: number,
    kind: string,
    cited: readonly { path: string; at: number }[] = [],
): string[] {
    const to = addresseesOf(text);
    const meta = `${KIND_FIELD}${kind} ${AT_FIELD}${String(at)} ${TO_FIELD}${to.length === 0 ? "*" : to.join(",")}${citationStamp(
        cited,
    )}`;

    return [`${INDENT}┌─── AGENT ${key} ─── ${meta}`, ...wrapped(text), `${INDENT}└─── END AGENT ${key}`];
};
