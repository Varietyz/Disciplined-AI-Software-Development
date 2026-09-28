export const raiseRefused = function raiseRefused(reason: string): string {
    return `REFUSED  ${reason}\n`;
};

export const authorityHeld = function authorityHeld(
    act: string,
    holder: string,
    caller: string,
    succeededFrom: string | null,
): string {
    const succession =
        succeededFrom === null
            ? ""
            : `         The index binds venue management to ${succeededFrom}, which is not active, so it passes to ` +
              "the first active seat in index order.\n";
    return (
        `REFUSED  ${act} is venue management, and ${holder} holds it, not ${caller}. Raising venues, moving ` +
        "questions out of a discussion and writing agenda rows go through one seat, so the schedule has one author. " +
        `Send the request to ${holder}.\n${succession}`
    );
};

export const recordSurfaceMissing = function recordSurfaceMissing(target: string): string {
    return `${target} does not exist, so there is nowhere to add a record`;
};

export const recordExists = function recordExists(agent: string, target: string): string {
    return `CLEAR  ${agent} already has a record on ${target}. Nothing was written.\n`;
};

export const recordTemplateMissing = function recordTemplateMissing(kind: string): string {
    return `the ${kind} template does not exist, so the tool has no field list to build the record from`;
};

export const recordTemplateEmpty = function recordTemplateEmpty(kind: string): string {
    return `the ${kind} template declares no record fields, so the tool has no field list to build the record from`;
};

export const recordAnchorMissing = function recordAnchorMissing(target: string): string {
    return (
        `${target} has no place to add a record (on a venue, the Gate heading; on the board, the last record), so ` +
        "the tool cannot tell where it belongs"
    );
};

export const recordContended = function recordContended(target: string): string {
    return `CONTENDED  ${target} changed between the read and the write, so the record was not added. Run the command again.\n`;
};

export const recordAdded = function recordAdded(agent: string, target: string, fields: readonly string[]): string {
    return (
        `RECORD  A record for ${agent} was added to ${target} with ${String(fields.length)} field(s): ` +
        `${fields.join(", ")}. Each field reads \`—\` until you rewrite it; the fields come from the template.\n`
    );
};

export const SUCCESSOR_NOT_VENUE =
    "a successor is declared on a venue, and this target is not one; the raise reads the declaration from the venue";

export const successorVenueMissing = function successorVenueMissing(target: string): string {
    return `${target} does not exist, so there is no venue to declare a successor for`;
};

export const successorNotPlanned = function successorNotPlanned(invariant: string): string {
    return (
        `${invariant} is not a planned row on the agenda, so the tool will not declare it. A venue for it would take ` +
        "an ordinal the schedule gives to another row. Add the row to the agenda first, then declare the successor"
    );
};

export const successorSectionMissing = function successorSectionMissing(target: string): string {
    return (
        `${target} has no SUCCESSOR section, so the convergence check would not find the declaration there. Restore ` +
        "the section from the venue template"
    );
};

export const successorContended = function successorContended(target: string): string {
    return (
        `CONTENDED  ${target} changed between the read and the write, so the successor was not declared. Run the ` +
        "command again.\n"
    );
};

export const successorDeclared = function successorDeclared(target: string, invariant: string): string {
    return (
        `SUCCESSOR  ${target} now declares that it feeds ${invariant}. The declaration sits outside the template's ` +
        "fenced example, where the convergence check reads it.\n"
    );
};

export const DEFER_NOT_VENUE = "a deferral is a question a venue leaves open, and this target is not a venue";

export const deferVenueMissing = function deferVenueMissing(target: string): string {
    return `${target} does not exist, so there is no venue to defer a question from`;
};

export const deferredSectionMissing = function deferredSectionMissing(target: string, section: string): string {
    return `${target} has no ${section} section. Restore it from the venue template`;
};

export const defersAlready = function defersAlready(target: string, count: number): string {
    return (
        `${target} already defers ${String(count)} question(s), so it cannot also record that it defers nothing. ` +
        "Retract those questions first if none remain open"
    );
};

export const markerContended = function markerContended(target: string): string {
    return `${target} changed between the read and the write, so nothing was written. Run the command again`;
};

export const defersNothing = function defersNothing(target: string): string {
    return (
        `DEFERS NOTHING  ${target} now records that it leaves no question open, as a \`- —\` line in the DEFERRED ` +
        "section, which the convergence check reads as an answer.\n"
    );
};

export const CLAUSE_IS_RECEIVER =
    "the question and its receiver are the same text. Name the seat, venue or planned agenda row that will decide " +
    "the question";

