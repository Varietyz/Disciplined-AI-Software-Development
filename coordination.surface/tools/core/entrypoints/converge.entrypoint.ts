import { AGENDA, BLOCKING_SUFFIX, VENUE_ARCHIVE } from "../constants/blocking.constants.ts";
import {
    CONVERGE_NEEDS_OPERANDS,
    archiveNameTaken,
    archiveRootMissing,
    convergeAbsent,
    convergeHelp,
    convergeNotVenue,
    convergePreview,
    converged,
    orderingsBlock,
} from "../strings/converge.strings.ts";

import { argumentValue, finish } from "../readers/invocation.reader.ts";
import { basename, resolve } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { historyPath, projectRoot, slotText, surfacePath, surfacePrefix } from "../../../config/surface.config.ts";
import { BOARD_PATH } from "../constants/board.constants.ts";
import { NO_FIX_FLAG } from "../constants/path.constants.ts";
import { convergenceEdges } from "../validators/converge.validator.ts";
import { plannedInvariants } from "../readers/agenda.reader.ts";
import { runArchiveMove } from "../runners/converge.runner.ts";
import { surfaceTarget } from "../resolvers/surface.resolver.ts";

const REPO_ROOT = projectRoot();

export const RESTATES: readonly string[] = [
    "a_venue_accumulates_and_the_board_is_swept",
    "a_venue_is_absorbed_before_it_is_archived",
    "an_undecided_half_names_its_receiver",
];

const venueNames = function venueNames(): string[] {
    const prefix = surfacePrefix();
    const root = resolve(REPO_ROOT, prefix);
    if (!existsSync(root)) {
        return [];
    }

    const out: string[] = [];
    for (const entry of readdirSync(root, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith(BLOCKING_SUFFIX)) {
            continue;
        }
        out.push(prefix.length === 0 ? entry.name : `${prefix}/${entry.name}`);
    }

    return out;
};

const textIfPresent = function textIfPresent(relative: string): string {
    const absolute = resolve(REPO_ROOT, relative);
    return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
};

const venueOperand = function venueOperand(named: string): string {
    const target = surfaceTarget(REPO_ROOT, named);
    const absolute = resolve(REPO_ROOT, target);
    if (!absolute.endsWith(BLOCKING_SUFFIX)) {
        finish(convergeNotVenue(target), 2);
    }

    if (!existsSync(absolute)) {
        finish(convergeAbsent(target), 2);
    }

    return target;
};

const holdEdges = function holdEdges(target: string): void {
    const edges = convergenceEdges(
        REPO_ROOT,
        target,
        textIfPresent(target),
        textIfPresent(BOARD_PATH),
        textIfPresent(surfacePath("agent_index")),
        textIfPresent(historyPath()),
        venueNames(),
        plannedInvariants(textIfPresent(AGENDA)),
    );

    for (const edge of edges) {
        const verdict = edge.holds ? "holds  " : "BLOCKS ";
        process.stdout.write(`  ${verdict} ${edge.edge}\n           ${edge.detail}\n`);
    }

    const blocking = edges.filter((edge) => !edge.holds);
    if (blocking.length > 0) {
        finish(orderingsBlock(blocking.length, edges.length, target), 2);
    }
};

const archiveDestination = function archiveDestination(target: string): string {
    const archiveRoot = resolve(REPO_ROOT, VENUE_ARCHIVE);
    const destination = resolve(archiveRoot, basename(target));
    if (!existsSync(archiveRoot)) {
        finish(archiveRootMissing(target), 2);
    }

    if (existsSync(destination)) {
        finish(archiveNameTaken(basename(target), target), 2);
    }

    return destination;
};

const main = function main(): void {
    if (process.argv.includes("--help")) {
        finish(convergeHelp(slotText("execution", "converge_command")), 0);
    }

    const agent = argumentValue("--agent");
    const named = argumentValue("--file");
    if (agent === null || named === null) {
        finish(CONVERGE_NEEDS_OPERANDS, 2);
    }

    const target = venueOperand(named);
    const absolute = resolve(REPO_ROOT, target);
    holdEdges(target);
    const destination = archiveDestination(target);

    if (process.argv.includes(NO_FIX_FLAG)) {
        process.stdout.write(convergePreview(target, agent));
        process.exit(0);
    }

    const moved = runArchiveMove(absolute, destination, target);
    if (moved.code !== 0) {
        process.stdout.write(moved.message);
        process.exit(moved.code);
    }

    process.stdout.write(converged(target, agent));
    process.exit(0);
};

main();
