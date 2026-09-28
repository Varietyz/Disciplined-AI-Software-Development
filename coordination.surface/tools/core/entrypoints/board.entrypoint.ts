import { AGENT_REQUIRED, waitHelp } from "../strings/invocation.strings.ts";
import {
    ANOTHER_EXCLUSIVE,
    POST_LANDED,
    REHEARSED,
    argumentsUnknown,
    exclusiveCombined,
    venueNoSweep,
} from "../strings/board.strings.ts";
import type { Invocation, Outcome } from "../types/invocation.types.ts";
import { SELF_REHEARSING, VENUE_ACTS } from "../registries/invocation.registry.ts";
import { argumentValue, finish } from "../readers/invocation.reader.ts";
import { awaitChange, runBarrier } from "../coordinators/board.coordinator.ts";
import { historyPath, projectRoot, surfacePath } from "../../../config/surface.config.ts";
import { unknownArguments, unshareableOperations, writesNothing } from "../validators/entrypoint.validator.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import { NO_FIX_FLAG } from "../constants/path.constants.ts";
import { WAIT_COMMAND } from "../constants/board.constants.ts";
import { authorityRefusal } from "../resolvers/venue.resolver.ts";
import { postComposable } from "../coordinators/record.coordinator.ts";
import { releaseAgent } from "../registries/board.registry.ts";
import { resolve } from "node:path";
import { runExclusive } from "../orchestrators/invocation.orchestrator.ts";
import { runSweep } from "../runners/sweep.runner.ts";
import { surfaceTarget } from "../resolvers/surface.resolver.ts";
import { tidyOf } from "../coordinators/collapse.coordinator.ts";
import { venueFieldLine } from "../reporters/venue.reporter.ts";

export const RESTATES: readonly string[] = [
    "a_venue_accumulates_and_the_board_is_swept",
    "the_handler_removes_the_item",
    "removal_declares_its_extraction",
    "a_position_is_posted_through_the_tool",
    "board_is_current_truth_only",
    "template_is_the_contract_not_a_copy_of_it",
];

const EXCLUSIVE_OPERATIONS: readonly string[] = [
    "--raise",
    "--relocate",
    "--retire",
    "--inherit",
    "--roster",
    "--agenda",
    "--append",
    "--repair",
    "--extract",
    "--fixture",
    "--member",
    "--role",
    "--half",
    "--task",
    "--mark",
    "--transition",
    "--index",
    "--record",
    "--retract",
    "--successor",
    "--defer",
    "--arrive",
    "--model",
    "--finding",
    "--distribute",
    "--barrier",
];

const COMPOSABLE_OPERATIONS: readonly string[] = ["--item", "--field", "--read", "--sign", "--closes", "--compress"];

const OPERANDS: readonly string[] = [
    "--agent",
    "--because",
    "--body",
    "--body-file",
    "--discharge",
    "--establishes",
    "--establishes-file",
    "--extracted",
    "--file",
    "--help",
    "--item-file",
    "--kind",
    "--lead",
    "--no-wait",
    "--observer",
    "--planned",
    "--ref",
    "--seat",
    "--seats",
    "--statement",
    "--to",
    "--value",
];

const KNOWN_ARGUMENTS: readonly string[] = [
    ...EXCLUSIVE_OPERATIONS,
    ...COMPOSABLE_OPERATIONS,
    ...OPERANDS,
    NO_FIX_FLAG,
];

const REPO_ROOT = projectRoot();

const CHANGELOG = historyPath();

const DEFAULT_TARGET = surfacePath("board");

const help = function help(): never {
    process.stdout.write(waitHelp(WAIT_COMMAND));
    finish(venueFieldLine(REPO_ROOT), 0);
};

const barrier = function barrier(): Outcome | null {
    return process.argv.includes("--barrier")
        ? runBarrier(REPO_ROOT, resolve(REPO_ROOT, DEFAULT_TARGET), Date.now())
        : null;
};

const refuseInvocation = function refuseInvocation(caller: string): void {
    const unknown = unknownArguments(process.argv.slice(2), KNOWN_ARGUMENTS);
    if (unknown.length > 0) {
        finish(argumentsUnknown(unknown, KNOWN_ARGUMENTS), 2);
    }

    releaseAgent(REPO_ROOT, caller, Date.now());

    const requestedFlags = [...EXCLUSIVE_OPERATIONS, ...COMPOSABLE_OPERATIONS].filter((flag) =>
        process.argv.includes(flag),
    );
    const exclusive = unshareableOperations(requestedFlags, EXCLUSIVE_OPERATIONS);
    if (exclusive.length > 0) {
        const others = requestedFlags.filter((flag) => !exclusive.includes(flag)).join(", ") || ANOTHER_EXCLUSIVE;
        finish(exclusiveCombined(exclusive, others), 2);
    }
};

const refuseAuthority = function refuseAuthority(caller: string): void {
    const act = VENUE_ACTS.find(([flag]) => process.argv.includes(flag));
    const refused = act === undefined ? null : authorityRefusal(REPO_ROOT, caller, act[1]);
    if (refused !== null) {
        finish(refused, 2);
    }
};

const main = async function main(): Promise<void> {
    const target = surfaceTarget(REPO_ROOT, argumentValue("--file") ?? DEFAULT_TARGET);
    const absolute = resolve(REPO_ROOT, target);

    if (process.argv.includes("--help")) {
        help();
    }

    const caller = argumentValue("--agent");
    if (caller === null) {
        finish(AGENT_REQUIRED, 2);
    }

    const invocation: Invocation = { absolute, caller, target };
    refuseInvocation(caller);

    const barred = barrier();
    if (barred !== null) {
        finish(barred.message, barred.code);
    }

    refuseAuthority(caller);

    if (writesNothing(process.argv, NO_FIX_FLAG, Object.keys(SELF_REHEARSING))) {
        finish(REHEARSED, 0);
    }

    await runExclusive(invocation);

    const item = postComposable(invocation);
    const tidy = tidyOf(invocation);

    process.stdout.write(
        target.endsWith(BLOCKING_SUFFIX) ? venueNoSweep(target) : runSweep(REPO_ROOT, absolute, CHANGELOG).message,
    );

    if (tidy !== 0 && item === null) {
        process.exit(tidy);
    }
    if (tidy !== 0) {
        process.stdout.write(POST_LANDED);
    }

    await awaitChange(invocation);
};

await main();
