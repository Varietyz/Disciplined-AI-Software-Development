import { AGENDA, BLOCKING_SUFFIX, LIST_MARKER, RECORD_ABSENT } from "../constants/blocking.constants.ts";
import {
    CLAUSE_IS_RECEIVER,
    DEFER_NOT_VENUE,
    RETRACT_NOT_VENUE,
    clauseDeferred,
    clauseRetracted,
    clauseTaken,
    deferVenueMissing,
    deferredSectionMissing,
    defersAlready,
    defersNothing,
    markerContended,
    receiverUnknown,
    retractClauseMissing,
    retractSectionMissing,
    retractVenueMissing,
} from "../strings/venue.strings.ts";
import { DEFERRAL_ARROW, DEFERRED_SECTION, clauseLines, sectionBound } from "../analyzers/converge.analyzer.ts";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import type { RaiseOutcome } from "../types/venue.types.ts";
import { dirname } from "node:path";
import { plannedInvariants } from "../readers/agenda.reader.ts";
import { receiverResolves } from "../resolvers/venue.resolver.ts";
import { surfacePath } from "../../../config/surface.config.ts";
import { surfaceText } from "../readers/venue.reader.ts";
import { venueRefusal } from "../factories/venue.factory.ts";

interface DeferRequest {
    readonly repoRoot: string;
    readonly target: string;
    readonly absolute: string;
    readonly clause: string;
    readonly receiver: string;
}

const deferNothing = function deferNothing(options: DeferRequest): RaiseOutcome {
    const held = readFileSync(options.absolute, "utf8");
    const section = sectionBound(held, DEFERRED_SECTION);
    if (section === null) {
        return venueRefusal(deferredSectionMissing(options.target, DEFERRED_SECTION));
    }

    const standing = clauseLines(held, DEFERRED_SECTION);
    if (standing.length > 0) {
        return venueRefusal(defersAlready(options.target, standing.length));
    }

    const lines = held.split("\n");
    const marked = [...lines.slice(0, section.to), `${LIST_MARKER}${RECORD_ABSENT}`, ...lines.slice(section.to)].join(
        "\n",
    );

    const witnessed = readFileSync(options.absolute, "utf8");
    if (witnessed !== held) {
        return venueRefusal(markerContended(options.target));
    }

    writeFileSync(options.absolute, marked, "utf8");

    return { code: 0, message: defersNothing(options.target), raised: null };
};

const receiverKnown = function receiverKnown(options: DeferRequest): boolean {
    const venueNames = readdirSync(dirname(options.absolute), { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(BLOCKING_SUFFIX))
        .map((entry) => entry.name);

    const board = surfaceText(options.repoRoot, surfacePath("board"));
    const index = surfaceText(options.repoRoot, surfacePath("agent_index"));
    const planned = plannedInvariants(surfaceText(options.repoRoot, AGENDA));
    return receiverResolves(options.receiver, board, index, venueNames, planned);
};

const deferRefusal = function deferRefusal(options: DeferRequest): RaiseOutcome | null {
    if (!options.target.endsWith(BLOCKING_SUFFIX)) {
        return venueRefusal(DEFER_NOT_VENUE);
    }

    if (!existsSync(options.absolute)) {
        return venueRefusal(deferVenueMissing(options.target));
    }

    return null;
};

export const runDefer = function runDefer(options: DeferRequest): RaiseOutcome {
    const refused = deferRefusal(options);
    if (refused !== null) {
        return refused;
    }

    if (options.clause === RECORD_ABSENT) {
        return deferNothing(options);
    }

    if (options.receiver === options.clause) {
        return venueRefusal(CLAUSE_IS_RECEIVER);
    }

    if (!receiverKnown(options)) {
        return venueRefusal(receiverUnknown(options.receiver));
    }

    const before = readFileSync(options.absolute, "utf8");
    const bound = sectionBound(before, DEFERRED_SECTION);
    if (bound === null) {
        return venueRefusal(deferredSectionMissing(options.target, DEFERRED_SECTION));
    }

    if (clauseLines(before, DEFERRED_SECTION).some(({ clause }) => clause === options.clause)) {
        return venueRefusal(clauseTaken(options.target, options.clause));
    }

    const lines = before.split("\n");
    const listed = lines
        .slice(bound.from + 1, Math.min(bound.to, lines.length))
        .findLastIndex((line) => line.trim().startsWith(LIST_MARKER));
    const at = listed === -1 ? bound.to - 1 : bound.from + 1 + listed;
    const deferral = `- ${options.clause} ${DEFERRAL_ARROW} ${options.receiver}`;
    const written = [...lines.slice(0, at + 1), deferral, ...lines.slice(at + 1)].join("\n");

    const witness = readFileSync(options.absolute, "utf8");
    if (witness !== before) {
        return venueRefusal(markerContended(options.target));
    }

    writeFileSync(options.absolute, written, "utf8");

    return {
        code: 0,
        message: clauseDeferred(options.clause, options.receiver, options.target),
        raised: options.clause,
    };
};

const deferredClauseOf = function deferredClauseOf(line: string): string | null {
    const trimmed = line.trim();
    if (!trimmed.startsWith(LIST_MARKER)) {
        return null;
    }

    const arrow = trimmed.indexOf(DEFERRAL_ARROW);
    return (arrow === -1 ? trimmed.slice(2) : trimmed.slice(2, arrow)).trim();
};

export const runRetract = function runRetract(options: {
    readonly target: string;
    readonly absolute: string;
    readonly clause: string;
}): RaiseOutcome {
    if (!options.target.endsWith(BLOCKING_SUFFIX)) {
        return venueRefusal(RETRACT_NOT_VENUE);
    }

    if (!existsSync(options.absolute)) {
        return venueRefusal(retractVenueMissing(options.target));
    }

    const before = readFileSync(options.absolute, "utf8");
    const bound = sectionBound(before, DEFERRED_SECTION);
    if (bound === null) {
        return venueRefusal(retractSectionMissing(options.target, DEFERRED_SECTION));
    }

    const lines = before.split("\n");
    const listed = lines
        .slice(bound.from + 1, Math.min(bound.to, lines.length))
        .findLastIndex((line) => deferredClauseOf(line) === options.clause);
    if (listed === -1) {
        return venueRefusal(retractClauseMissing(options.target, options.clause));
    }

    const at = bound.from + 1 + listed;
    const written = [...lines.slice(0, at), ...lines.slice(at + 1)].join("\n");

    const witness = readFileSync(options.absolute, "utf8");
    if (witness !== before) {
        return venueRefusal(markerContended(options.target));
    }

    writeFileSync(options.absolute, written, "utf8");

    return { code: 0, message: clauseRetracted(options.clause, options.target), raised: options.clause };
};
