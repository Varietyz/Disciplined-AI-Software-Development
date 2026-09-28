import type { Invocation, Operation, Outcome } from "../types/invocation.types.ts";
import {
    agenda,
    arrive,
    defer,
    inherit,
    raise,
    record,
    relocate,
    retire,
    retract,
    roster,
    successor,
} from "../coordinators/venue.coordinator.ts";
import {
    append,
    extract,
    fixture,
    half,
    index,
    mark,
    member,
    repair,
    role,
    surfaceRaise,
    task,
    transition,
} from "../coordinators/invocation.coordinator.ts";
import { finish } from "../readers/invocation.reader.ts";

const EXCLUSIVE_ACTS: readonly Operation[] = [
    raise,
    relocate,
    retire,
    roster,
    inherit,
    agenda,
    append,
    repair,
    extract,
    fixture,
    member,
    role,
    surfaceRaise,
    half,
    task,
    mark,
    transition,
    index,
    record,
    retract,
    successor,
    defer,
    arrive,
];

export const runExclusive = async function runExclusive(invocation: Invocation): Promise<void> {
    let pending: Outcome | Promise<Outcome> | null = null;
    for (const operation of EXCLUSIVE_ACTS) {
        pending ??= operation(invocation);
    }

    if (pending !== null) {
        const outcome = await pending;
        finish(outcome.message, outcome.code);
    }
};
