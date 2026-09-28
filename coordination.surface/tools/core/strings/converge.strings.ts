export const NEEDS_FIELD_MISSING = "the record has no Needs field, so it does not say whether this seat needs anything";

export const NEEDS_FIELD_EMPTY =
    "the Needs field is empty; write `—` if this seat needs nothing, so an empty field is not mistaken for a decision";

export const NEEDS_NO_RECORD = "the venue has no record for this seat, so there is no Needs field to read";

export const moveFailed = function moveFailed(target: string, error: string): string {
    return (
        `REFUSED  The archive move did not happen, so ${target} is unchanged: ${error}. The move fails when the ` +
        "archived name already exists, and in that case the venue stays where it was.\n"
    );
};

export const moved = function moved(target: string): string {
    return (
        `MOVED  ${target} is now in the archive, whole. The history file keeps the conclusion and the archive keeps ` +
        "the argument that led to it.\n"
    );
};

export const venueMissingForRead = function venueMissingForRead(target: string): string {
    return `REFUSED  ${target} does not exist, so there is no read roster to mark.\n`;
};

export const rosterLinesMissing = function rosterLinesMissing(target: string): string {
    return (
        `REFUSED  ${target} has no read roster (the NOT-READ and READ AND AWAITING lines), so a read cannot be ` +
        "recorded. Restore both lines from the venue template.\n"
    );
};

export const alreadyRead = function alreadyRead(agent: string, target: string): string {
    return `CLEAR  ${agent} is already marked as having read ${target}. Nothing was written.\n`;
};

export const rosterContended = function rosterContended(target: string): string {
    return (
        `CONTENDED  ${target} changed between the read and the write, so the roster was not marked. Read the venue ` +
        "again, then mark it.\n"
    );
};

export const readMarked = function readMarked(agent: string, target: string): string {
    return (
        `READ  ${agent} is marked as having read ${target}. The roster records that the venue was handed to this ` +
        "seat; it cannot show whether the seat understood it.\n"
    );
};

export const venueMissingForSign = function venueMissingForSign(target: string): string {
    return `REFUSED  ${target} does not exist, so there is no sign-off block to write.\n`;
};

export const notConvened = function notConvened(agent: string, target: string): string {
    return (
        `REFUSED  ${agent} has no record on ${target}, so it is not part of this venue and has nothing to sign. A ` +
        "sign-off row belongs to a seat that holds a record in the venue, not to every seat on the board.\n"
    );
};

export const signOffBlockMissing = function signOffBlockMissing(target: string): string {
    return (
        `REFUSED  ${target} has no sign-off block, so there is nowhere to add the row. The convergence check reads ` +
        "signatures from that block only. Restore it from the venue template.\n"
    );
};

export const signOffContended = function signOffContended(target: string): string {
    return `CONTENDED  ${target} changed between the read and the write, so no row was added. Run the command again.\n`;
};

export const signOffRowAdded = function signOffRowAdded(agent: string, target: string): string {
    return (
        `ROW  A sign-off row for ${agent} was added to ${target}, unsigned. Adding the row is not signing: run the ` +
        "sign command again with the text this seat agrees to.\n"
    );
};

export const needOutstanding = function needOutstanding(agent: string, target: string, need: string): string {
    return (
        `REFUSED  ${agent} still states a need on ${target}, and a signature says the outcome is complete. Resolve ` +
        `or withdraw the need, then sign. The need reads: ${need}\n`
    );
};

export const alreadySigned = function alreadySigned(agent: string, target: string): string {
    return `CLEAR  ${agent} has already signed ${target} with that text. Nothing was written.\n`;
};

export const signatureContended = function signatureContended(target: string): string {
    return (
        `CONTENDED  ${target} changed between the read and the write, so the signature was not written. Read the ` +
        "venue again and sign against what it says now.\n"
    );
};

export const convergeHelp = function convergeHelp(command: string): string {
    return [
        `${command} -- --agent <LETTER> --file <venue>`,
        "",
        "  Converges a venue: once every check holds, the venue moves whole into the archive. The history file",
        "  keeps the conclusion and the archive keeps the argument, so the venue is moved, never deleted.",
        "  Each check guards an ordering, such as extracting before archiving, and a check that fails",
        "  refuses the move.",
        "",
        "  --agent <LETTER>   Required. The seat running the command.",
        "  --file <venue>     Required. The venue to converge, by path or by name.",
        "  --rehearse         Report which checks hold, and move nothing.",
        "  --help             This text.",
        "",
    ].join("\n");
};

