import { positionsOutsideRecords, venueSchemaGaps } from "../validators/venue.validator.ts";
import { unreadAuthors, unreadWhilePositionsStand } from "../validators/blocking.validator.ts";
import type { Finding } from "../types/segment.types.ts";
import { RESOLUTION_HEADING } from "../constants/blocking.constants.ts";
import type { VenueScope } from "../types/blocking.types.ts";
import { agendaInvariants } from "../readers/agenda.reader.ts";
import { blockingFinding } from "../factories/blocking.factory.ts";
import { declaredSuccessor } from "../analyzers/converge.analyzer.ts";
import { hasReadMark } from "../resolvers/converge.resolver.ts";
import { strandedDeferrals } from "../resolvers/venue.resolver.ts";
import { ungatedRows } from "../analyzers/blocking.analyzer.ts";

const discussionFinding = function discussionFinding(path: string, source: string): Finding {
    const opened = hasReadMark(source);
    return blockingFinding(
        "unresolvedDiscussion",
        path,
        opened
            ? `${path} is on disk and its roster carries a read mark, so its discussion is OPEN`
            : `${path} is on disk and its roster carries no read mark, so it is CREATED and not opened — a successor raised before its predecessor archives, which the successor edge REQUIRES to exist by then`,
        "the file deleted once every agent has added their share and the outcome is merged",
        opened
            ? "this discussion blocks every other item deliberately: it is prioritized, it needs considered input from each active agent, and the work downstream of it is shaped by its outcome. Add your share, converge, merge the result into the checklist, then delete the file — the gate clears itself and nothing else is needed"
            : "this venue holds the build because it EXISTS rather than because anything is being argued in it, and both readings fail because the presence rule reads presence. Nothing is owed here until its predecessor leaves the active tree: a seat marks its letter then, and the finding becomes the open one above. Creating it early is REQUIRED rather than premature — the successor edge refuses a predecessor whose successor does not exist — so this finding is the cost of that ordering rather than a defect anybody introduced",
    );
};

const rosterFindings = function rosterFindings(path: string, source: string): Finding[] {
    const unopened = unreadWhilePositionsStand(source);
    const early =
        unopened.length === 0
            ? []
            : [
                  blockingFinding(
                      "positionsBeforeRoster",
                      path,
                      `positions stand here while the roster marks ${unopened.join(", ")} unread`,
                      "every seat marked read before the first position lands",
                      "a venue states at its head that a seat marks its letter read and only THEN does the discussion open, so positions accumulating while any seat is unread are an argument running past the venue's own opening condition. The seats still unread inherit a discussion they had no part in and must either read it whole or write against a position set that already converged around them, and neither is the participation the roster exists to guarantee. The condition was stated to a READER at the top of the file and observed by nothing, which is how a two-seat argument reaches twenty positions with every check green. Mark read and take part, or hold the argument until the roster is complete — and where a venue is deliberately held, the hold is a fact about the venue rather than an instruction living outside the tree, since an instruction no surface carries reaches nobody who was not told",
                      unopened.join(", "),
                  ),
              ];

    return [
        ...unreadAuthors(source).map((author) =>
            blockingFinding(
                "rosterContradiction",
                path,
                `${author} holds a position here and the roster marks ${author} unread`,
                `${author} marked read, or ${author}'s positions absent`,
                "a venue cannot both carry an agent's positions and record that agent as not having read it. The most likely cause is a whole-file write that replaced the roster without replacing the records, or the records without the roster — which destroys another author's work and reports success. Restore what the write dropped, then add positions by editing rather than by rewriting the venue",
            ),
        ),
        ...early,
    ];
};

