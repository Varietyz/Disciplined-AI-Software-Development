import "@banes-lab/web/presentation/records/records.barrel.ts";
import type {
    CardSpec,
    ColumnBox,
    ColumnEntry,
    ColumnRow,
    FrameContext,
    Layer,
    PageCardOptions,
    Placement,
} from "#types/card.types";
import { MISSING_COLUMN_ROW, SUBJECT_SEPARATOR, UNKNOWN_PAGE_ENTRY } from "#configuration/strings/card.strings";
import {
    PAGE_COLUMN,
    PAGE_GLOW_BASE,
    PAGE_GLOW_OPACITY,
    PAGE_GLOW_SWING,
    PAGE_LAYOUT,
    PAGE_SHIMMER_SPAN,
    PAGE_TIMELINE,
} from "#configuration/data/page.data";
import { SITE_NAME, TITLE_SEPARATOR } from "@banes-lab/web/configuration/strings/page.strings.ts";
import {
    alignAt,
    fontAt,
    orientationOf,
    percent,
    pixels,
    placeAt,
    wave,
} from "#core/evaluators/card.fragment.evaluator";
import { columnOf, pageAddress } from "#core/evaluators/page.evaluator";
import type { PageEntry } from "@banes-lab/web/types/page.types.ts";
import { SITE_BYLINE } from "#configuration/data/site.data";
import { createCard } from "#core/factories/card.factory";
import { fieldLayers } from "#core/factories/field.factory";
import { getPage } from "@banes-lab/web/domain/registries/page.registry.ts";
import stylesheet from "../styles/page.style.css?raw";

const QUARTER_TURN = -0.25;
const SHEET_SEPARATOR = "\n";

const breath = function breath(progress: number): number {
    return wave(progress, 1, QUARTER_TURN);
};

const entryOf = function entryOf(page: string): PageEntry {
    const entry = getPage(page);
    if (entry === undefined) {
        throw new Error(UNKNOWN_PAGE_ENTRY + SUBJECT_SEPARATOR + page);
    }
    return entry;
};

const entriesOf = function entriesOf(entry: PageEntry): readonly ColumnEntry[] {
    const { headline, tagline } = entry.share;
    return [
        ...(headline === SITE_NAME ? [] : [{ row: "kicker" as const, text: SITE_NAME }]),
        { row: "title", text: headline },
        { row: "subtitle", text: tagline },
        { row: "rule", text: "" },
    ];
};

const footerText = function footerText(slot: "byline" | "domain", text: string): Layer {
    return {
        className: `share-${slot}`,
        id: slot,
        kind: "text",
        placement: placeAt(PAGE_LAYOUT, slot),
        style: { fontSize: fontAt(PAGE_LAYOUT, slot), textAlign: alignAt(PAGE_LAYOUT, slot) },
        text,
    };
};

const columnPlacement = function columnPlacement(entries: readonly ColumnEntry[], row: ColumnRow): Placement {
    const box = (frame: FrameContext): ColumnBox => {
        const found = columnOf(PAGE_COLUMN[orientationOf(frame)], entries, frame).get(row);
        if (found === undefined) {
            throw new Error(MISSING_COLUMN_ROW + SUBJECT_SEPARATOR + row);
        }
        return found;
    };
    return {
        anchor: "start",
        height: (frame) => (row === "rule" ? box(frame).height : 0),
        width: (frame) => box(frame).width,
        x: (frame) => box(frame).x,
        y: (frame) => box(frame).y,
    };
};

const columnText = function columnText(entries: readonly ColumnEntry[], row: ColumnRow, text: string): Layer {
    return {
        className: `share-${row}`,
        id: row,
        kind: "text",
        placement: columnPlacement(entries, row),
        style: {
            fontSize: (frame) => pixels(frame.profile.width * PAGE_COLUMN[orientationOf(frame)].rows[row].size),
            lineHeight: (frame) => String(PAGE_COLUMN[orientationOf(frame)].rows[row].leading),
            textAlign: (frame) => PAGE_COLUMN[orientationOf(frame)].align,
        },
        text,
    };
};

const markLayer = function markLayer(entry: PageEntry): Layer {
    return {
        alt: SITE_NAME,
        className: "share-mark",
        id: "mark",
        kind: "animation",
        placement: placeAt(PAGE_LAYOUT, "mark", { square: true }),
        source: entry.mark,
    };
};

const identityLayers = function identityLayers(entry: PageEntry, mark: Layer): readonly Layer[] {
    const entries = entriesOf(entry);
    const { headline, tagline } = entry.share;
    return [
        mark,
        ...entries.filter((item) => item.row === "kicker").map((item) => columnText(entries, "kicker", item.text)),
        {
            ...columnText(entries, "title", headline),
            className: "share-title share-glow",
            effects: [{ amount: (frame) => PAGE_GLOW_BASE + PAGE_GLOW_SWING * breath(frame.progress), kind: "blur" }],
            id: "glow",
            opacity: (frame) => PAGE_GLOW_OPACITY * breath(frame.progress),
        },
        columnText(entries, "title", headline),
        columnText(entries, "subtitle", tagline),
        {
            className: "share-rule",
            id: "rule",
            kind: "box",
            placement: columnPlacement(entries, "rule"),
            style: { backgroundPositionX: (frame) => percent(PAGE_SHIMMER_SPAN * breath(frame.progress)) },
        },
        footerText("byline", SITE_BYLINE),
        footerText("domain", pageAddress(entry.id)),
    ];
};

export const createPageCard = function createPageCard(options: PageCardOptions): CardSpec {
    const entry = entryOf(options.page);
    return createCard({
        alt: entry.share.headline + TITLE_SEPARATOR + entry.share.tagline,
        id: options.id,
        layers: [...fieldLayers(options.field), ...identityLayers(entry, options.mark ?? markLayer(entry))],
        page: entry.id,
        stylesheet: [stylesheet, options.stylesheet ?? ""].join(SHEET_SEPARATOR),
        timeline: { ...PAGE_TIMELINE, ...options.timeline },
        tone: entry.accent,
    });
};
