import { AWAITING_MARKER, BLOCKING_SUFFIX, VENUE_ARCHIVE } from "../constants/blocking.constants.ts";
import {
    agendaRowAdded,
    invariantTaken,
    planContended,
    planFileMissing,
    planTerminatorMissing,
} from "../strings/agenda.strings.ts";

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { surfacePath, surfacePrefix } from "../../../config/surface.config.ts";
import type { ScheduleReading } from "../types/agenda.types.ts";
import { letters } from "./converge.runner.ts";
import { openVenues } from "../resolvers/sweep.resolver.ts";
import { resolve } from "node:path";
import { schedule } from "../../../config/agenda.config.ts";

const MARKED_FIELD = AWAITING_MARKER;

const PLAN_TERMINATOR = "]);";

interface AgendaRequest {
    readonly plan: string;
    readonly invariant: string;
    readonly establishes: string;
    readonly ordinal: string;
    readonly note: string;
}

interface AgendaOutcome {
    readonly message: string;
    readonly code: number;
}

const liveVenues = function liveVenues(repoRoot: string): string[] {
    const prefix = surfacePrefix();
    const root = resolve(repoRoot, prefix);
    if (!existsSync(root)) {
        return [];
    }

    const entries = readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => (prefix.length === 0 ? entry.name : `${prefix}/${entry.name}`));

    return openVenues(entries, VENUE_ARCHIVE, BLOCKING_SUFFIX);
};

const archivedVenues = function archivedVenues(repoRoot: string): string[] {
    const root = resolve(repoRoot, surfacePath("venue_archive"));
    if (!existsSync(root)) {
        return [];
    }

    return readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(BLOCKING_SUFFIX))
        .map((entry) => entry.name);
};

const hasMarkedLetter = function hasMarkedLetter(repoRoot: string, venue: string): boolean {
    const absolute = resolve(repoRoot, venue);
    if (!existsSync(absolute)) {
        return false;
    }

    for (const line of readFileSync(absolute, "utf8").split("\n")) {
        if (!line.startsWith(MARKED_FIELD)) {
            continue;
        }
        return letters(line, MARKED_FIELD).length > 0;
    }

    return false;
};

export const readSchedule = function readSchedule(repoRoot: string): ScheduleReading[] {
    const live = liveVenues(repoRoot);
    const archived = archivedVenues(repoRoot);

    return schedule.map((plan) => {
        const onRoot = live.find((venue) => venue.includes(plan.invariant));
        if (onRoot !== undefined) {
            const marked = hasMarkedLetter(repoRoot, onRoot);
            return {
                derived: true,
                evidence: `${onRoot} stands at the active root and its roster carries ${marked ? "a marked letter" : "no marked letter"}`,
                plan,
                state: marked ? "open" : "created",
            };
        }

        const inArchive = archived.find((venue) => venue.includes(plan.invariant));
        if (inArchive !== undefined) {
            return { derived: true, evidence: `${inArchive} resolves under the archive root`, plan, state: "archived" };
        }

        if (plan.declaredState !== undefined) {
            return { derived: false, evidence: plan.declaredBecause ?? "", plan, state: plan.declaredState };
        }

        return { derived: true, evidence: "neither listing holds a venue for it", plan, state: "planned" };
    });
};

const planEntry = function planEntry(request: AgendaRequest): string {
    const fields = [
        `        ordinal: ${JSON.stringify(request.ordinal)},`,
        `        invariant: ${JSON.stringify(request.invariant)},`,
        `        establishes: ${JSON.stringify(request.establishes)},`,
    ];

    if (request.note.length > 0) {
        fields.push(`        note: ${JSON.stringify(request.note)},`);
    }

    return ["    {", ...fields, "    },"].join("\n");
};

const withPlanEntry = function withPlanEntry(lines: readonly string[], entry: string): string[] | null {
    const at = lines.findLastIndex((line) => line.trimEnd().endsWith(PLAN_TERMINATOR));
    if (at === -1) {
        return null;
    }

    const line = lines[at] ?? "";
    const cut = line.lastIndexOf(PLAN_TERMINATOR);
    const head = line.slice(0, cut);
    const closing = head.trim().length === 0 ? [entry, line] : [head, entry, line.slice(cut)];
    return [...lines.slice(0, at), ...closing, ...lines.slice(at + 1)];
};

export const runAgendaRow = function runAgendaRow(request: AgendaRequest): AgendaOutcome {
    if (!existsSync(request.plan)) {
        return { code: 2, message: planFileMissing(request.plan) };
    }

    const before = readFileSync(request.plan, "utf8");

    if (schedule.some((row) => row.invariant === request.invariant)) {
        return { code: 2, message: invariantTaken(request.invariant) };
    }

    const entered = withPlanEntry(before.split("\n"), planEntry(request));
    if (entered === null) {
        return { code: 2, message: planTerminatorMissing(request.plan) };
    }

    const written = entered.join("\n");

    const witness = readFileSync(request.plan, "utf8");
    if (witness !== before) {
        return { code: 2, message: planContended(request.plan) };
    }

    writeFileSync(request.plan, written, "utf8");

    return { code: 0, message: agendaRowAdded(request.invariant, request.plan) };
};
