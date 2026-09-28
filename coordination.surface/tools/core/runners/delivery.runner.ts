import {
    ARRIVE_NOT_VENUE,
    ARRIVE_NO_SUCCESSOR,
    arrivalContended,
    arrivalHeld,
    arrivalSettled,
    arriveNoInheritedSection,
    arrivePredecessorMissing,
    arriveSectionEmpty,
    arriveSuccessorUnraised,
    arrived,
    inheritContended,
    inheritNotVenue,
    inheritSectionMissing,
    inheritSectionUnbounded,
    inheritUnchanged,
    inheritUpdated,
    inheritVenueElsewhere,
} from "../strings/venue.strings.ts";
import { BLOCKING_SUFFIX, INHERITED_BANNER, PROTOCOL_BANNER } from "../constants/blocking.constants.ts";
import { DEFERRAL_ARROW, DEFERRED_SECTION, clauseLines, declaredSuccessor } from "../analyzers/converge.analyzer.ts";
import { addressesSuccessor, venueInvariant } from "../resolvers/venue.resolver.ts";
import { basename, dirname, resolve } from "node:path";
import { blockFor, deferringLabel, deferringVenues } from "../generators/venue.generator.ts";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import type { RaiseOutcome } from "../types/venue.types.ts";
import { lastInheritedItem } from "../transformers/venue.transformer.ts";
import { surfacePrefix } from "../../../config/surface.config.ts";
import { venueRefusal } from "../factories/venue.factory.ts";

interface Arrival {
    readonly source: string;
    readonly name: string;
    readonly path: string;
    readonly witnessed: string;
}

const successorPath = function successorPath(
    absolute: string,
    predecessor: string,
    invariant: string,
): { name: string; path: string } {
    const directory = dirname(absolute);
    const found = existsSync(directory)
        ? readdirSync(directory).find(
              (entry) =>
                  entry.startsWith(`${invariant}.`) &&
                  entry.endsWith(BLOCKING_SUFFIX) &&
                  entry !== basename(predecessor),
          )
        : undefined;

    const name = found ?? `${invariant}${BLOCKING_SUFFIX}`;
    return { name, path: resolve(directory, name) };
};

const arrivalOf = function arrivalOf(options: {
    readonly predecessor: string;
    readonly absolute: string;
}): Arrival | RaiseOutcome {
    if (!options.predecessor.endsWith(BLOCKING_SUFFIX)) {
        return venueRefusal(ARRIVE_NOT_VENUE);
    }

    if (!existsSync(options.absolute)) {
        return venueRefusal(arrivePredecessorMissing(options.predecessor));
    }

    const source = readFileSync(options.absolute, "utf8");
    const invariant = declaredSuccessor(source);
    if (invariant.length === 0) {
        return venueRefusal(ARRIVE_NO_SUCCESSOR);
    }

    const { name, path } = successorPath(options.absolute, options.predecessor, invariant);
    if (!existsSync(path)) {
        return venueRefusal(arriveSuccessorUnraised(name));
    }

    const witnessed = readFileSync(path, "utf8");
    return witnessed.includes(INHERITED_BANNER)
        ? { name, path, source, witnessed }
        : venueRefusal(arriveNoInheritedSection(name));
};

export const runArrive = function runArrive(options: {
    readonly predecessor: string;
    readonly absolute: string;
}): RaiseOutcome {
    const arrival = arrivalOf(options);
    if (!("witnessed" in arrival)) {
        return arrival;
    }

    const { name, path, source, witnessed } = arrival;
    const addressed = clauseLines(source, DEFERRED_SECTION).filter((entry) => !witnessed.includes(entry.clause));
    const missing = addressed.filter((entry) => addressesSuccessor(entry.receiver, name));
    const elsewhere = addressed.filter((entry) => !addressesSuccessor(entry.receiver, name));

    if (missing.length === 0) {
        return elsewhere.length > 0
            ? {
                  code: 0,
                  message: arrivalHeld(
                      name,
                      elsewhere.map((entry) => `${entry.clause} → ${entry.receiver}`),
                  ),
                  raised: null,
              }
            : { code: 0, message: arrivalSettled(options.predecessor, name), raised: name };
    }

    const lines = witnessed.split("\n");
    const last = lastInheritedItem(lines);
    if (last === -1) {
        return venueRefusal(arriveSectionEmpty(name));
    }

    const carried = missing.map((entry) => `- ${entry.clause} ${DEFERRAL_ARROW} ${entry.receiver}`);
    lines.splice(last + 1, 0, ...carried);

    const current = readFileSync(path, "utf8");
    if (current !== witnessed) {
        return { code: 2, message: arrivalContended(name), raised: null };
    }

    writeFileSync(path, lines.join("\n"), "utf8");

    return {
        code: 0,
        message: arrived(
            missing.length,
            options.predecessor,
            name,
            missing.map((entry) => entry.clause),
        ),
        raised: name,
    };
};

export const runInherit = function runInherit(options: {
    readonly repoRoot: string;
    readonly name: string;
}): RaiseOutcome {
    if (!options.name.endsWith(BLOCKING_SUFFIX)) {
        return venueRefusal(inheritNotVenue(options.name));
    }

    const venueRoot = resolve(options.repoRoot, surfacePrefix());
    const absolute = resolve(venueRoot, options.name);
    if (!existsSync(absolute)) {
        return venueRefusal(inheritVenueElsewhere(options.name));
    }

    const invariant = venueInvariant(options.name);
    const deferring = deferringVenues(venueRoot, options.repoRoot, invariant);
    const before = readFileSync(absolute, "utf8");
    const lines = before.split("\n");

    const opens = lines.findIndex((line) => line.startsWith(INHERITED_BANNER));
    if (opens === -1) {
        return venueRefusal(inheritSectionMissing(options.name));
    }

    const closes = lines.findIndex((line, index) => index > opens && line.startsWith(PROTOCOL_BANNER));
    if (closes === -1) {
        return venueRefusal(inheritSectionUnbounded(options.name));
    }

    const block = blockFor(invariant, deferring);
    const written = [...lines.slice(0, opens), ...block.split("\n").slice(0, -1), ...lines.slice(closes)].join("\n");
    if (written === before) {
        return { code: 0, message: inheritUnchanged(options.name), raised: options.name };
    }

    const witness = readFileSync(absolute, "utf8");
    if (witness !== before) {
        return venueRefusal(inheritContended(options.name));
    }

    writeFileSync(absolute, written, "utf8");

    return {
        code: 0,
        message: inheritUpdated(options.name, deferring.clauses.length, deferringLabel(deferring)),
        raised: options.name,
    };
};
