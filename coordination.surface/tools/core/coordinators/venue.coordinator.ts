import { AGENDA_NEEDS_ESTABLISHES, DEFER_NEEDS_RECEIVER } from "../strings/board.strings.ts";
import { AGENDA_PLAN, BLOCKING_SUFFIX, VENUE_ARCHIVE } from "../constants/blocking.constants.ts";
import type { Invocation, Outcome } from "../types/invocation.types.ts";
import { argumentValue, joinedValue, refuseFixedTarget, textOperand } from "../readers/invocation.reader.ts";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { healRequested, runRoster } from "../runners/mark.runner.ts";
import { openVenues, surfaceEntries } from "../resolvers/sweep.resolver.ts";
import { projectRoot, surfacePath } from "../../../config/surface.config.ts";
import { runArrive, runInherit } from "../runners/delivery.runner.ts";
import { runDefer, runRetract } from "../runners/blocking.runner.ts";
import { runRaise, runRelocate, runSuccessor } from "../runners/venue.runner.ts";
import { NO_FIX_FLAG } from "../constants/path.constants.ts";
import { declaredDistributions } from "../resolvers/converge.resolver.ts";
import { resolve } from "node:path";
import { runAgendaRow } from "../runners/agenda.runner.ts";
import { runRecord } from "../runners/record.runner.ts";
import { runRetire } from "../runners/checklist.runner.ts";
import { textIfPresent } from "../readers/venue.reader.ts";

const REPO_ROOT = projectRoot();

export const raise = function raise(): Outcome | null {
    if (!process.argv.includes("--raise")) {
        return null;
    }

    const seats = (joinedValue("--seats") ?? "")
        .split(",")
        .flatMap((part) => part.split(" "))
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
    return runRaise({ declared: argumentValue("--raise"), repoRoot: REPO_ROOT, seats });
};

export const relocate = function relocate(): Outcome | null {
    const name = argumentValue("--relocate");
    return name === null ? null : runRelocate({ name, repoRoot: REPO_ROOT });
};

const citingArchive = function citingArchive(cited: string): string[] {
    const frozen = resolve(REPO_ROOT, surfacePath("archive"));
    if (!existsSync(frozen)) {
        return [];
    }

    return readdirSync(frozen, { encoding: "utf8", recursive: true })
        .map((entry) => resolve(frozen, entry))
        .filter((entry) => statSync(entry).isFile())
        .filter((entry) => readFileSync(entry, "utf8").includes(cited));
};

export const retire = function retire(): Outcome | null {
    const name = argumentValue("--retire");
    if (name === null) {
        return null;
    }

    const cited = `${surfacePath("planning")}/${name}`;
    const declared = declaredDistributions([cited], (path) => textIfPresent(resolve(REPO_ROOT, path)));
    return runRetire({
        citedBy: citingArchive(cited),
        declares: declared[0]?.declares ?? "",
        heal: healRequested(process.argv, NO_FIX_FLAG),
        live: openVenues(surfaceEntries(REPO_ROOT), VENUE_ARCHIVE, BLOCKING_SUFFIX),
        name,
        repoRoot: REPO_ROOT,
    });
};

export const roster = function roster(): Outcome | null {
    const name = argumentValue("--roster");
    return name === null ? null : runRoster({ name, repoRoot: REPO_ROOT });
};

export const inherit = function inherit(): Outcome | null {
    const name = argumentValue("--inherit");
    return name === null ? null : runInherit({ name, repoRoot: REPO_ROOT });
};

export const agenda = function agenda(): Outcome | null {
    const invariant = argumentValue("--agenda");
    if (invariant === null) {
        return null;
    }

    refuseFixedTarget("--agenda", surfacePath("agenda"));
    const establishes = textOperand("--establishes", "--establishes-file");
    if (establishes === null) {
        return { code: 2, message: AGENDA_NEEDS_ESTABLISHES };
    }

    return runAgendaRow({
        establishes,
        invariant,
        note: joinedValue("--because") ?? "",
        ordinal: argumentValue("--planned") ?? "—",
        plan: resolve(REPO_ROOT, AGENDA_PLAN),
    });
};

export const record = function record({ absolute, caller, target }: Invocation): Outcome | null {
    return process.argv.includes("--record")
        ? runRecord({ absolute, agent: caller, repoRoot: REPO_ROOT, target })
        : null;
};

export const retract = function retract({ absolute, target }: Invocation): Outcome | null {
    const clause = argumentValue("--retract");
    return clause === null ? null : runRetract({ absolute, clause, target });
};

export const successor = function successor({ absolute, target }: Invocation): Outcome | null {
    const invariant = argumentValue("--successor");
    return invariant === null ? null : runSuccessor({ absolute, invariant, target });
};

export const defer = function defer({ absolute, target }: Invocation): Outcome | null {
    const clause = argumentValue("--defer");
    if (clause === null) {
        return null;
    }

    const receiver = argumentValue("--to");
    return receiver === null
        ? { code: 2, message: DEFER_NEEDS_RECEIVER }
        : runDefer({ absolute, clause, receiver, repoRoot: REPO_ROOT, target });
};

export const arrive = function arrive({ absolute, target }: Invocation): Outcome | null {
    return process.argv.includes("--arrive") ? runArrive({ absolute, predecessor: target }) : null;
};
