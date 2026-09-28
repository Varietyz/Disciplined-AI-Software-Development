import { POSITION_MARKER, UNREAD_MARKER } from "../constants/blocking.constants.ts";
import { itemSpans } from "../resolvers/sweep.resolver.ts";

const MENTION_STATE = new Map([
    ["<", true],
    [">", false],
]);

const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const isAddress = function isAddress(char: string): boolean {
    return (char >= "A" && char <= "Z") || isDigit(char);
};

const byAddress = function byAddress(left: string, right: string): number {
    return left.localeCompare(right, "en");
};

const addressAt = function addressAt(line: string, from: number): string {
    let cursor = from;
    while (cursor < line.length && isAddress(line.charAt(cursor))) {
        cursor += 1;
    }
    return line.slice(from, cursor);
};

const headOf = function headOf(address: string): string {
    let end = 0;
    while (end < address.length && !isDigit(address.charAt(end))) {
        end += 1;
    }
    return address.slice(0, end);
};

const positionAuthors = function positionAuthors(lines: readonly string[]): Set<string> {
    return new Set(
        lines
            .filter((line) => line.startsWith(POSITION_MARKER))
            .map((line) => headOf(addressAt(line, POSITION_MARKER.length)))
            .filter((head) => head.length > 0),
    );
};

const startsAddress = function startsAddress(tail: string, index: number, mentioned: boolean): boolean {
    return !mentioned && isAddress(tail.charAt(index)) && (index === 0 || !isAddress(tail.charAt(index - 1)));
};

const addressesIn = function addressesIn(tail: string): string[] {
    const out: string[] = [];
    let mentioned = false;

    for (let index = 0; index < tail.length; index += 1) {
        mentioned = MENTION_STATE.get(tail.charAt(index)) ?? mentioned;
        if (startsAddress(tail, index, mentioned)) {
            out.push(addressAt(tail, index));
        }
    }

    return out;
};

const unreadRoster = function unreadRoster(lines: readonly string[]): Set<string> {
    return new Set(
        lines
            .filter((line) => line.startsWith(UNREAD_MARKER))
            .flatMap((line) => addressesIn(line.slice(UNREAD_MARKER.length))),
    );
};

export const unreadWhilePositionsStand = function unreadWhilePositionsStand(source: string): string[] {
    const lines = source.split("\n");
    if (positionAuthors(lines).size === 0 && itemSpans(source).length === 0) {
        return [];
    }
    return [...unreadRoster(lines)].toSorted(byAddress);
};

export const unreadAuthors = function unreadAuthors(source: string): string[] {
    const lines = source.split("\n");
    const unread = unreadRoster(lines);
    return [...positionAuthors(lines)].filter((author) => unread.has(author)).toSorted(byAddress);
};
