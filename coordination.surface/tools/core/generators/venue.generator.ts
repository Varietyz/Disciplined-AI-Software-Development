import { BLOCKING_SUFFIX, INHERITED_BANNER, RECORD_ABSENT, VENUE_ARCHIVE } from "../constants/blocking.constants.ts";
import { NO_VENUE_DEFERRING, inheritedSection, unclaimedSection } from "../strings/venue.strings.ts";
import { basename, resolve } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import type { Deferring } from "../types/venue.types.ts";
import { clauseLines } from "../analyzers/converge.analyzer.ts";

const DEFERRED_HEADING = "## DEFERRED";

const DIGITS = new Set("0123456789");

const RECORD_OPEN = "┌─── AGENT ";

const RECORD_CLOSE_MARKER = "└─── END AGENT ";

const LETTER_SLOT = "<letter>";

const STATE_SLOT = "<ACTIVE | INACTIVE>";

const PLACEHOLDER_OPEN = "<";

export const ordinalOf = function ordinalOf(name: string): string {
    return (
        basename(name)
            .split(".")
            .find((part) => part.length > 0 && DIGITS.has(part.charAt(0))) ?? ""
    );
};

const inheritedBlock = function inheritedBlock(predecessorName: string, clauses: readonly string[]): string {
    const ordinal = ordinalOf(predecessorName);
    const carried = clauses.map((clause) => `- ${clause}`).join("\n");
    return inheritedSection(INHERITED_BANNER, ordinal.length === 0 ? predecessorName : ordinal, carried);
};

const unclaimedBlock = function unclaimedBlock(invariant: string): string {
    return unclaimedSection(INHERITED_BANNER, invariant, RECORD_ABSENT);
};

export const blockFor = function blockFor(invariant: string, deferring: Deferring): string {
    return deferring.clauses.length === 0
        ? unclaimedBlock(invariant)
        : inheritedBlock(deferring.names.join(", "), deferring.clauses);
};

export const deferringLabel = function deferringLabel(deferring: Deferring): string {
    return deferring.names.length === 0 ? NO_VENUE_DEFERRING : deferring.names.join(", ");
};

const venueEntries = function venueEntries(roots: readonly string[]): { root: string; entry: string }[] {
    return roots
        .filter((root) => existsSync(root))
        .flatMap((root) =>
            readdirSync(root)
                .toSorted((left, right) => left.localeCompare(right))
                .filter((entry) => entry.endsWith(BLOCKING_SUFFIX))
                .map((entry) => ({ entry, root })),
        );
};

export const deferringVenues = function deferringVenues(
    directory: string,
    repoRoot: string,
    invariant: string,
): Deferring {
    const found = venueEntries([directory, resolve(repoRoot, VENUE_ARCHIVE)])
        .map(({ entry, root }) => ({
            carried: clauseLines(readFileSync(resolve(root, entry), "utf8"), DEFERRED_HEADING)
                .filter((line) => line.receiver === invariant)
                .map((line) => line.clause),
            entry,
        }))
        .filter((venue) => venue.carried.length > 0);

    return { clauses: found.flatMap((venue) => venue.carried), names: found.map((venue) => venue.entry) };
};

export const siblingVenues = function siblingVenues(directory: string, repoRoot: string): string[] {
    return venueEntries([directory, resolve(repoRoot, VENUE_ARCHIVE)]).map(({ entry }) => entry);
};

export const recordSpecimen = function recordSpecimen(template: string): string[] {
    const lines = template.split("\n");
    const opens = lines.findIndex((line) => line.trimStart().startsWith(RECORD_OPEN) && line.includes(LETTER_SLOT));
    if (opens === -1) {
        return [];
    }

    const open = lines[opens] ?? "";
    const indent = open.slice(0, open.length - open.trimStart().length);

    const closes = lines.findIndex((line, index) => index >= opens && line.trimStart().startsWith(RECORD_CLOSE_MARKER));
    if (closes === -1) {
        return [];
    }

    return lines.slice(opens, closes + 1).map((line) => (line.startsWith(indent) ? line.slice(indent.length) : line));
};

export const seatRecord = function seatRecord(specimen: readonly string[], letter: string): string[] {
    return specimen.map((line) => {
        const named = line.split(LETTER_SLOT).join(letter).split(STATE_SLOT).join("ACTIVE");
        const cut = named.indexOf(PLACEHOLDER_OPEN);
        return cut === -1 ? named : named.slice(0, cut).trimEnd();
    });
};
