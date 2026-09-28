import { BLOCKING_SUFFIX, VENUE_ARCHIVE } from "../constants/blocking.constants.ts";
import { READ_FIELD, stampOf } from "../formatters/board.formatter.ts";
import { activeSeats, boardRecords } from "../analyzers/board.analyzer.ts";
import { authorOf, unmarkedReaders } from "../runners/mark.runner.ts";
import {
    awaitingMark,
    claimEcho,
    claimFieldAbsent,
    claimNoRecord,
    closableByYou,
    dischargeEcho,
} from "../strings/board.strings.ts";
import { existsSync, readFileSync } from "node:fs";
import { itemSpans, openVenues, surfaceEntries } from "../resolvers/sweep.resolver.ts";
import type { ItemSpan } from "../types/sweep.types.ts";
import { clipped } from "../formatters/text.formatter.ts";
import { readFieldMark } from "../registries/snapshot.registry.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";

const ECHOED_FIELDS = ["Status", "Flags"];

const textIfPresent = function textIfPresent(absolute: string): string {
    return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
};

const workMovedPast = function workMovedPast(repoRoot: string, caller: string): boolean {
    const since = readFieldMark(repoRoot, caller);
    const surfaces = [surfacePath("board"), ...openVenues(surfaceEntries(repoRoot), VENUE_ARCHIVE, BLOCKING_SUFFIX)];

    return surfaces.some((surface) => {
        const source = textIfPresent(resolve(repoRoot, surface));
        const lines = source.split("\n");
        return itemSpans(source).some(
            (span) => authorOf(span.key) === caller && stampOf(lines[span.from] ?? "") > since,
        );
    });
};

export const ownClaimEcho = function ownClaimEcho(repoRoot: string, caller: string): string {
    const boardPath = surfacePath("board");
    const board = resolve(repoRoot, boardPath);
    if (!workMovedPast(repoRoot, caller) || !existsSync(board)) {
        return "";
    }

    const record = boardRecords(readFileSync(board, "utf8")).find(
        (held) => held.kind === "agent" && held.label.endsWith(` ${caller}`),
    );
    if (record === undefined) {
        return claimNoRecord(boardPath, caller);
    }

    const lines = ECHOED_FIELDS.map((field) => {
        const value = record.fields.get(field);
        return value === undefined ? claimFieldAbsent(field) : `  ${field}: ${clipped(value, 200)}`;
    });

    return claimEcho(boardPath, lines);
};

const heldOn = function heldOn(source: string, active: readonly string[], span: ItemSpan): string[] {
    const marker = source.split("\n")[span.from] ?? "";
    if (!marker.includes(READ_FIELD)) {
        return [];
    }

    return unmarkedReaders(marker, span.to, active, authorOf(span.key));
};

export const ownDischargeEcho = function ownDischargeEcho(repoRoot: string, caller: string): string {
    const board = resolve(repoRoot, surfacePath("board"));
    if (!existsSync(board)) {
        return "";
    }

    const source = readFileSync(board, "utf8");
    const index = textIfPresent(resolve(repoRoot, surfacePath("agent_index")));
    const active = activeSeats(source, index);
    const addressed = itemSpans(source)
        .filter((span) => authorOf(span.key) !== caller)
        .filter((span) => (span.to.length === 0 ? active : span.to).includes(caller))
        .map((span) => ({ held: heldOn(source, active, span), key: span.key }));

    const owed = addressed.filter((entry) => entry.held.includes(caller)).map((entry) => entry.key);
    const closable = addressed.filter((entry) => entry.held.length === 0).map((entry) => entry.key);
    if (owed.length === 0 && closable.length === 0) {
        return "";
    }

    const lines = [
        owed.length === 0 ? "" : awaitingMark(owed),
        closable.length === 0 ? "" : closableByYou(closable),
    ].filter((line) => line.length > 0);

    return dischargeEcho(lines);
};
