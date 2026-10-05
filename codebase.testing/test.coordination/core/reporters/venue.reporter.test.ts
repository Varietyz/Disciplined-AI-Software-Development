import { UNREAD_MARKER, VENUE_TEMPLATE } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import {
    openVenueEcho,
    ownVenueEcho,
    venueFieldLine,
} from "coordination-surface/tools/core/reporters/venue.reporter.ts";
import {
    openVenuesEcho,
    venueFieldEmpty,
    venueFieldList,
    venueNoRecord,
    venueRecordEcho,
    venueRosterRow,
    venueTemplateFieldless,
    venueTemplateUnreadable,
    venueWritingTo,
} from "coordination-surface/tools/core/strings/board.strings.ts";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TARGET = "probe.blocking.md";

const within = function within(name: string): string {
    return surfacePrefix().length === 0 ? name : `${surfacePrefix()}/${name}`;
};

describe("ownVenueEcho", () => {
    it("echoes the caller's gating fields, marks an empty one, and names a missing record", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-own-venue-"));
        try {
            const absolute = join(root, TARGET);
            assert.equal(ownVenueEcho("A", absolute, TARGET), "");
            writeVerbatim(absolute, ["Agent A — ACTIVE", "  Needs: the index", "  Durable: "].join("\n"));
            assert.equal(
                ownVenueEcho("A", absolute, TARGET),
                venueRecordEcho(TARGET, ["  Needs: the index", venueFieldEmpty("Durable")]),
            );
            assert.equal(ownVenueEcho("B", absolute, TARGET), venueNoRecord(TARGET, "B"));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("venueFieldLine", () => {
    it("lists the fields the venue template declares, or says the template is missing or declares none", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-venue-fields-"));
        try {
            assert.equal(venueFieldLine(root), venueTemplateUnreadable(VENUE_TEMPLATE));
            const template = resolve(root, VENUE_TEMPLATE);
            mkdirSync(dirname(template), { recursive: true });
            writeVerbatim(template, "no records");
            assert.equal(venueFieldLine(root), venueTemplateFieldless(VENUE_TEMPLATE));
            writeVerbatim(template, ["```text", "Agent A — role", "  Needs: what", "└───", "```"].join("\n"));
            assert.equal(venueFieldLine(root), venueFieldList(VENUE_TEMPLATE, ["Needs"]));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("openVenueEcho", () => {
    it("lists every open venue with the caller's read state, marking the one being written", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-open-venues-"));
        try {
            assert.equal(openVenueEcho(root, "A", within(TARGET)), "");
            mkdirSync(resolve(root, surfacePrefix()), { recursive: true });
            writeVerbatim(resolve(root, within("other.blocking.md")), `${UNREAD_MARKER} A, B\n`);
            writeVerbatim(resolve(root, within(TARGET)), "");
            const target = within(TARGET);
            const rows = [venueRosterRow(within("other.blocking.md"), true), venueWritingTo(target)];
            assert.equal(openVenueEcho(root, "A", target), openVenuesEcho(rows));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
