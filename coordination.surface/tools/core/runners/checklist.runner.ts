import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
    retireContended,
    retireLineMissing,
    retireMissing,
    retireNotPlanning,
    retireNothingDistributed,
    retirePreview,
    retireVenueOpen,
    retired,
    retiredDeclaration,
} from "../strings/venue.strings.ts";
import { CHECKLIST_CONCERN } from "../constants/checklist.constants.ts";
import { DISTRIBUTES_FIELD } from "../resolvers/converge.resolver.ts";
import type { RaiseOutcome } from "../types/venue.types.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";
import { venueRefusal } from "../factories/venue.factory.ts";

export const runRetire = function runRetire(options: {
    readonly repoRoot: string;
    readonly name: string;
    readonly declares: string;
    readonly live: readonly string[];
    readonly citedBy: readonly string[];
    readonly heal: boolean;
}): RaiseOutcome {
    const planning = surfacePath("planning");
    const source = `${planning}/${options.name}`;
    const absolute = resolve(options.repoRoot, source);

    if (!options.name.endsWith(CHECKLIST_CONCERN)) {
        return venueRefusal(retireNotPlanning(options.name));
    }

    if (!existsSync(absolute)) {
        return venueRefusal(retireMissing(source));
    }

    if (options.declares.length === 0) {
        return venueRefusal(retireNothingDistributed(source));
    }

    if (options.live.some((venue) => venue.endsWith(options.declares))) {
        return venueRefusal(retireVenueOpen(source, options.declares));
    }

    const pinning = options.citedBy.filter((citer) => citer.length > 0);
    const before = readFileSync(absolute, "utf8");
    const lines = before.split("\n");
    const at = lines.findIndex((line) => line.trim().startsWith(DISTRIBUTES_FIELD));

    if (at === -1) {
        return venueRefusal(retireLineMissing(source));
    }

    const line = lines[at] ?? "";
    const retiredLine = retiredDeclaration(line.slice(0, line.indexOf(DISTRIBUTES_FIELD)), pinning);
    const written = [...lines.slice(0, at), retiredLine, ...lines.slice(at + 1)].join("\n");

    if (!options.heal) {
        return { code: 0, message: retirePreview(source, options.declares), raised: source };
    }

    if (readFileSync(absolute, "utf8") !== before) {
        return venueRefusal(retireContended(source));
    }

    writeFileSync(absolute, written, "utf8");

    return { code: 0, message: retired(source), raised: source };
};
