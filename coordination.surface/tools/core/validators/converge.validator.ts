import {
    CHECK_DIRECTIVES,
    CHECK_DURABLE,
    CHECK_INHERITANCE,
    CHECK_NEEDS,
    CHECK_SIGNATURES,
    CHECK_SUCCESSOR,
    DIRECTIVES_HOLD,
    INHERITANCE_HOLDS,
    NOBODY_TAKING_PART,
    NO_SUCCESSOR,
    SIGNATURES_HOLD,
    deferredUnanswered,
    deferredUndeclared,
    durableHold,
    durableUndeclared,
    durableUnresolved,
    needsHold,
    needsMissing,
    successorArrived,
    successorMissing,
    successorScheduled,
    unarrivedClauses,
    undischarged,
    unoriginated as unoriginatedMessage,
    unsigned,
} from "../strings/converge.strings.ts";
import {
    DEFERRED_SECTION,
    SIGN_OFF_ABSENT,
    clauseLines,
    declaredHeading,
    headingIsWhole,
} from "../analyzers/converge.analyzer.ts";
import type { Edge, SuccessorView } from "../types/converge.types.ts";
import { signOffLines, venueRecords } from "../readers/venue.reader.ts";
import { successorView, unoriginatedInheritance } from "../resolvers/venue.resolver.ts";
import { absorptionEdge } from "../resolvers/converge.resolver.ts";
import { activeSeats } from "../analyzers/board.analyzer.ts";

const NEEDS_FIELD = "Needs";

const DURABLE_FIELD = "Durable";

const INHERITED_HEADING = "INHERITED";

const DIRECTIVES_HEADING = "DIRECTIVES";

export const CONVERGENCE_STEPS = [
    "needs",
    "signatures",
    "durable",
    "directives",
    "absorption",
    "inheritance",
    "successor",
] as const;

export const ARCHIVE_STEP = "archive";

export const DESTRUCTIVE_STEPS: readonly string[] = [...CONVERGENCE_STEPS, ARCHIVE_STEP];

type Records = ReadonlyMap<string, ReadonlyMap<string, string>>;

const fieldOf = function fieldOf(records: Records, letter: string, field: string): string {
    return (records.get(letter)?.get(field) ?? "").trim();
};

const needsEdge = function needsEdge(letters: readonly string[], uncovened: readonly string[], records: Records): Edge {
    const unstated = letters.filter((letter) => fieldOf(records, letter, NEEDS_FIELD).length === 0);
    const vacuous = letters.length === 0;
    const holds = !vacuous && unstated.length === 0;
    const failing = vacuous ? NOBODY_TAKING_PART : needsMissing(unstated);
    return { detail: holds ? needsHold(letters.length, uncovened) : failing, edge: CHECK_NEEDS, holds, step: "needs" };
};

const signaturesEdge = function signaturesEdge(letters: readonly string[], venue: string): Edge {
    const signatures = signOffLines(venue);
    const outstanding = letters.filter((letter) => {
        const signed = (signatures.get(letter) ?? "").trim();
        return signed.length === 0 || signed === SIGN_OFF_ABSENT;
    });
    const vacuous = letters.length === 0;
    const holds = !vacuous && outstanding.length === 0;
    const failing = vacuous ? NOBODY_TAKING_PART : unsigned(outstanding);
    return { detail: holds ? SIGNATURES_HOLD : failing, edge: CHECK_SIGNATURES, holds, step: "signatures" };
};

const durableDeclared = function durableDeclared(records: Records, letter: string): boolean {
    return records.get(letter)?.has(DURABLE_FIELD) === true && fieldOf(records, letter, DURABLE_FIELD).length > 0;
};

const durableFailure = function durableFailure(undeclared: readonly string[], unresolved: readonly string[]): string {
    return [
        undeclared.length === 0 ? "" : durableUndeclared(undeclared),
        unresolved.length === 0 ? "" : durableUnresolved(unresolved),
    ]
        .filter((part) => part.length > 0)
        .join("; ");
};

