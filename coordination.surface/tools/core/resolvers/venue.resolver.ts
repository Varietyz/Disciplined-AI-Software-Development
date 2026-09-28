import type { ClauseLine, SuccessorView } from "../types/converge.types.ts";
import { DEFERRED_SECTION, clauseLines, declaredSuccessor, deferredClauses } from "../analyzers/converge.analyzer.ts";
import { basename, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { isResolved, slotText, surfacePath } from "../../../config/surface.config.ts";
import { AGENT_INDEX } from "../constants/board.constants.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import { activeSeats } from "../analyzers/board.analyzer.ts";
import { authorityHeld } from "../strings/venue.strings.ts";
import { textIfPresent } from "../readers/venue.reader.ts";

const INHERITED_HEADING = "INHERITED";

const ROW_MARK = "|";

export const boundAuthority = function boundAuthority(repoRoot: string): string | null {
    if (!isResolved("convention", "venue_authority_concern")) {
        return null;
    }

    const concern = slotText("convention", "venue_authority_concern");
    const index = resolve(repoRoot, AGENT_INDEX);
    if (!existsSync(index)) {
        return null;
    }

    const letter = readFileSync(index, "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((trimmed) => trimmed.startsWith(ROW_MARK) && trimmed.includes(concern))
        .map((trimmed) => trimmed.slice(1, trimmed.indexOf(ROW_MARK, 1)).trim())
        .find((cell) => cell.length > 0);
    return letter ?? null;
};

export const seatedLetters = function seatedLetters(repoRoot: string): string[] {
    const board = textIfPresent(resolve(repoRoot, surfacePath("board")));
    const index = textIfPresent(resolve(repoRoot, AGENT_INDEX));
    return [...activeSeats(board, index)].toSorted((left, right) => left.localeCompare(right));
};

export const venueAuthority = function venueAuthority(repoRoot: string): string | null {
    const bound = boundAuthority(repoRoot);
    if (bound === null) {
        return null;
    }

    const seated = seatedLetters(repoRoot);
    if (seated.includes(bound)) {
        return bound;
    }

    return seated[0] ?? bound;
};

export const authorityRefusal = function authorityRefusal(
    repoRoot: string,
    caller: string,
    act: string,
): string | null {
    const holder = venueAuthority(repoRoot);
    if (holder === null || holder === caller) {
        return null;
    }

    const bound = boundAuthority(repoRoot);
    const succeeded = bound !== null && bound !== holder;

    return authorityHeld(act, holder, caller, succeeded ? bound : null);
};

interface StrandedDeferral {
    readonly clause: string;
    readonly receiver: string;
}

export const venueInvariant = function venueInvariant(name: string): string {
    const base = basename(name);
    const stem = base.endsWith(BLOCKING_SUFFIX) ? base.slice(0, base.length - BLOCKING_SUFFIX.length) : base;
    const dot = stem.lastIndexOf(".");
    return dot === -1 ? stem : stem.slice(0, dot);
};

export const addressesSuccessor = function addressesSuccessor(receiver: string, successorName: string): boolean {
    return receiver.length > 0 && successorName.length > 0 && venueInvariant(successorName) === receiver;
};

export const unarrivedDeferrals = function unarrivedDeferrals(
    venue: string,
    successorText: string,
    successorName = "",
): readonly ClauseLine[] {
    return clauseLines(venue, DEFERRED_SECTION)
        .filter((entry) => addressesSuccessor(entry.receiver, successorName))
        .filter((entry) => !successorText.includes(entry.clause));
};

export const unoriginatedInheritance = function unoriginatedInheritance(
    venue: string,
    successorText: string,
): string[] {
    const deferred = clauseLines(venue, DEFERRED_SECTION).map((entry) => entry.clause);
    return clauseLines(successorText, INHERITED_HEADING)
        .map((entry) => entry.clause)
        .filter((clause) => !deferred.some((name) => name.includes(clause) || clause.includes(name)));
};

export const receiverResolves = function receiverResolves(
    receiver: string,
    board: string,
    index: string,
    venueNames: readonly string[],
    planned: readonly string[] = [],
): boolean {
    if (receiver.length === 0) {
        return false;
    }
    if (new Set(activeSeats(board, index)).has(receiver)) {
        return true;
    }
    return venueNames.some((name) => venueInvariant(name) === receiver) || planned.includes(receiver);
};

export const strandedDeferrals = function strandedDeferrals(
    venue: string,
    board: string,
    index: string,
    venueNames: readonly string[],
    planned: readonly string[] = [],
): StrandedDeferral[] {
    return clauseLines(venue, DEFERRED_SECTION)
        .filter(
            (entry) =>
                entry.receiver === entry.clause || !receiverResolves(entry.receiver, board, index, venueNames, planned),
        )
        .map((entry) => ({ clause: entry.clause, receiver: entry.receiver }));
};

const successorOf = function successorOf(target: string): string {
    const stem = target.slice(0, target.length - BLOCKING_SUFFIX.length);
    const dot = stem.lastIndexOf(".");
    const ordinal = dot === -1 ? Number.NaN : Number(stem.slice(dot + 1));
    return Number.isFinite(ordinal) ? `${String(ordinal + 1)}${BLOCKING_SUFFIX}` : "";
};

const successorName = function successorName(target: string, declared: string, siblings: readonly string[]): string {
    const wanted = successorOf(target);
    const matches = (name: string): boolean =>
        declared.length > 0 ? basename(name).startsWith(declared) : name.endsWith(wanted);
    return siblings.find((name) => matches(name) && name !== target) ?? "";
};

export const successorView = function successorView(
    repoRoot: string,
    target: string,
    venue: string,
    siblings: readonly string[],
    planned: readonly string[],
): SuccessorView {
    const declared = declaredSuccessor(venue);
    const successor = successorName(target, declared, siblings);
    const absolute = successor.length === 0 ? "" : resolve(repoRoot, successor);
    const successorText = absolute.length > 0 && existsSync(absolute) ? readFileSync(absolute, "utf8") : "";

    return {
        declared,
        deferred: deferredClauses(venue),
        elsewhere: clauseLines(venue, DEFERRED_SECTION)
            .filter((entry) => successor.length > 0 && !addressesSuccessor(entry.receiver, successor))
            .map((entry) => `${entry.clause} → ${entry.receiver}`),
        scheduled: declared.length > 0 && planned.includes(declared),
        successor,
        successorText,
        unarrived: unarrivedDeferrals(venue, successorText, successor).map((entry) => entry.clause),
    };
};