const recordFindings = function recordFindings(path: string, source: string, template: string): Finding[] {
    return [
        ...ungatedRows(source).map((row) =>
            blockingFinding(
                "ungatedDecision",
                path,
                `${row.id} carries an empty gate cell at line ${String(row.line)}`,
                `${row.id} naming the gate that enforces it, or an em dash stating none is owed`,
                "the exit condition every venue declares is that a decision binding an artifact names its gate or is proven ungatable in writing, so a decision with neither does not close its question. An EMPTY cell is the failure and an em dash is a real answer — it states that this decision binds no artifact, which is a claim a reader can check. Leaving it blank reads as an oversight or as a decision nobody has assessed, and the two are indistinguishable from outside",
            ),
        ),
        ...venueSchemaGaps(source, template).map((gap) =>
            blockingFinding(
                "venueSchemaDrift",
                path,
                gap.state === "absent"
                    ? `${gap.record} declares no ${gap.field}, which the venue template requires`
                    : `${gap.record} carries ${gap.field} which the venue template does not declare`,
                `the field set the venue template declares: ${gap.declared.join(", ")}`,
                "a venue's fields are its OWN and the board's do not transfer: a board answers who owns what and what is directed at whom, a venue answers where each seat stands and what it still needs before it can sign. The field set is DERIVED from the venue template on every run so this check cannot drift from it, and a venue carrying an ownership field is describing ownership in a document about a decision — which is what happens when a seat conforms the discussion to whatever the tool happened to require. AND A DECLARED FIELD LEFT OUT IS THE OPPOSITE DEFECT WITH THE SAME CAUSE: convergence is DERIVED from every active seat's remaining need, so a record omitting that field is not a seat with nothing outstanding — it is a seat whose position on the exit condition cannot be read at all, and a missing field and a satisfied one are the same silence to anyone counting",
                `${gap.record} · ${gap.field}`,
            ),
        ),
        ...positionsOutsideRecords(source).map((stray) =>
            blockingFinding(
                "handPlacedPosition",
                path,
                `position ${stray.key} sits outside every seat's record`,
                "the position posted through the tool so it lands inside its author's own fenced record",
                "a position outside every record has no fence, no id, no addressing and no compare-and-swap, so it is attributable to nobody and removable by nothing — and a venue full of them is a document where every seat writes anywhere. Post it with the tool naming this surface; if the tool refuses because a record is missing, raise the record from the venue template rather than writing the position by hand. The locus is the position's own CLAIM KEY rather than a line number, because a venue accumulates while the argument runs: a positional address is correct at emission and decays with the next write, so a later reader resolves it to whatever now sits there and gets a confident wrong answer instead of an error",
                stray.key,
            ),
        ),
    ];
};

const successorFindings = function successorFindings(path: string, source: string, agenda: string): Finding[] {
    const declared = declaredSuccessor(source);
    if (declared.length === 0 || agenda.includes(declared)) {
        return [];
    }
    return [
        blockingFinding(
            "unrecordedSuccessor",
            path,
            `${path} declares the successor ${declared} and the agenda records no such invariant`,
            "every declared successor appearing in the agenda, as its own planned row or merged into one",
            "A SUCCESSOR IS DECLARED BY NAME RATHER THAN DERIVED FROM AN ORDINAL, deliberately, because the real edges are partial with forward dependencies — and the other half of that decision is that a declaration DEPARTING from the planned set displaces a subject. Every step is correct and the composition drops a question: the declaration is right, the raise is right, and the planned invariant it stepped past has no venue, no receiver and no live surface saying it is owed. Both operands are files and the comparison needs no judgement, so the only thing that has ever caught a departure is a seat noticing — which is the mechanism the agenda exists to replace. Record it there: a row of its own where the two subjects are separate, or MERGED into the planned row where a raised invariant and a planned one meet on the same operand, which consumes the insertion instead of letting it consume a position. The planned invariant keeps its place either way, because an ordinal in a filename is raise order and an agenda position is a row in the table",
            declared,
        ),
    ];
};

const exitFindings = function exitFindings(path: string, source: string): Finding[] {
    if (source.includes(RESOLUTION_HEADING)) {
        return [];
    }
    return [
        blockingFinding(
            "noExitCondition",
            path,
            `${path} declares no exit condition`,
            `a ${RESOLUTION_HEADING} section stating what makes the file deletable`,
            "a blocker with no stated exit is an indefinite halt rather than a prioritized discussion; whoever raises one states the condition under which it is satisfied, so nobody has to guess whether it is finished",
        ),
    ];
};

const routingFindings = function routingFindings(path: string, source: string, scope: VenueScope): Finding[] {
    const stranded = strandedDeferrals(
        source,
        scope.boardText,
        scope.indexText,
        scope.open,
        agendaInvariants(scope.agenda),
    );
    return [
        ...stranded.map((deferral) =>
            blockingFinding(
                "strandedDeferral",
                path,
                deferral.receiver.length === 0
                    ? `the deferred clause ${deferral.clause} names no receiver`
                    : `the deferred clause ${deferral.clause} names ${deferral.receiver}, which resolves to no active seat and no venue`,
                "each deferred clause naming a receiver that resolves to an active seat or to a venue on disk",
                "a deferral is written when it is deferred BECAUSE the successor edge joins on it, and that edge takes the clause NAME and tests its arrival — it never touches the receiver. So a clause routed to a party that does not exist arrives in the successor by name, passes every existing check, and is inherited by nobody: the question is carried forward correctly and answered by no one, which is the state that reads exactly like a question in progress. The receiver resolves against the ACTIVE seats the board declares and the venues on disk, both derived rather than declared, so a seat going inactive re-points this on the next run with nothing to edit. A clause deliberately left for whoever later claims a scope names the venue that will hold it rather than an absent letter, because a note for a successor is legitimate and a route to nobody is not",
                deferral.clause,
            ),
        ),
        ...successorFindings(path, source, scope.agenda),
        ...exitFindings(path, source),
    ];
};

export const venueFindings = function venueFindings(path: string, source: string, scope: VenueScope): Finding[] {
    return [
        discussionFinding(path, source),
        ...rosterFindings(path, source),
        ...recordFindings(path, source, scope.template),
        ...routingFindings(path, source, scope),
    ];
};