export const receiverUnknown = function receiverUnknown(receiver: string): string {
    return (
        `${receiver} is not a place a question can go. A receiver is an active seat, a venue on disk, or a planned ` +
        "agenda row. A venue keeps every line it receives until it converges, so the tool checks the receiver before " +
        "writing"
    );
};

export const clauseTaken = function clauseTaken(target: string, clause: string): string {
    return (
        `${target} already defers ${clause}. Each question appears once, because the successor venue picks it up ` +
        "by name. Defer a differently named question, or retract the existing one"
    );
};

export const clauseDeferred = function clauseDeferred(clause: string, receiver: string, target: string): string {
    return (
        `DEFERRED  ${clause} → ${receiver} is recorded on ${target}. The receiver picks it up when its venue is ` +
        "raised, or when the arrive command runs.\n"
    );
};

export const RETRACT_NOT_VENUE = "a deferral lives on a venue, and this target is not one";

export const retractVenueMissing = function retractVenueMissing(target: string): string {
    return `${target} does not exist, so there is no question to retract`;
};

export const retractSectionMissing = function retractSectionMissing(target: string, section: string): string {
    return `${target} has no ${section} section, so it defers nothing to retract`;
};

export const retractClauseMissing = function retractClauseMissing(target: string, clause: string): string {
    return `${target} does not defer a question named ${clause}. Retract by the exact name in the DEFERRED section`;
};

export const clauseRetracted = function clauseRetracted(clause: string, target: string): string {
    return (
        `RETRACTED  ${clause} was removed from ${target}. Retract a question only once it has been answered, so the ` +
        "receiver does not look for work that no longer exists.\n"
    );
};

export const ARRIVE_NOT_VENUE =
    "an arrival carries questions from a venue into its successor, so the target has to be the predecessor venue";

export const arrivePredecessorMissing = function arrivePredecessorMissing(predecessor: string): string {
    return `${predecessor} does not exist, so there are no deferred questions and no successor to read`;
};

export const ARRIVE_NO_SUCCESSOR =
    "the predecessor declares no successor (outside the template's fenced example), so the deferred questions " +
    "have nowhere to go. Declare the successor first";

export const arriveSuccessorUnraised = function arriveSuccessorUnraised(name: string): string {
    return `${name} does not exist yet. Raise it first; the raise carries every question deferred at that moment`;
};

export const arriveNoInheritedSection = function arriveNoInheritedSection(name: string): string {
    return `${name} has no inherited section, so the tool cannot tell where arriving questions belong`;
};

export const arrivalHeld = function arrivalHeld(name: string, elsewhere: readonly string[]): string {
    return (
        `HELD  ${String(elsewhere.length)} question(s) stay at their origin because they are addressed to a ` +
        `receiver other than ${name}: ${elsewhere.join(", ")}. Each question goes to the receiver it names, which may ` +
        "be a seat or a later agenda row.\n"
    );
};

export const arrivalSettled = function arrivalSettled(predecessor: string, name: string): string {
    return `SETTLED  Every question ${predecessor} defers to ${name} is already there. Nothing was written.\n`;
};

export const arriveSectionEmpty = function arriveSectionEmpty(name: string): string {
    return (
        `${name} has an inherited section with no questions in it, so the tool has no line to add beside. Re-run ` +
        "the inherit command, which rebuilds the section"
    );
};

export const arrivalContended = function arrivalContended(name: string): string {
    return `CONTENDED  ${name} changed between the read and the write, so nothing was carried. Run the command again.\n`;
};

export const arrived = function arrived(
    count: number,
    predecessor: string,
    name: string,
    clauses: readonly string[],
): string {
    return (
        `ARRIVED  ${String(count)} question(s) were carried from ${predecessor} into ${name}: ` +
        `${clauses.join(", ")}.\n`
    );
};

export const rosterNotVenue = function rosterNotVenue(name: string): string {
    return `${name} is not a venue, so it has no roster`;
};

export const rosterVenueElsewhere = function rosterVenueElsewhere(name: string): string {
    return `${name} is not in the venue folder. Move it there with the relocate command first`;
};

export const rosterLinesMissing = function rosterLinesMissing(name: string): string {
    return `${name} does not have both roster lines (NOT-READ and READ AND AWAITING). Restore them from the venue template`;
};

export const rosterRegression = function rosterRegression(name: string, letters: readonly string[]): string {
    return (
        `the new roster for ${name} would mark ${letters.join(", ")} as unread again, but a seat only moves from ` +
        "unread to read while a venue is open. The READ AND AWAITING line has probably lost a mark; correct it by " +
        "hand, then run the command again"
    );
};

