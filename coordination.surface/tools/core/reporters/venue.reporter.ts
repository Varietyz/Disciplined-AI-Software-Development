import { BLOCKING_SUFFIX, UNREAD_MARKER, VENUE_ARCHIVE, VENUE_TEMPLATE } from "../constants/blocking.constants.ts";
import { existsSync, readFileSync } from "node:fs";
import { openVenues, surfaceEntries } from "../resolvers/sweep.resolver.ts";
import {
    openVenuesEcho,
    venueFieldAbsent,
    venueFieldEmpty,
    venueFieldList,
    venueNoRecord,
    venueRecordEcho,
    venueRosterRow,
    venueTemplateFieldless,
    venueTemplateUnreadable,
    venueWritingTo,
} from "../strings/board.strings.ts";
import { boardRecords } from "../analyzers/board.analyzer.ts";
import { clipped } from "../formatters/text.formatter.ts";
import { letters } from "../runners/converge.runner.ts";
import { resolve } from "node:path";
import { venueFieldsFrom } from "../validators/venue.validator.ts";

const GATING_FIELDS = ["Needs", "Durable"];

export const openVenueEcho = function openVenueEcho(repoRoot: string, caller: string, target: string): string {
    const open = openVenues(surfaceEntries(repoRoot), VENUE_ARCHIVE, BLOCKING_SUFFIX);
    if (open.length === 0) {
        return "";
    }

    const lines = open.map((venue) => {
        if (venue === target) {
            return venueWritingTo(venue);
        }

        const source = readFileSync(resolve(repoRoot, venue), "utf8");
        const unread = source.split("\n").find((line) => line.trim().startsWith(UNREAD_MARKER));
        const held = unread === undefined ? [] : letters(unread, UNREAD_MARKER);

        return venueRosterRow(venue, held.includes(caller));
    });

    return openVenuesEcho(lines);
};

const gatingLine = function gatingLine(field: string, value: string | undefined): string {
    if (value === undefined) {
        return venueFieldAbsent(field);
    }
    return value.trim().length === 0 ? venueFieldEmpty(field) : `  ${field}: ${clipped(value, 160)}`;
};

export const ownVenueEcho = function ownVenueEcho(caller: string, absolute: string, target: string): string {
    if (!existsSync(absolute)) {
        return "";
    }

    const record = boardRecords(readFileSync(absolute, "utf8")).find(
        (held) => held.kind === "agent" && held.label.endsWith(` ${caller}`),
    );
    if (record === undefined) {
        return venueNoRecord(target, caller);
    }

    return venueRecordEcho(
        target,
        GATING_FIELDS.map((field) => gatingLine(field, record.fields.get(field))),
    );
};

export const venueFieldLine = function venueFieldLine(repoRoot: string): string {
    const template = resolve(repoRoot, VENUE_TEMPLATE);
    if (!existsSync(template)) {
        return venueTemplateUnreadable(VENUE_TEMPLATE);
    }

    const fields = venueFieldsFrom(readFileSync(template, "utf8"));
    if (fields.length === 0) {
        return venueTemplateFieldless(VENUE_TEMPLATE);
    }

    return venueFieldList(VENUE_TEMPLATE, fields);
};
