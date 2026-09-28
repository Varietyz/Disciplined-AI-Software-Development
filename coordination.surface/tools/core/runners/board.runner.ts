import { SIGNED_LEAD, positionFieldLabels } from "../validators/venue.validator.ts";
import {
    barrierHeld,
    barrierOpen,
    fieldRewritten,
    fieldUnchanged,
    fieldUndeclared,
    itemAdded,
    itemFieldMissing,
    kindEcho,
    noOwnRecord,
    positionOnBoard,
    positionUnsigned,
    surfaceAbsent,
} from "../strings/board.strings.ts";
import { citedSurfaces, fencedItem, nextOrdinal } from "../formatters/board.formatter.ts";
import { existsSync, readFileSync, statSync } from "node:fs";
import { landWitnessed, refuse } from "../writers/board.writer.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import type { CompressOutcome } from "../types/board.types.ts";
import { JUDGEMENT_KIND } from "../constants/board.constants.ts";
import { blockOf } from "../transformers/board.transformer.ts";
import { citedAbsolute } from "../validators/claim.validator.ts";
import { fieldKeyAt } from "../analyzers/board.analyzer.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";

interface ItemRequest {
    readonly target: string;
    readonly absolute: string;
    readonly agent: string;
    readonly text: string;
    readonly at: number;
    readonly kind: string;
    readonly archive: string;
    readonly siblings: readonly string[];
    readonly repoRoot: string;
}

interface FieldRequest {
    readonly target: string;
    readonly absolute: string;
    readonly agent: string;
    readonly field: string;
    readonly text: string;
}

const BOARD_ITEM_FIELD = "  Flags:";

const VENUE_ITEM_FIELD = "  Positions:";

const FIELD_COLUMN = 9;

const itemFieldFor = function itemFieldFor(target: string): string {
    return target.endsWith(BLOCKING_SUFFIX) ? VENUE_ITEM_FIELD : BOARD_ITEM_FIELD;
};

export const barrierState = function barrierState(agents: number, parked: number): { message: string; code: number } {
    if (agents > 0 && parked >= agents - 1) {
        return { code: 0, message: barrierHeld(parked, agents - 1) };
    }

    return { code: 1, message: barrierOpen(parked, agents - 1) };
};

export const positionStructure = function positionStructure(repoRoot: string, text: string): string[] {
    const template = resolve(repoRoot, surfacePath("venue_template"));
    if (!existsSync(template)) {
        return [];
    }

    const labels = positionFieldLabels(readFileSync(template, "utf8"));
    const out: string[] = [];

    for (const line of text.split("\n")) {
        const trimmed = line.trim();
        for (const label of labels) {
            if (out.includes(label)) {
                continue;
            }
            if (trimmed.startsWith(`${label}:`)) {
                out.push(label);
            }
        }
    }

    return out;
};

const itemFieldLine = function itemFieldLine(
    request: ItemRequest,
    before: string,
): { at: number; refused: CompressOutcome | null } {
    const span = blockOf(before, request.agent);
    if (span === null) {
        return { at: -1, refused: refuse(noOwnRecord(request.agent), 2) };
    }

    const field = itemFieldFor(request.target);
    const at = before.split("\n").findIndex((line, index) => index >= span.from && line.startsWith(field));
    const missing = at === -1 || at >= span.to;
    return { at, refused: missing ? refuse(itemFieldMissing(request.agent, field.trim(), request.target), 2) : null };
};

const positionRefusal = function positionRefusal(request: ItemRequest): CompressOutcome | null {
    if (request.target.endsWith(BLOCKING_SUFFIX)) {
        return request.text.includes(SIGNED_LEAD) ? null : refuse(positionUnsigned(SIGNED_LEAD), 2);
    }

    const carried = positionStructure(request.repoRoot, request.text);
    return carried.length > 1 ? refuse(positionOnBoard(carried), 2) : null;
};

const citedStamps = function citedStamps(request: ItemRequest): { at: number; path: string }[] {
    return citedSurfaces(request.text).flatMap((path) => {
        const absolute = citedAbsolute(request.repoRoot, path);
        return absolute === null ? [] : [{ at: statSync(absolute).mtimeMs, path }];
    });
};

export const runItem = function runItem(request: ItemRequest): CompressOutcome {
    if (!existsSync(request.absolute)) {
        return refuse(surfaceAbsent(request.target), 2);
    }

    const before = readFileSync(request.absolute, "utf8");
    const { at, refused: unplaced } = itemFieldLine(request, before);
    if (unplaced !== null) {
        return unplaced;
    }

    const refused = positionRefusal(request);
    if (refused !== null) {
        return refused;
    }

    const lines = before.split("\n");
    const archive = existsSync(request.archive) ? readFileSync(request.archive, "utf8") : "";
    const key = `${request.agent}-${String(nextOrdinal([before, ...request.siblings], request.agent, archive))}`;
    const fenced = fencedItem(key, request.text, request.at, request.kind, citedStamps(request));
    const written = [...lines.slice(0, at + 1), ...fenced, ...lines.slice(at + 1)].join("\n");
    const landed = {
        code: 0,
        excised: [],
        message: `${itemAdded(key, request.target)}${kindEcho(request.kind, request.kind === JUDGEMENT_KIND)}`,
        write: written,
    };

    return landWitnessed({ ...request, before, written }, landed, () => runItem({ ...request }));
};

export const runField = function runField(request: FieldRequest): CompressOutcome {
    if (!existsSync(request.absolute)) {
        return refuse(surfaceAbsent(request.target), 2);
    }

    const before = readFileSync(request.absolute, "utf8");
    const span = blockOf(before, request.agent);

    if (span === null) {
        return refuse(noOwnRecord(request.agent), 2);
    }

    const lines = before.split("\n");
    const keyed = lines
        .slice(span.from, Math.min(span.to, lines.length))
        .map((line, offset) => ({ at: span.from + offset, key: fieldKeyAt(line) }))
        .filter((entry) => entry.key.length > 0);
    const at = keyed.findLast((entry) => entry.key === request.field)?.at;

    if (at === undefined) {
        const declared = keyed.map((entry) => entry.key);
        return refuse(fieldUndeclared(request.agent, request.field, request.target, declared), 2);
    }

    const line = lines[at] ?? "";
    const label = `${line.slice(0, line.indexOf(request.field))}${request.field}:`;
    const padding = " ".repeat(Math.max(1, FIELD_COLUMN - request.field.length - 1));
    const written = [...lines.slice(0, at), `${label}${padding}${request.text}`, ...lines.slice(at + 1)].join("\n");

    if (written === before) {
        return { code: 0, excised: [], message: fieldUnchanged(request.field, request.target), write: before };
    }

    const landed = {
        code: 0,
        excised: [],
        message: fieldRewritten(request.field, request.agent, request.target),
        write: written,
    };
    return landWitnessed({ ...request, before, written }, landed, () => runField({ ...request }));
};
