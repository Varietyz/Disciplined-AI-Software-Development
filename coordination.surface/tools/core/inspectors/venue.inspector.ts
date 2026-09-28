import { AGENDA, BLOCKING_SUFFIX, PROTOCOL_BANNER } from "../constants/blocking.constants.ts";
import {
    RAISE_AGENDA_MISSING,
    RAISE_BANNER_MISSING,
    RAISE_NOTHING_ADMISSIBLE,
    RAISE_TEMPLATE_MISSING,
    raiseDestinationTaken,
    raiseNotAdmissible,
    raiseOrdinalMissing,
    raiseSuccessorUndeclared,
} from "../strings/venue.strings.ts";
import type { RaiseOutcome, RaisePlan, RaiseRequest } from "../types/venue.types.ts";
import { admissibleInvariants, agendaOrdinalOf } from "../readers/agenda.reader.ts";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { surfacePath, surfacePrefix } from "../../../config/surface.config.ts";
import { declaredSuccessor } from "../analyzers/converge.analyzer.ts";
import { resolve } from "node:path";
import { siblingVenues } from "../generators/venue.generator.ts";
import { venueRefusal } from "../factories/venue.factory.ts";

const raiseRefusal = function raiseRefusal(
    options: RaiseRequest,
    admissible: readonly string[],
    venueRoot: string,
): RaiseOutcome | null {
    if (admissible.length === 0) {
        return venueRefusal(RAISE_NOTHING_ADMISSIBLE);
    }

    const { declared } = options;
    if (declared !== null && declared.length > 0 && !admissible.includes(declared)) {
        return venueRefusal(raiseNotAdmissible(declared, admissible));
    }

    const undeclared = readdirSync(venueRoot, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(BLOCKING_SUFFIX))
        .filter((entry) => declaredSuccessor(readFileSync(resolve(venueRoot, entry.name), "utf8")).length === 0)
        .map((entry) => entry.name);

    return undeclared.length > 0 ? venueRefusal(raiseSuccessorUndeclared(undeclared)) : null;
};

const chosenInvariant = function chosenInvariant(declared: string | null, admissible: readonly string[]): string {
    return declared !== null && declared.length > 0 ? declared : (admissible[0] ?? "");
};

export const raisePlan = function raisePlan(options: RaiseRequest): RaiseOutcome | RaisePlan {
    const agendaPath = resolve(options.repoRoot, AGENDA);
    if (!existsSync(agendaPath)) {
        return venueRefusal(RAISE_AGENDA_MISSING);
    }

    const agenda = readFileSync(agendaPath, "utf8");
    const venueRoot = resolve(options.repoRoot, surfacePrefix());
    const admissible = admissibleInvariants(agenda, siblingVenues(venueRoot, options.repoRoot));
    const refused = raiseRefusal(options, admissible, venueRoot);
    if (refused !== null) {
        return refused;
    }

    const invariant = chosenInvariant(options.declared, admissible);

    const templatePath = resolve(options.repoRoot, surfacePath("venue_template"));
    if (!existsSync(templatePath)) {
        return venueRefusal(RAISE_TEMPLATE_MISSING);
    }

    const ordinal = agendaOrdinalOf(agenda, invariant);
    if (ordinal.length === 0) {
        return venueRefusal(raiseOrdinalMissing(invariant));
    }

    const name = `${invariant}.${ordinal}${BLOCKING_SUFFIX}`;
    const destination = resolve(venueRoot, name);
    if (existsSync(destination)) {
        return venueRefusal(raiseDestinationTaken(name));
    }

    const template = readFileSync(templatePath, "utf8");
    return template.includes(PROTOCOL_BANNER)
        ? { destination, invariant, name, template, venueRoot }
        : venueRefusal(RAISE_BANNER_MISSING);
};