export const CONVERGE_NEEDS_OPERANDS = "REFUSED  converge needs --agent <LETTER> and --file <venue>.\n";

export const convergeNotVenue = function convergeNotVenue(target: string): string {
    return `REFUSED  ${target} is not a venue, and only a venue converges.\n`;
};

export const convergeAbsent = function convergeAbsent(target: string): string {
    return `ABSENT  ${target} does not exist, so there is nothing to converge.\n`;
};

export const orderingsBlock = function orderingsBlock(blocking: number, total: number, target: string): string {
    return (
        `REFUSED  ${String(blocking)} of ${String(total)} check(s) do not hold, so ${target} stays open. Each ` +
        "failing check is listed above with what it needs.\n"
    );
};

export const archiveRootMissing = function archiveRootMissing(target: string): string {
    return (
        `REFUSED  The archive folder does not exist, so ${target} stays open. A converged venue is moved there ` +
        "whole, and the tool does not delete it instead. Create the folder or correct the archive setting.\n"
    );
};

export const archiveNameTaken = function archiveNameTaken(name: string, target: string): string {
    return (
        `REFUSED  ${name} already exists in the archive, so ${target} stays open rather than overwrite it. The ` +
        "move itself also refuses an occupied name.\n"
    );
};

export const convergePreview = function convergePreview(target: string, agent: string): string {
    return `PREVIEW  Every check holds. ${agent} would move ${target} whole into the archive. Nothing was written.\n`;
};

export const converged = function converged(target: string, agent: string): string {
    return (
        `CONVERGED  ${agent} moved ${target} whole into the archive. Every check held: the durable findings are ` +
        "in the history file, and the successor carries the questions this venue left open.\n"
    );
};

const listed = function listed(items: readonly string[]): string {
    return items.join(", ");
};

export const CHECK_NEEDS = "every seat taking part in this venue states its Needs";

export const CHECK_SIGNATURES = "every seat taking part has signed";

export const CHECK_DURABLE = "every seat taking part names a history heading that exists";

export const CHECK_SUCCESSOR = "every deferred question has a destination: a successor venue or a planned agenda row";

export const CHECK_DIRECTIVES = "every directive this venue received has been discharged";

export const CHECK_ABSORPTION = "the planning surface for this venue has no open item";

export const CHECK_INHERITANCE = "every question the successor inherits was deferred by this venue";

export const NOBODY_TAKING_PART =
    "No seat holds a record on this venue, so there is nothing to check. The check fails rather than passing on " +
    "an empty set; a venue needs at least one seat taking part";

export const needsHold = function needsHold(count: number, outside: readonly string[]): string {
    const plural = outside.length > 1;
    const verb = plural ? "are" : "is";
    const holds = plural ? "hold" : "holds";
    const subject = plural ? "they are" : "it is";
    const aside =
        outside.length === 0
            ? ""
            : ` ${listed(outside)} ${verb} active on the board and ${holds} no record here, so ${subject} not part of this venue.`;
    return `${String(count)} seat(s) taking part each state their Needs.${aside}`;
};

export const needsMissing = function needsMissing(unstated: readonly string[]): string {
    return `No Needs stated by ${listed(unstated)}. Write \`—\` in the Needs field if nothing is needed`;
};

export const SIGNATURES_HOLD = "Every seat taking part has signed";

export const unsigned = function unsigned(outstanding: readonly string[]): string {
    return (
        `Not signed: ${listed(outstanding)}. A seat signs only for itself. The \`—\` the template puts in the ` +
        "sign-off block counts as unsigned; a seat that disagrees says so in its Needs field or in a position"
    );
};

export const durableHold = function durableHold(headings: readonly string[]): string {
    return `Every seat taking part names a history heading, and each exists: ${listed(headings)}`;
};