export const rosterUnchanged = function rosterUnchanged(name: string): string {
    return `CLEAR  The roster on ${name} is already up to date. Nothing was written.\n`;
};

export const rosterContended = function rosterContended(name: string): string {
    return `${name} changed between the read and the write, so the roster was not updated. Run the command again`;
};

export const rosterResolved = function rosterResolved(name: string, unread: string, read: string): string {
    return (
        `ROSTER  ${name} now lists ${unread} as unread and ${read} as read. The unread list is the active seats that ` +
        "have not marked the venue; a mark is never removed.\n"
    );
};

export const inheritNotVenue = function inheritNotVenue(name: string): string {
    return `${name} is not a venue, so it has no inherited section`;
};

export const inheritVenueElsewhere = function inheritVenueElsewhere(name: string): string {
    return `${name} is not in the venue folder. Move it there with the relocate command first`;
};

export const inheritSectionMissing = function inheritSectionMissing(name: string): string {
    return `${name} has no inherited section. This command updates that section and does not create one`;
};

export const inheritSectionUnbounded = function inheritSectionUnbounded(name: string): string {
    return (
        `${name} has an inherited section with no PROTOCOL banner after it, so the tool cannot tell where the ` +
        "section ends. Restore the banner from the venue template"
    );
};

export const inheritUnchanged = function inheritUnchanged(name: string): string {
    return `CLEAR  The inherited section of ${name} is already up to date. Nothing was written.\n`;
};

export const inheritContended = function inheritContended(name: string): string {
    return `${name} changed between the read and the write, so the inherited section was not updated. Run the command again`;
};

export const inheritUpdated = function inheritUpdated(name: string, count: number, sources: string): string {
    return (
        `INHERITED  ${name} now carries ${String(count)} question(s) from ${sources}. Only the inherited section ` +
        "changed; every record and position below it is as its author wrote it.\n"
    );
};

export const retireNotPlanning = function retireNotPlanning(name: string): string {
    return `${name} is not a planning surface (a .checklist.md file), and this command retires only planning surfaces`;
};

export const retireMissing = function retireMissing(source: string): string {
    return `${source} does not exist`;
};

export const retireNothingDistributed = function retireNothingDistributed(source: string): string {
    return `${source} does not distribute a venue, so there is nothing to retire`;
};

export const retireVenueOpen = function retireVenueOpen(source: string, venue: string): string {
    return (
        `${source} distributes ${venue}, which is still open. Its rows track whether that venue's outcome gets ` +
        "built, so it is retired only after the venue has moved to the archive"
    );
};

export const retireLineMissing = function retireLineMissing(source: string): string {
    return `${source} has no DISTRIBUTES line to replace`;
};

export const retirePreview = function retirePreview(source: string, venue: string): string {
    return (
        `PREVIEW  ${source} would have its DISTRIBUTES line for ${venue} replaced by a RETIRED statement. Nothing ` +
        "else would change, and nothing was written.\n"
    );
};

export const retireContended = function retireContended(source: string): string {
    return `${source} changed between the read and the write, so nothing was written. Run the command again`;
};

export const retired = function retired(source: string): string {
    return (
        `RETIRED  ${source} no longer distributes a venue, and the file stays where it is. It is edited rather than ` +
        "moved, because archived venues cite it by path and an archived file can no longer be updated.\n"
    );
};

export const relocateNotVenue = function relocateNotVenue(name: string): string {
    return `${name} is not a venue, and this command moves only venues`;
};

export const RELOCATE_ROOT_MISSING =
    "the venue folder does not exist, so there is nowhere to move the venue to. Check the package's root setting";

export const relocateDestinationTaken = function relocateDestinationTaken(name: string): string {
    return `${name} is already in the venue folder, so there is nothing to move`;
};

export const relocateSourceMissing = function relocateSourceMissing(name: string): string {
    return `${name} is in neither the venue folder nor the project root, so there is nothing to move`;
};

export const relocateMismatch = function relocateMismatch(name: string): string {
    return `${name} did not arrive unchanged, so the original was left in place`;
};

export const relocated = function relocated(name: string): string {
    return (
        `RELOCATED  ${name} was moved from the project root into the venue folder, unchanged. The copy was checked ` +
        "before the original was removed.\n"
    );
};

export const RAISE_AGENDA_MISSING =
    "the agenda does not exist, so the tool has no schedule to decide which venue comes next";

export const RAISE_NOTHING_ADMISSIBLE =
    "the agenda has no planned row without a venue, so there is nothing to raise. Add the row to the agenda first";

