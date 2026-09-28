import { AT_FIELD, READ_FIELD, TO_FIELD } from "../formatters/board.formatter.ts";
import { AWAITING_MARKER, BLOCKING_SUFFIX, RECORD_ABSENT, UNREAD_MARKER } from "../constants/blocking.constants.ts";
import { alreadyMarked, itemNotFound, marked, notAddressed } from "../strings/mark.strings.ts";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { letters, rosterLine } from "./converge.runner.ts";
import {
    rosterContended,
    rosterLinesMissing,
    rosterNotVenue,
    rosterRegression,
    rosterResolved,
    rosterUnchanged,
    rosterVenueElsewhere,
} from "../strings/venue.strings.ts";
import { surfacePath, surfacePrefix } from "../../../config/surface.config.ts";
import type { RaiseOutcome } from "../types/venue.types.ts";
import { activeSeats } from "../analyzers/board.analyzer.ts";
import { itemSpans } from "../resolvers/sweep.resolver.ts";
import { resolve } from "node:path";
import { surfaceText } from "../readers/venue.reader.ts";
import { venueRefusal } from "../factories/venue.factory.ts";

interface MarkRequest {
    readonly target: string;
    readonly absolute: string;
    readonly item: string;
    readonly agent: string;
}

interface MarkOutcome {
    readonly code: number;
    readonly message: string;
}

export const markedReaders = function markedReaders(marker: string): string[] {
    const at = marker.indexOf(READ_FIELD);
    if (at === -1) {
        return [];
    }

    const rest = marker.slice(at + READ_FIELD.length);
    let value = "";
    for (const character of rest) {
        if (character === " ") {
            break;
        }
        value += character;
    }

    return value.length === 0 ? [] : value.split(",");
};

const withReader = function withReader(marker: string, agent: string): string {
    const readers = markedReaders(marker);
    if (readers.includes(agent)) {
        return marker;
    }

    const joined = [...readers, agent].join(",");
    const at = marker.indexOf(READ_FIELD);

    if (at === -1) {
        return `${marker} ${READ_FIELD}${joined}`;
    }

    const tail = marker.slice(at + READ_FIELD.length);
    let width = 0;
    while (width < tail.length && tail.charAt(width) !== " ") {
        width += 1;
    }

    return `${marker.slice(0, at)}${READ_FIELD}${joined}${tail.slice(width)}`;
};

export const runMark = function runMark(request: MarkRequest): MarkOutcome {
    const source = readFileSync(request.absolute, "utf8");
    const span = itemSpans(source).find((entry) => entry.key === request.item);

    if (span === undefined) {
        return { code: 2, message: itemNotFound(request.item, request.target) };
    }

    if (span.to.length > 0 && !span.to.includes(request.agent)) {
        return { code: 2, message: notAddressed(request.item, request.agent) };
    }

    const lines = source.split("\n");
    const marker = lines[span.from] ?? "";

    if (markedReaders(marker).includes(request.agent)) {
        return { code: 0, message: alreadyMarked(request.agent, request.item) };
    }

    lines[span.from] = withReader(marker, request.agent);
    writeFileSync(request.absolute, lines.join("\n"), "utf8");

    return { code: 0, message: marked(request.agent, request.item) };
};

export const healRequested = function healRequested(argv: readonly string[], flag: string): boolean {
    return !argv.includes(flag);
};

export const authorOf = function authorOf(item: string): string {
    const cut = item.indexOf("-");
    return cut <= 0 ? item : item.slice(0, cut);
};

export const unmarkedReaders = function unmarkedReaders(
    marker: string,
    addressed: readonly string[],
    active: readonly string[],
    author = "",
): string[] {
    const readers = markedReaders(marker);
    const named = addressed.length === 0 ? active : addressed;

    return named.filter((letter) => letter !== author && active.includes(letter) && !readers.includes(letter));
};

export const carriesLedger = function carriesLedger(marker: string): boolean {
    return marker.includes(READ_FIELD) || marker.includes(TO_FIELD) || marker.includes(AT_FIELD);
};

export const rosterFor = function rosterFor(
    repoRoot: string,
    markedLetters: readonly string[],
): { unread: string[]; read: string[] } {
    const board = surfaceText(repoRoot, surfacePath("board"));
    const index = surfaceText(repoRoot, surfacePath("agent_index"));
    const seats = activeSeats(board, index);

    const read = seats.filter((letter) => markedLetters.includes(letter));
    return { read, unread: seats.filter((letter) => !markedLetters.includes(letter)) };
};

const rosterRewrite = function rosterRewrite(
    repoRoot: string,
    name: string,
    before: string,
): RaiseOutcome | { composed: string; roster: { unread: string[]; read: string[] } } {
    const lines = before.split("\n");
    const unreadAt = lines.findIndex((line) => line.startsWith(UNREAD_MARKER));
    const readAt = lines.findIndex((line) => line.startsWith(AWAITING_MARKER));
    if (unreadAt === -1 || readAt === -1) {
        return venueRefusal(rosterLinesMissing(name));
    }

    const roster = rosterFor(repoRoot, letters(lines[readAt] ?? "", AWAITING_MARKER));
    const seated = new Set([...roster.unread, ...roster.read]);
    const standing = letters(lines[unreadAt] ?? "", UNREAD_MARKER).filter((letter) => seated.has(letter));
    const regressing = roster.unread.filter((letter) => !standing.includes(letter));
    if (standing.length > 0 && regressing.length > 0) {
        return venueRefusal(rosterRegression(name, regressing));
    }

    const written = [...lines];
    written[unreadAt] = rosterLine(UNREAD_MARKER, roster.unread);
    written[readAt] = rosterLine(AWAITING_MARKER, roster.read);
    return { composed: written.join("\n"), roster };
};

export const runRoster = function runRoster(options: {
    readonly repoRoot: string;
    readonly name: string;
}): RaiseOutcome {
    if (!options.name.endsWith(BLOCKING_SUFFIX)) {
        return venueRefusal(rosterNotVenue(options.name));
    }

    const absolute = resolve(options.repoRoot, surfacePrefix(), options.name);
    if (!existsSync(absolute)) {
        return venueRefusal(rosterVenueElsewhere(options.name));
    }

    const before = readFileSync(absolute, "utf8");
    const rewrite = rosterRewrite(options.repoRoot, options.name, before);
    if (!("composed" in rewrite)) {
        return rewrite;
    }

    const { composed, roster } = rewrite;
    if (composed === before) {
        return { code: 0, message: rosterUnchanged(options.name), raised: options.name };
    }

    const witness = readFileSync(absolute, "utf8");
    if (witness !== before) {
        return venueRefusal(rosterContended(options.name));
    }

    writeFileSync(absolute, composed, "utf8");

    const unread = roster.unread.join(", ") || RECORD_ABSENT;
    const read = roster.read.join(", ") || RECORD_ABSENT;
    return { code: 0, message: rosterResolved(options.name, unread, read), raised: options.name };
};
