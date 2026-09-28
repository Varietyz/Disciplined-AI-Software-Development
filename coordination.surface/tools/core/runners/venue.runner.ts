import {
    AGENDA,
    AWAITING_MARKER,
    BLOCKING_SUFFIX,
    PROTOCOL_BANNER,
    UNREAD_MARKER,
} from "../constants/blocking.constants.ts";
import {
    RAISE_SPECIMEN_MISSING,
    RELOCATE_ROOT_MISSING,
    SUCCESSOR_NOT_VENUE,
    raiseUnbound,
    raised as raisedMessage,
    relocateDestinationTaken,
    relocateMismatch,
    relocateNotVenue,
    relocateSourceMissing,
    relocated,
    successorContended,
    successorDeclared,
    successorNotPlanned,
    successorSectionMissing,
    successorVenueMissing,
} from "../strings/venue.strings.ts";
import type { RaiseOutcome, RaiseRequest } from "../types/venue.types.ts";
import { SIGN_OFF_BANNER, surfaceText, textIfPresent } from "../readers/venue.reader.ts";
import { SUCCESSOR_FIELD, successorWritten } from "../transformers/venue.transformer.ts";
import {
    blockFor,
    deferringLabel,
    deferringVenues,
    recordSpecimen,
    seatRecord,
} from "../generators/venue.generator.ts";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { projectRoot, surfacePrefix } from "../../../config/surface.config.ts";
import { AGENT_INDEX } from "../constants/board.constants.ts";
import { indexedLetters } from "../inspectors/index.inspector.ts";
import { plannedInvariants } from "../readers/agenda.reader.ts";
import { raisePlan } from "../inspectors/venue.inspector.ts";
import { resolve } from "node:path";
import { rosterLine } from "./converge.runner.ts";
import { seatedLetters } from "../resolvers/venue.resolver.ts";
import { venueRefusal } from "../factories/venue.factory.ts";

export const runSuccessor = function runSuccessor(options: {
    readonly target: string;
    readonly absolute: string;
    readonly invariant: string;
}): RaiseOutcome {
    if (!options.target.endsWith(BLOCKING_SUFFIX)) {
        return venueRefusal(SUCCESSOR_NOT_VENUE);
    }

    if (!existsSync(options.absolute)) {
        return venueRefusal(successorVenueMissing(options.target));
    }

    const agenda = surfaceText(projectRoot(), AGENDA);
    const planned = plannedInvariants(agenda);
    if (!planned.includes(options.invariant)) {
        return venueRefusal(successorNotPlanned(options.invariant));
    }

    const before = readFileSync(options.absolute, "utf8");
    const written = successorWritten(before, `${SUCCESSOR_FIELD} ${options.invariant}`);
    if (written === null) {
        return venueRefusal(successorSectionMissing(options.target));
    }

    const witness = readFileSync(options.absolute, "utf8");
    if (witness !== before) {
        return { code: 2, message: successorContended(options.target), raised: null };
    }

    writeFileSync(options.absolute, written, "utf8");

    return { code: 0, message: successorDeclared(options.target, options.invariant), raised: null };
};

export const runRelocate = function runRelocate(options: {
    readonly repoRoot: string;
    readonly name: string;
}): RaiseOutcome {
    if (!options.name.endsWith(BLOCKING_SUFFIX)) {
        return venueRefusal(relocateNotVenue(options.name));
    }

    const venueRoot = resolve(options.repoRoot, surfacePrefix());
    const destination = resolve(venueRoot, options.name);
    const stray = resolve(options.repoRoot, options.name);

    if (!existsSync(venueRoot)) {
        return venueRefusal(RELOCATE_ROOT_MISSING);
    }

    if (existsSync(destination)) {
        return venueRefusal(relocateDestinationTaken(options.name));
    }

    if (!existsSync(stray)) {
        return venueRefusal(relocateSourceMissing(options.name));
    }

    const carried = readFileSync(stray, "utf8");
    writeFileSync(destination, carried, "utf8");

    const landed = readFileSync(destination, "utf8");
    if (landed !== carried) {
        return venueRefusal(relocateMismatch(options.name));
    }

    rmSync(stray);

    return { code: 0, message: relocated(options.name), raised: options.name };
};

const rosterStart = function rosterStart(line: string, participants: readonly string[]): string {
    if (line.startsWith(UNREAD_MARKER)) {
        return rosterLine(UNREAD_MARKER, participants);
    }
    return line.startsWith(AWAITING_MARKER) ? rosterLine(AWAITING_MARKER, []) : line;
};

export const runRaise = function runRaise(options: RaiseRequest): RaiseOutcome {
    const plan = raisePlan(options);
    if (!("template" in plan)) {
        return plan;
    }

    const { destination, invariant, name, template, venueRoot } = plan;
    const deferring = deferringVenues(venueRoot, options.repoRoot, invariant);
    const composed = template.replace(PROTOCOL_BANNER, `${blockFor(invariant, deferring)}${PROTOCOL_BANNER}`);
    const participants = options.seats.length > 0 ? [...options.seats] : seatedLetters(options.repoRoot);

    const bound = indexedLetters(textIfPresent(resolve(options.repoRoot, AGENT_INDEX))).letters;
    const unbound = participants.filter((letter) => !bound.has(letter));
    if (unbound.length > 0) {
        return venueRefusal(raiseUnbound(unbound));
    }

    const specimen = recordSpecimen(template);
    if (specimen.length === 0) {
        return venueRefusal(RAISE_SPECIMEN_MISSING);
    }

    const seated = participants.flatMap((letter) => [...seatRecord(specimen, letter), ""]);
    const raisedVenue = composed
        .split("\n")
        .flatMap((line) => (line.startsWith(SIGN_OFF_BANNER) ? [...seated, line] : [line]))
        .map((line) => rosterStart(line, participants))
        .join("\n");

    writeFileSync(destination, raisedVenue, "utf8");

    return {
        code: 0,
        message: raisedMessage(name, participants, deferring.clauses.length, deferringLabel(deferring)),
        raised: name,
    };
};