export const raiseNotAdmissible = function raiseNotAdmissible(named: string, admissible: readonly string[]): string {
    return (
        `${named} cannot be raised now: the agenda does not carry it as planned, or a venue for it already exists. ` +
        `Rows that can be raised: ${admissible.join(", ")}`
    );
};

export const raiseSuccessorUndeclared = function raiseSuccessorUndeclared(undeclared: readonly string[]): string {
    return (
        `${undeclared.join(", ")} declares no successor. Declare it on the open venue before raising, because the ` +
        "raise moves the agenda row out of the planned state and the declaration is refused after that"
    );
};

export const RAISE_TEMPLATE_MISSING = "the venue template does not exist, so there is nothing to build the venue from";

export const raiseOrdinalMissing = function raiseOrdinalMissing(invariant: string): string {
    return (
        `the agenda row for ${invariant} has no ordinal, and the venue's filename takes its number from that cell. ` +
        "Fill in the ordinal, then raise"
    );
};

export const raiseDestinationTaken = function raiseDestinationTaken(name: string): string {
    return `${name} already exists, so the raise would overwrite a venue. Nothing was written`;
};

export const RAISE_BANNER_MISSING =
    "the venue template has no PROTOCOL banner, so the tool cannot tell where the inherited section goes";

export const raiseUnbound = function raiseUnbound(unbound: readonly string[]): string {
    return (
        `${unbound.join(", ")} has no row in the agent index, so a record under that letter would point to no ` +
        'role. Add the row with `--index "<role>"`, then raise'
    );
};

export const RAISE_SPECIMEN_MISSING =
    "the venue template has no fenced example record, so the tool has no shape to build each participant's record from";

export const raised = function raised(
    name: string,
    participants: readonly string[],
    clauses: number,
    sources: string,
): string {
    return (
        `RAISED  ${name} was created from the template at the position the agenda gives it. It seats ` +
        `${participants.join(", ")}, each with an empty record, and carries ${String(clauses)} inherited ` +
        `question(s) from ${sources}. Every seat starts as unread; a seat marks the venue as read once the previous ` +
        "venue has left the active folder. Fill in your record before posting a position.\n"
    );
};

export const NO_VENUE_DEFERRING = "no venue deferring here";

export const inheritedSection = function inheritedSection(banner: string, origin: string, carried: string): string {
    return (
        `${banner} (from venue ${origin}) ═══════════════════\n\n` +
        "**These are questions the predecessor deliberately left open, carried here by name because a clause " +
        "deferred to a venue that does not exist reaches no seat.** Each names its origin and its receiver. " +
        "None is a finding. The findings went to the accumulator under their own class headings, and none of " +
        "them travels.\n\n" +
        `${carried}\n\n`
    );
};

export const unclaimedSection = function unclaimedSection(banner: string, invariant: string, absent: string): string {
    return (
        `${banner} (no venue defers to ${invariant}) ═══════════════════\n\n` +
        "**No venue on disk or in the archive defers a clause to this invariant, so the inherited set is empty by " +
        "derivation rather than unstated.** The schedule sets the position a venue is raised at, and the deferrals " +
        "sent here by name set what it inherits. A venue whose turn comes before any seat defers a question to it " +
        "therefore opens carrying nothing, and a seat reading it can check that state.\n\n" +
        `${absent}\n\n`
    );
};

export const retiredDeclaration = function retiredDeclaration(indent: string, pinning: readonly string[]): string {
    const because =
        pinning.length > 0
            ? ` because ${String(pinning.length)} pathed citation(s) in FROZEN surfaces name it: ${pinning.join(", ")}`
            : " because a planning surface is named by its own venue's distribution section, which freezes when that venue archives";
    return (
        `${indent}RETIRED: this surface distributed a venue ` +
        `that has since converged, and the declaration is removed so no planning surface names a venue outside the ` +
        `active tree. THE FILE STAYS AT THIS PATH PERMANENTLY${because}` +
        `. A PATHED CITATION FROM A FROZEN SURFACE PINS ITS TARGET AGAINST THE TARGET'S OWN DECLARED LIFETIME: no party ` +
        `may edit a frozen file, so the update half of a move is unavailable and a move degrades into a disconnection — ` +
        `and nothing reports it, because the reference walk skips an immutable path as a citation SOURCE, correctly, ` +
        `since a finding on a surface no seat may repair is a report no seat can drain. So retirement is this EDIT and ` +
        `never a move or a deletion: the spent finding clears, the file stays, and every pointer keeps resolving.`
    );
};