export const durableUndeclared = function durableUndeclared(letters: readonly string[]): string {
    return (
        `${listed(letters)} ${letters.length > 1 ? "have" : "has"} no Durable value. Write the history heading ` +
        "the findings were extracted to, or `—` if they were filed under another seat's heading"
    );
};

export const durableUnresolved = function durableUnresolved(named: readonly string[]): string {
    return `named but missing from the history file: ${listed(named)}`;
};

export const successorScheduled = function successorScheduled(declared: string): string {
    return (
        `This venue feeds "${declared}", a planned agenda row, so its deferred questions have a destination. ` +
        "The venue file is created when the agenda reaches that row"
    );
};

export const successorArrived = function successorArrived(
    successor: string,
    elsewhere: readonly string[],
    clauses: readonly string[],
): string {
    const carried = clauses.length === 0 ? "none are deferred" : listed(clauses);
    const aside = elsewhere.length === 0 ? "" : ` ${listed(elsewhere)} name another receiver and go there instead.`;
    return `${successor} exists, and every question addressed to it has arrived: ${carried}.${aside}`;
};

export const deferredUndeclared = function deferredUndeclared(heading: string): string {
    return (
        `This venue has no ${heading} section. Add it, and list each open question with its receiver, or write ` +
        "`- —` if none remain open"
    );
};

export const deferredUnanswered = function deferredUnanswered(heading: string): string {
    return (
        `The ${heading} section holds only the template's example line. List each open question with its ` +
        "receiver, or write `- —` if none remain open"
    );
};

export const successorMissing = function successorMissing(inherited: string, declared: string): string {
    return declared.length === 0
        ? `There is no successor venue with an ${inherited} section, and this venue declares no successor. Declare one with --successor`
        : `There is no successor venue with an ${inherited} section, and no file matches the declared successor "${declared}". Raise it, or check the declaration`;
};

export const unarrivedClauses = function unarrivedClauses(clauses: readonly string[]): string {
    return `The successor exists, and these deferred questions are not in it: ${listed(clauses)}. Run --arrive to carry them`;
};

export const DIRECTIVES_HOLD = "The directives section has no live directive";

export const undischarged = function undischarged(directives: readonly string[]): string {
    return (
        `Not discharged: ${listed(directives)}. Once what a directive asked for exists, remove it with ` +
        "--discharge, citing where its content was extracted"
    );
};

export const absorptionUndistributed = function absorptionUndistributed(venue: string, field: string): string {
    return (
        `No planning surface distributes ${venue}, so the work this outcome needs is not listed anywhere. Create ` +
        `one with --distribute and name this venue on its ${field} line, one item per piece of work with its owner`
    );
};

export const absorptionDuplicated = function absorptionDuplicated(declaring: readonly string[]): string {
    return (
        `${String(declaring.length)} planning surfaces distribute this venue: ${listed(declaring)}. Keep one, so ` +
        "there is a single list of the work"
    );
};

export const absorptionNoCloses = function absorptionNoCloses(checklist: string, field: string): string {
    return (
        `${checklist} distributes this venue and has no ${field} row. Add the row for the closing step, so the ` +
        "check can leave it out of the open work"
    );
};

export const absorptionHolds = function absorptionHolds(checklist: string, closes: string): string {
    return `${checklist} has no open item besides its closing row ${closes}, so the outcome is built`;
};

export const absorptionOpen = function absorptionOpen(checklist: string, open: readonly string[]): string {
    return (
        `${checklist} still has open items: ${listed(open)}. The venue is archived once they are done. A ` +
        "finished item is deleted from the checklist rather than ticked, and phase gates are not counted"
    );
};

export const NO_SUCCESSOR = "There is no successor venue, so there is nothing to compare";

export const INHERITANCE_HOLDS = "Every question the successor inherits was deferred by this venue";

export const unoriginated = function unoriginated(clauses: readonly string[]): string {
    return (
        `The successor inherits questions this venue never deferred: ${listed(clauses)}. Defer them here, or ` +
        "remove them from the successor if this venue answered them"
    );
};

export const signed = function signed(agent: string, target: string, stamp: string): string {
    return (
        `SIGNED  ${agent} signed ${target}. The row ends with ${stamp}, which shows the signature came from this ` +
        "command; a row without that mark was written by hand.\n"
    );
};
