import { ACKNOWLEDGED, EMPTY_EXTRACTION } from "../validators/archive.validator.ts";
import { READ_FIELD, isItemId } from "../formatters/board.formatter.ts";
import { argumentValue, finish } from "../readers/invocation.reader.ts";
import { authorOf, healRequested, unmarkedReaders } from "../runners/mark.runner.ts";
import {
    closureSettled,
    compressSettled,
    emptyExtractionCheck,
    readersOutstanding,
    twinAdmitted,
    venueNoRemoval,
} from "../strings/board.strings.ts";
import { duplicateTwinOf, itemSpans } from "../resolvers/sweep.resolver.ts";
import { existsSync, readFileSync } from "node:fs";
import { historyPath, projectRoot, surfacePath } from "../../../config/surface.config.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import type { Invocation } from "../types/invocation.types.ts";
import { NO_FIX_FLAG } from "../constants/path.constants.ts";
import { activeSeats } from "../analyzers/board.analyzer.ts";
import { filedNotice } from "../analyzers/archive.analyzer.ts";
import { resolve } from "node:path";
import { runClosure } from "../runners/archive.runner.ts";
import { runCompression } from "../runners/collapse.runner.ts";
import { runDischarge } from "../runners/sweep.runner.ts";
import { textIfPresent } from "../readers/venue.reader.ts";

const REPO_ROOT = projectRoot();

const CHANGELOG = historyPath();

const emit = function emit(
    outcome: { message: string; code: number; excised: readonly string[] },
    label: string,
): number {
    process.stdout.write(outcome.message);
    for (const excerpt of outcome.excised) {
        process.stdout.write(`  ${label}  ${excerpt}\n`);
    }
    return outcome.code;
};

const alreadyGone = function alreadyGone(absolute: string, marker: string): boolean {
    if (!isItemId(marker)) {
        return false;
    }
    if (!existsSync(absolute)) {
        return true;
    }

    const spans = itemSpans(readFileSync(absolute, "utf8"));
    return !spans.some((span) => span.key === marker);
};

const heldReaders = function heldReaders(absolute: string, closes: string): string[] {
    const source = textIfPresent(absolute);
    const span = itemSpans(source).find((entry) => entry.key === closes);
    const marker = span === undefined ? "" : (source.split("\n")[span.from] ?? "");
    if (span === undefined || !marker.includes(READ_FIELD)) {
        return [];
    }

    const bound = textIfPresent(resolve(REPO_ROOT, surfacePath("agent_index")));
    const board = resolve(REPO_ROOT, surfacePath("board"));
    const active = existsSync(board) ? activeSeats(readFileSync(board, "utf8"), bound) : [];

    return unmarkedReaders(marker, span.to, active, authorOf(closes));
};

const removal = function removal(
    request: { target: string; absolute: string; marker: string; agent: string | null; extracted: string | null },
    heal: boolean,
    label: string,
): number {
    return emit(
        runCompression({ ...request, archive: resolve(REPO_ROOT, CHANGELOG), changelog: CHANGELOG, heal }),
        label,
    );
};

const closure = function closure(target: string, absolute: string, closes: string): number {
    if (alreadyGone(absolute, closes)) {
        process.stdout.write(closureSettled(closes, target));
        return 0;
    }

    const held = heldReaders(absolute, closes);
    if (held.length > 0) {
        process.stdout.write(readersOutstanding(closes, held));
        return 2;
    }

    const ref = argumentValue("--ref");
    const outcome = runClosure({
        absolute,
        agent: argumentValue("--agent"),
        archive: resolve(REPO_ROOT, CHANGELOG),
        closes,
        index: resolve(REPO_ROOT, surfacePath("agent_index")),
        ref,
    });

    if (outcome.refusal !== null) {
        process.stdout.write(outcome.refusal);
        return 2;
    }

    const heal = healRequested(process.argv, NO_FIX_FLAG);
    const label = heal ? outcome.label : `would be ${outcome.label}`;

    if (ref === EMPTY_EXTRACTION) {
        const archive = resolve(REPO_ROOT, CHANGELOG);
        const filed = existsSync(archive) ? filedNotice(readFileSync(archive, "utf8")) : "";
        process.stdout.write(emptyExtractionCheck(filed));
    }

    const extracted = outcome.acknowledged ? ACKNOWLEDGED : ref;
    return removal({ absolute, agent: outcome.author, extracted, marker: closes, target }, heal, label);
};

const compress = function compress(target: string, absolute: string, marker: string): number {
    if (alreadyGone(absolute, marker)) {
        process.stdout.write(compressSettled(marker, target));
        return 0;
    }

    const heal = healRequested(process.argv, NO_FIX_FLAG);
    const request = {
        absolute,
        agent: argumentValue("--agent"),
        extracted: argumentValue("--extracted"),
        marker,
        target,
    };
    return removal(request, heal, heal ? "removed" : "would remove");
};

const discharge = function discharge(target: string, absolute: string, clause: string): number {
    const outcome = runDischarge({
        absolute,
        archive: resolve(REPO_ROOT, CHANGELOG),
        clause,
        ref: argumentValue("--ref"),
        target,
    });
    process.stdout.write(outcome.message);
    return outcome.code;
};

const refuseVenueRemoval = function refuseVenueRemoval(
    { absolute, target }: Invocation,
    marker: string | null,
    closes: string | null,
): void {
    if (!target.endsWith(BLOCKING_SUFFIX)) {
        return;
    }

    const twin =
        closes !== null && existsSync(absolute) ? duplicateTwinOf(readFileSync(absolute, "utf8"), closes) : null;
    if (closes !== null && twin !== null) {
        process.stdout.write(twinAdmitted(closes, twin));
    }

    if (marker !== null || (closes !== null && twin === null)) {
        finish(venueNoRemoval(target), 2);
    }
};

export const tidyOf = function tidyOf(invocation: Invocation): number {
    const { absolute, target } = invocation;
    const marker = argumentValue("--compress");
    const closes = argumentValue("--closes");
    refuseVenueRemoval(invocation, marker, closes);

    const clause = argumentValue("--discharge");
    const discharged = clause === null ? 0 : discharge(target, absolute, clause);
    const compressed = marker === null ? discharged : compress(target, absolute, marker);
    return closes === null ? compressed : closure(target, absolute, closes) || compressed;
};