const durableEdge = function durableEdge(letters: readonly string[], records: Records, archive: string): Edge {
    const undeclared = letters.filter((letter) => !durableDeclared(records, letter));
    const stated = letters.filter((letter) => durableDeclared(records, letter));
    const headingOf = (letter: string): string => declaredHeading(fieldOf(records, letter, DURABLE_FIELD));

    const headings = stated.map((letter) =>
        headingOf(letter) === SIGN_OFF_ABSENT ? `${letter} → none` : headingOf(letter),
    );
    const unresolved = stated
        .filter((letter) => headingOf(letter) !== SIGN_OFF_ABSENT)
        .filter((letter) => !headingIsWhole(headingOf(letter)) || !archive.includes(headingOf(letter)))
        .map((letter) => `${letter} → ${headingOf(letter)}`);

    const vacuous = letters.length === 0;
    const holds = !vacuous && undeclared.length === 0 && unresolved.length === 0;
    const failing = vacuous ? NOBODY_TAKING_PART : durableFailure(undeclared, unresolved);
    return { detail: holds ? durableHold(headings) : failing, edge: CHECK_DURABLE, holds, step: "durable" };
};

const inheritsIntoSuccessor = function inheritsIntoSuccessor(view: SuccessorView): boolean {
    return view.successor.length > 0 && view.successorText.includes(INHERITED_HEADING) && view.unarrived.length === 0;
};

const successorHolds = function successorHolds(view: SuccessorView): boolean {
    return view.deferred.declared && view.deferred.answered && (view.scheduled || inheritsIntoSuccessor(view));
};

const successorDetail = function successorDetail(view: SuccessorView, holds: boolean): string {
    if (holds && view.scheduled && view.successor.length === 0) {
        return successorScheduled(view.declared);
    }
    if (holds) {
        return successorArrived(view.successor, view.elsewhere, view.deferred.clauses);
    }
    if (!view.deferred.declared) {
        return deferredUndeclared(DEFERRED_SECTION);
    }
    if (!view.deferred.answered) {
        return deferredUnanswered(DEFERRED_SECTION);
    }
    const inherited = view.successor.length > 0 && view.successorText.includes(INHERITED_HEADING);
    return inherited ? unarrivedClauses(view.unarrived) : successorMissing(INHERITED_HEADING, view.declared);
};

const successorEdge = function successorEdge(view: SuccessorView): Edge {
    const holds = successorHolds(view);
    return { detail: successorDetail(view, holds), edge: CHECK_SUCCESSOR, holds, step: "successor" };
};

const directivesEdge = function directivesEdge(venue: string): Edge {
    const live = clauseLines(venue, DIRECTIVES_HEADING).map((entry) => entry.clause);
    const holds = live.length === 0;
    return { detail: holds ? DIRECTIVES_HOLD : undischarged(live), edge: CHECK_DIRECTIVES, holds, step: "directives" };
};

const inheritanceDetail = function inheritanceDetail(successor: string, unoriginated: readonly string[]): string {
    if (successor.length === 0) {
        return NO_SUCCESSOR;
    }
    return unoriginated.length === 0 ? INHERITANCE_HOLDS : unoriginatedMessage(unoriginated);
};

const inheritanceEdge = function inheritanceEdge(view: SuccessorView, venue: string): Edge {
    const unoriginated = unoriginatedInheritance(venue, view.successorText);
    return {
        detail: inheritanceDetail(view.successor, unoriginated),
        edge: CHECK_INHERITANCE,
        holds: view.successor.length === 0 || unoriginated.length === 0,
        step: "inheritance",
    };
};

export const convergenceEdges = function convergenceEdges(
    repoRoot: string,
    target: string,
    venue: string,
    board: string,
    index: string,
    archive: string,
    siblings: readonly string[],
    plannedInvariants: readonly string[] = [],
): Edge[] {
    const records = venueRecords(venue);
    const convened = activeSeats(board, index);
    const letters = convened.filter((letter) => records.has(letter));
    const uncovened = convened.filter((letter) => !records.has(letter));
    const view = successorView(repoRoot, target, venue, siblings, plannedInvariants);

    return [
        needsEdge(letters, uncovened, records),
        signaturesEdge(letters, venue),
        durableEdge(letters, records, archive),
        successorEdge(view),
        directivesEdge(venue),
        absorptionEdge(repoRoot, target),
        inheritanceEdge(view, venue),
    ];
};
