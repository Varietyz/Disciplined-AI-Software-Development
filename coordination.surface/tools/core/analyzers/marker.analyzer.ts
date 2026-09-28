import { isWordCharacter } from "../predicates/token.predicate.ts";

const QUOTES = ["`", '"'];

const normalizedWords = function normalizedWords(text: string): string[] {
    const out: string[] = [];
    let word = "";

    for (let index = 0; index < text.length; index += 1) {
        const character = text.charAt(index).toLowerCase();
        const isLetter = character >= "a" && character <= "z";
        const isDigit = character >= "0" && character <= "9";

        if (isLetter || isDigit) {
            word += character;
            continue;
        }
        if (word.length > 0) {
            out.push(word);
        }
        word = "";
    }

    if (word.length > 0) {
        out.push(word);
    }
    return out;
};

export const repeatedSpan = function repeatedSpan(text: string, span: number): string | null {
    const words = normalizedWords(text);
    if (words.length < span * 2) {
        return null;
    }

    const seen = new Set<string>();

    for (let start = 0; start + span <= words.length; start += 1) {
        const run = words.slice(start, start + span).join(" ");
        if (seen.has(run)) {
            return run;
        }
        seen.add(run);
    }

    return null;
};

const balanced = function balanced(line: string, delimiter: string): boolean {
    let count = 0;
    for (let index = 0; index < line.length; index += 1) {
        if (line.charAt(index) === delimiter) {
            count += 1;
        }
    }

    return count > 0 && count % 2 === 0;
};

const spansFor = function spansFor(line: string, delimiter: string, quoted: boolean[]): void {
    let inside = false;

    for (let index = 0; index < line.length; index += 1) {
        if (line.charAt(index) === delimiter) {
            inside = !inside;
            quoted[index] = true;
            continue;
        }
        if (inside) {
            quoted[index] = true;
        }
    }
};

const quotedSpans = function quotedSpans(line: string): boolean[] {
    const quoted = Array.from({ length: line.length }, () => false);

    for (const delimiter of QUOTES) {
        if (!balanced(line, delimiter)) {
            continue;
        }
        spansFor(line, delimiter, quoted);
    }

    return quoted;
};

const joinedToWord = function joinedToWord(line: string, at: number): boolean {
    if (at === 0) {
        return false;
    }
    if (line.charAt(at - 1) !== "-") {
        return false;
    }

    return isWordCharacter(at < 2 ? "" : line.charAt(at - 2));
};

const terminatesClause = function terminatesClause(line: string, after: number): boolean {
    let cursor = after;
    while (cursor < line.length && line.charAt(cursor) === " ") {
        cursor += 1;
    }
    if (cursor >= line.length) {
        return true;
    }

    return !isWordCharacter(line.charAt(cursor));
};

const standsAlone = function standsAlone(line: string, at: number, marker: string): boolean {
    const before = at === 0 ? "" : line.charAt(at - 1);
    const after = line.charAt(at + marker.length);
    return !isWordCharacter(before) && !isWordCharacter(after) && !joinedToWord(line, at);
};

export const carriesMarker = function carriesMarker(line: string, marker: string): boolean {
    const quoted = quotedSpans(line);
    let from = 0;

    while (from <= line.length - marker.length) {
        const at = line.indexOf(marker, from);
        if (at === -1) {
            return false;
        }

        if (standsAlone(line, at, marker) && quoted[at] !== true && terminatesClause(line, at + marker.length)) {
            return true;
        }

        from = at + 1;
    }

    return false;
};
