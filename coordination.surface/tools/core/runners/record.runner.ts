import { BLOCKING_SUFFIX, RECORD_ABSENT } from "../constants/blocking.constants.ts";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
    recordAdded,
    recordAnchorMissing,
    recordContended,
    recordExists,
    recordSurfaceMissing,
    recordTemplateEmpty,
    recordTemplateMissing,
} from "../strings/venue.strings.ts";
import type { RaiseOutcome } from "../types/venue.types.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";
import { readBoardContract } from "../readers/board.reader.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";
import { venueFieldsFrom } from "../validators/venue.validator.ts";
import { venueRefusal } from "../factories/venue.factory.ts";

const GATE_HEADING = "## Gate";

const RECORD_CLOSE = "└─── END AGENT ";

interface RecordRequest {
    readonly repoRoot: string;
    readonly target: string;
    readonly absolute: string;
    readonly agent: string;
}

const afterSpecimen = function afterSpecimen(fenced: readonly boolean[], close: number): number {
    const outside = fenced.findIndex((flag, index) => index > close && !flag);
    return outside === -1 ? fenced.length : outside;
};

const afterLastRecord = function afterLastRecord(source: string): number {
    const fenced = fencedFlags(source);
    const closes = source
        .split("\n")
        .map((line, index) => ({ index, trimmed: line.trim() }))
        .filter(({ trimmed }) => trimmed.startsWith(RECORD_CLOSE));
    const unfenced = closes.filter(({ index }) => fenced[index] !== true);
    const anchor = unfenced.findLast(({ trimmed }) => !trimmed.includes("<")) ?? unfenced.at(-1);
    if (anchor !== undefined) {
        return anchor.index + 1;
    }
    const specimen = closes.at(-1);
    return specimen === undefined ? -1 : afterSpecimen(fenced, specimen.index);
};

const recordFields = function recordFields(
    options: RecordRequest,
    onVenue: boolean,
): { fields: string[]; refused: RaiseOutcome | null } {
    const kind = onVenue ? "venue" : "board";
    const templatePath = resolve(options.repoRoot, surfacePath(onVenue ? "venue_template" : "board_template"));
    if (!existsSync(templatePath)) {
        return { fields: [], refused: venueRefusal(recordTemplateMissing(kind)) };
    }

    const template = readFileSync(templatePath, "utf8");
    const fields = onVenue ? venueFieldsFrom(template) : [...readBoardContract(template).agentFields];
    return { fields, refused: fields.length === 0 ? venueRefusal(recordTemplateEmpty(kind)) : null };
};

const recordLines = function recordLines(agent: string, fields: readonly string[], onVenue: boolean): string[] {
    return [
        ...(onVenue ? [] : [""]),
        `┌─── AGENT ${agent} ─── one writer: ${agent} · others cite, never edit · anchored EDIT only, never a whole-file WRITE`,
        `Agent ${agent} — ACTIVE`,
        ...fields.map((field) => `  ${field}:${" ".repeat(Math.max(1, 8 - field.length))}${RECORD_ABSENT}`),
        `└─── END AGENT ${agent}`,
        ...(onVenue ? [""] : []),
    ];
};

export const runRecord = function runRecord(options: RecordRequest): RaiseOutcome {
    const onVenue = options.target.endsWith(BLOCKING_SUFFIX);
    if (!existsSync(options.absolute)) {
        return venueRefusal(recordSurfaceMissing(options.target));
    }

    const source = readFileSync(options.absolute, "utf8");
    if (source.includes(`AGENT ${options.agent} `)) {
        return { code: 0, message: recordExists(options.agent, options.target), raised: options.target };
    }

    const { fields, refused } = recordFields(options, onVenue);
    if (refused !== null) {
        return refused;
    }

    const lines = source.split("\n");
    const at = onVenue ? lines.findIndex((line) => line.trim().startsWith(GATE_HEADING)) : afterLastRecord(source);
    if (at === -1) {
        return venueRefusal(recordAnchorMissing(options.target));
    }

    const written = [...lines.slice(0, at), ...recordLines(options.agent, fields, onVenue), ...lines.slice(at)].join(
        "\n",
    );

    const witness = readFileSync(options.absolute, "utf8");
    if (witness !== source) {
        return { code: 2, message: recordContended(options.target), raised: null };
    }

    writeFileSync(options.absolute, written, "utf8");

    return { code: 0, message: recordAdded(options.agent, options.target, fields), raised: options.target };
};
