export const recordContended = function recordContended(
    target: string,
    agent: string,
    changes: readonly string[],
): string {
    return (
        `CONTENDED  ${target}: the record of ${agent} changed between the read and the write, so the operation was ` +
        `not repeated. Read the changes below, then run the command again against the current record.\n${changes.join(
            "",
        )}`
    );
};

export const barrierHeld = function barrierHeld(parked: number, peers: number): string {
    return (
        `HELD  ${String(parked)} of ${String(peers)} peers are waiting, so you are the only seat able to write. A ` +
        "peer counts as able to write while it is waiting on the board or has touched a coordination surface within " +
        "the configured activity window.\n"
    );
};

export const barrierOpen = function barrierOpen(parked: number, peers: number): string {
    return (
        `OPEN  ${String(parked)} of ${String(peers)} peers are waiting. A peer that is not waiting can write at the ` +
        "same time, so an exclusive write is not held.\n"
    );
};

export const kindEcho = function kindEcho(kind: string, judgement: boolean): string {
    const closure = judgement
        ? "it asks for a reading, so an addressee closes it by acknowledging it, with no reference"
        : "it asks for something that can exist, so it closes with a reference to where that thing landed";
    return (
        `  kind:${kind} — ${closure}. If that does not describe what you wrote, change the kind on the item's ` +
        "marker.\n"
    );
};

export const surfaceAbsent = function surfaceAbsent(target: string): string {
    return `ABSENT  ${target} does not exist.\n`;
};

export const noOwnRecord = function noOwnRecord(agent: string): string {
    return (
        `REFUSED  There is no single record for ${agent} on this surface (one opening marker and one closing ` +
        "marker). Add your record first, or correct a duplicated marker.\n"
    );
};

export const itemFieldMissing = function itemFieldMissing(agent: string, field: string, target: string): string {
    return (
        `REFUSED  The record of ${agent} on ${target} has no ${field} field to add the item to. A board record ` +
        "holds items in its Flags field and a venue record holds positions, so the field comes from the surface's " +
        "own template.\n"
    );
};

export const positionOnBoard = function positionOnBoard(labels: readonly string[]): string {
    return (
        `REFUSED  This item has the structure of a venue position (${labels.join(", ")}), and its target is the ` +
        "board. The board is cleared as items are handled, so an argument written there is lost. Post it to the " +
        "venue instead with `--file <venue>`.\n"
    );
};

export const positionUnsigned = function positionUnsigned(signedLead: string): string {
    return (
        `REFUSED  This position has no ${signedLead} line. A position ends with its author's signature, so a ` +
        "missing signature usually means the body was cut short on the way in, often at a blank line in a " +
        "command-line argument. If the body is complete, sign it; if it was cut, pass it from a file or on " +
        "standard input instead.\n"
    );
};

export const itemAdded = function itemAdded(key: string, target: string): string {
    return `ITEM  ${key} was added to ${target}.\n`;
};

export const fieldUndeclared = function fieldUndeclared(
    agent: string,
    field: string,
    target: string,
    declared: readonly string[],
): string {
    return (
        `REFUSED  The record of ${agent} on ${target} has no ${field} field. This command rewrites a field the ` +
        "record already has and never adds one, because the fields come from the surface's template. Fields in " +
        `this record: ${declared.join(", ")}\n`
    );
};

export const fieldUnchanged = function fieldUnchanged(field: string, target: string): string {
    return `CLEAR  ${field} already says that on ${target}. Nothing was written.\n`;
};

export const fieldRewritten = function fieldRewritten(field: string, agent: string, target: string): string {
    return `FIELD  ${field} in the record of ${agent} on ${target} now holds the new text.\n`;
};

export const nothingToCompress = function nothingToCompress(target: string): string {
    return `ABSENT  ${target} does not exist, so there is nothing to compress.\n`;
};

export const COMPRESS_NEEDS_AGENT =
    "REFUSED  `--compress` needs `--agent <LETTER>`. It deletes every field labeled with the marker, so without an " +
    "agent it would reach into other seats' records.\n";

export const itemFenceMalformed = function itemFenceMalformed(marker: string): string {
    return (
        `REFUSED  Item ${marker} does not have exactly one opening and one closing marker, so the tool cannot tell ` +
        "which lines to remove. Correct the markers by hand.\n"
    );
};

export const surfaceContended = function surfaceContended(target: string): string {
    return `CONTENDED  ${target} changed between the read and the write. Nothing was removed; run the command again.\n`;
};

export const itemDropped = function itemDropped(marker: string, bytes: number, heal: boolean): string {
    return heal
        ? `DROPPED  Item ${marker} was removed (${String(bytes)} bytes).\n`
        : `PREVIEW  Item ${marker} would be removed (${String(bytes)} bytes). Nothing was written.\n`;
};

export const compressionNoRecord = function compressionNoRecord(agent: string): string {
    return (
        `REFUSED  There is no single record for ${agent} on this surface, so compression has no span of yours to ` +
        "work on.\n"
    );
};

export const noMarkedField = function noMarkedField(target: string): string {
    return `CLEAR  No field in ${target} carries that marker. Nothing was written.\n`;
};

export const fieldsCompressed = function fieldsCompressed(
    target: string,
    fields: number,
    bytes: number,
    heal: boolean,
): string {
    return heal
        ? `COMPRESSED  ${String(fields)} field(s) in ${target} were removed (${String(bytes)} bytes).\n`
        : `PREVIEW  ${String(fields)} field(s) in ${target} would be removed (${String(bytes)} bytes). Nothing was written.\n`;
};

export const fieldEmptied = function fieldEmptied(field: string, target: string, bytes: number, heal: boolean): string {
    return heal
        ? `COMPRESSED  ${field} in ${target} now holds \`—\` (${String(bytes)} bytes removed).\n`
        : `PREVIEW  ${field} in ${target} would hold \`—\` (${String(bytes)} bytes removed). Nothing was written.\n`;
};

export const closureSettled = function closureSettled(closes: string, target: string): string {
    return (
        `SETTLED  ${closes} is no longer on ${target}, so there is nothing to close. This call only saw that the ` +
        "item is gone; it cannot say who removed it.\n"
    );
};

export const readersOutstanding = function readersOutstanding(closes: string, held: readonly string[]): string {
    return (
        `REFUSED  ${closes} has a read list, and ${held.join(", ")} has not marked it yet. Closing it now would ` +
        "remove it before every named seat has read it. Mark your own letter with `--mark`; the item is removed " +
        "when its last active reader marks it.\n"
    );
};

export const emptyExtractionCheck = function emptyExtractionCheck(filed: string): string {
    return (
        "CHECK  Closing with no extraction states that none of the filed classes covers this item. Look through " +
        `the headings first, open the one that fits, and confirm its population matches what the item said.\n${filed}`
    );
};

export const dischargeNotVenue = function dischargeNotVenue(target: string): string {
    return (
        `REFUSED  ${target} is not a venue. Directives live in a venue's DIRECTIVES section, so only a venue has ` +
        "one to discharge.\n"
    );
};

export const DISCHARGE_NEEDS_REF =
    "REFUSED  A discharge needs `--ref changelog:<heading>`, naming the history entry the directive was " +
    "extracted to. Without it, removing the directive would lose its only record.\n";

export const dischargeRefUntyped = function dischargeRefUntyped(ref: string): string {
    return (
        `REFUSED  ${ref} is not a reference this command reads. Write it as \`changelog:<heading>\`, where the ` +
        "heading is the history entry the directive was extracted to.\n"
    );
};

export const dischargeRefUnresolved = function dischargeRefUnresolved(ref: string): string {
    return (
        `REFUSED  ${ref} does not resolve: the history file has no such heading. Extract the directive first, then ` +
        "discharge it. The check confirms that the heading exists, not that it says the same thing.\n"
    );
};

export const dischargeSettled = function dischargeSettled(target: string, clause: string): string {
    return `SETTLED  No live directive on ${target} contains "${clause}". Nothing was written.\n`;
};

export const dischargeContended = function dischargeContended(target: string): string {
    return (
        `CONTENDED  ${target} changed between the read and the write, so the directive was not removed. Run the ` +
        "command again.\n"
    );
};

export const discharged = function discharged(clause: string, target: string, ref: string): string {
    return (
        `DISCHARGED  The directive containing "${clause}" was removed from ${target}. Its content is kept at ` +
        `${ref}. A directive is removed once it has been carried out, rather than archived with the venue.\n`
    );
};

export const compressSettled = function compressSettled(marker: string, target: string): string {
    return `SETTLED  ${marker} is no longer on ${target}. Nothing was removed.\n`;
};

export const claimNoRecord = function claimNoRecord(board: string, agent: string): string {
    return (
        `YOUR CLAIM  ${board} has no record for ${agent}, so peers cannot address you or close an item you ` +
        "handled.\n"
    );
};

export const claimFieldAbsent = function claimFieldAbsent(field: string): string {
    return `  ${field}: absent (the board has no ${field} field for this seat)`;
};

export const claimEcho = function claimEcho(board: string, lines: readonly string[]): string {
    return (
        `YOUR CLAIM ON ${board}, shown because you just wrote elsewhere:\n${lines.join("\n")}\n` +
        "  Every seat reads the board each round, so correct any field that describes work you have moved past.\n"
    );
};

export const awaitingMark = function awaitingMark(items: readonly string[]): string {
    return `  Awaiting your mark: ${items.join(", ")}`;
};

export const closableByYou = function closableByYou(items: readonly string[]): string {
    return `  You can close now: ${items.join(", ")}`;
};

export const dischargeEcho = function dischargeEcho(lines: readonly string[]): string {
    return (
        "ITEMS YOU CAN DISCHARGE, from the same check the close command runs:\n" +
        `${lines.join("\n")}\n` +
        "  An item addressed to you waits on your mark or your close; its author cannot remove it.\n"
    );
};

export const venueWritingTo = function venueWritingTo(venue: string): string {
    return `  ${venue} (the surface you are writing to)`;
};

export const venueRosterRow = function venueRosterRow(venue: string, unmarked: boolean): string {
    return `  ${venue} (${unmarked ? "you have not marked it as read" : "you have marked it as read"})`;
};

export const openVenuesEcho = function openVenuesEcho(lines: readonly string[]): string {
    return (
        "OPEN VENUES, listed from the venue folder and each venue's roster:\n" +
        `${lines.join("\n")}\n` +
        "  Arguments go to a venue, not to the board.\n"
    );
};

export const venueNoRecord = function venueNoRecord(target: string, agent: string): string {
    return (
        `YOUR RECORD ON ${target}  There is no record for ${agent}, so this venue has no Needs, Durable or ` +
        "signature from you, and it cannot converge without them.\n"
    );
};

export const venueFieldAbsent = function venueFieldAbsent(field: string): string {
    return `  ${field}: absent (the record has no ${field} field)`;
};

export const venueFieldEmpty = function venueFieldEmpty(field: string): string {
    return `  ${field}: empty (write \`—\` if there is nothing to state)`;
};

export const venueRecordEcho = function venueRecordEcho(target: string, lines: readonly string[]): string {
    return (
        `YOUR RECORD ON ${target}, shown because these fields decide when the venue can close:\n${lines.join("\n")}\n` +
        "  Convergence reads them for every active seat, so correct any that describe work you have moved past.\n"
    );
};

export const venueTemplateUnreadable = function venueTemplateUnreadable(template: string): string {
    return `  The venue record fields cannot be listed: ${template} does not exist.\n\n`;
};

export const venueTemplateFieldless = function venueTemplateFieldless(template: string): string {
    return `  The venue template at ${template} declares no record fields, so a venue raised from it accepts no item.\n\n`;
};

export const venueFieldList = function venueFieldList(template: string, fields: readonly string[]): string {
    return `  Venue record fields, read from ${template}: ${fields.join(", ")}\n\n`;
};

export const fixedTarget = function fixedTarget(form: string, surface: string): string {
    return (
        `REFUSED  ${form} always writes ${surface}, so \`--file\` does not apply to it. Remove \`--file\`, or use a ` +
        "command that writes the surface you named.\n"
    );
};

export const forgedBoundary = function forgedBoundary(flag: string, count: number, named: string): string {
    return (
        `REFUSED  ${flag} contains ${String(count)} line(s) that start a record or item marker: ${named}. A body ` +
        "cannot contain a marker, because the markers decide which lines belong to which record. To mention a " +
        "marker, write it inside a sentence.\n"
    );
};

export const stdinEmpty = function stdinEmpty(flag: string, operand: string): string {
    return `REFUSED  \`${flag} ${operand}\` reads the body from standard input, and nothing arrived there.\n`;
};

export const bodyInline = function bodyInline(
    inlineFlag: string,
    fileFlag: string,
    operand: string,
    tokens: number,
): string {
    return (
        `REFUSED  A body is not accepted as an argument. Pass \`${inlineFlag} ${operand}\` and pipe the text in, or ` +
        `pass \`${fileFlag} <path>\`. The shell changes an argument before the tool sees it: a quote ends it, and ` +
        "backticks and `$` are substituted, so the text would be recorded with parts missing. Field values can still " +
        `be passed inline. Tokens received after ${inlineFlag}: ${String(tokens)}\n`
    );
};

export const bodyFileMissing = function bodyFileMissing(fileFlag: string, path: string): string {
    return `REFUSED  ${fileFlag} names ${path}, which does not exist.\n`;
};

export const argumentsUnknown = function argumentsUnknown(
    unknown: readonly string[],
    known: readonly string[],
): string {
    return (
        `REFUSED  ${unknown.join(", ")} ${unknown.length > 1 ? "are not arguments" : "is not an argument"} this ` +
        `tool reads, so nothing was run. The arguments it reads: ${known.join(" ")}\n`
    );
};

export const exclusiveCombined = function exclusiveCombined(exclusive: readonly string[], others: string): string {
    return (
        `REFUSED  ${exclusive.join(" and ")} cannot be combined with ${others} in one call, because the tool would ` +
        "run the first and drop the rest. Nothing was written; run them as separate commands.\n"
    );
};

export const ANOTHER_EXCLUSIVE = "another command that runs on its own";

export const REHEARSED =
    "REHEARSED  Every argument of every requested command was checked, and nothing was written. A command's own " +
    "refusals run only when it acts, so this check does not show them.\n";

export const AGENDA_NEEDS_ESTABLISHES =
    "REFUSED  `--agenda` needs `--establishes` or `--establishes-file`, saying what the venue must establish. The " +
    "row's state is not an argument; the tool derives it from the venue folders on every run.\n";

export const APPEND_NEEDS_LEAD =
    "REFUSED  `--append` needs `--lead`, naming which clause of the entry to extend, and `--body` or `--body-file` " +
    "with the text to add.\n";

export const EXTRACT_NEEDS_BODY =
    "REFUSED  `--extract` needs `--body` or `--body-file` with the entry text. A heading without a body gives a " +
    "closure a reference that points to nothing.\n";

export const FIXTURE_NEEDS_BODY =
    "REFUSED  `--fixture` needs `--body` or `--body-file` with two samples: one that fires the rule, with its path " +
    "and text, and one the rule accepts. The tool places the entry; the samples come from you.\n";

export const MEMBER_NEEDS_BODY =
    "REFUSED  `--member` needs `--body` or `--body-file` with the member text. A heading without a body gives a " +
    "citation a target that states nothing.\n";

export const DEFER_NEEDS_RECEIVER =
    "REFUSED  `--defer` needs `--to`, naming who receives the question: a venue, an active seat or a planned " +
    "agenda row.\n";

export const kindRequired = function kindRequired(kinds: readonly string[]): string {
    return (
        `--kind must be one of ${kinds.join(" or ")}. The kind decides how the item closes: an artifact item closes ` +
        "with a reference to what was made, and a judgement item closes when an addressee acknowledges it"
    );
};

export const FIELD_NEEDS_VALUE =
    "--field needs --value with the new text. To state that a field has nothing, write `—` rather than leaving it " +
    "empty";

export const operandsMissing = function operandsMissing(refusals: readonly string[]): string {
    return (
        `REFUSED  ${refusals.join("\nREFUSED  ")}\n` +
        "Every argument is checked before anything is written, so nothing was written.\n"
    );
};

export const twinAdmitted = function twinAdmitted(closes: string, twin: string): string {
    return `ADMITTED  ${closes} is an exact copy of ${twin} in the same record, so removing it loses nothing.\n`;
};

export const venueNoRemoval = function venueNoRemoval(target: string): string {
    return (
        `REFUSED  Nothing is removed from ${target} while it is open. A venue keeps every position until it ` +
        "converges, then moves whole to the archive.\n"
    );
};

export const venueNoSweep = function venueNoSweep(target: string): string {
    return `HELD  ${target} is a venue, so it is not swept. Its positions stay until the venue converges.\n`;
};

export const POST_LANDED =
    "HELD  The item was posted, and the removal in the same call was refused. The refusal is shown above.\n";

export const watchAbsent = function watchAbsent(target: string): string {
    return `ABSENT  ${target} does not exist, so there is nothing to wait on.\n`;
};

export const watchRemoved = function watchRemoved(target: string): string {
    return `REMOVED  ${target} was deleted during the wait.\n`;
};

export const watchChanged = function watchChanged(target: string, seconds: number): string {
    return `CHANGED  ${target} was updated after ${String(seconds)}s.\n`;
};

export const firstSnapshot = function firstSnapshot(agent: string): string {
    return `SNAPSHOT  First read for ${agent}. The next call reports everything that changed since.\n`;
};

export const surfaceUnchanged = function surfaceUnchanged(target: string, agent: string): string {
    return `UNCHANGED  Nothing on ${target} changed since ${agent} last looked.\n`;
};

export const changedSince = function changedSince(agent: string, count: number): string {
    return `SINCE ${agent} LAST LOOKED  ${String(count)} changed line(s)\n`;
};

export const degradedHead = function degradedHead(agent: string, count: number, size: number, target: string): string {
    return (
        `SINCE ${agent} LAST LOOKED  ${String(count)} changed line(s), ${String(size)} characters, which is more ` +
        `than one read holds. Each changed item is listed by its marker below; read ${target} for the full text.\n`
    );
};

export const degradedInsideRecords = function degradedInsideRecords(target: string): string {
    return `  No item opened or closed; the changes are inside existing records. Read ${target} directly.\n`;
};

export const waitSolitary = function waitSolitary(able: number, waiting: number): string {
    return (
        "BLOCKED  No other seat is able to write, so a wait would never end. Carry on with your own work. " +
        `${String(able)} able to write, ${String(waiting)} waiting.\n`
    );
};

export const waitAllParked = function waitAllParked(able: number, waiting: number): string {
    return (
        "BLOCKED  Every other active seat is waiting for an update, so a wait now would leave every seat waiting." +
        "Read what changed and post your response before you wait. " +
        `${String(waiting)} of ${String(able)} able to write are waiting.\n`
    );
};

export const watching = function watching(target: string, seconds: number, waiting: number, able: number): string {
    return (
        `WATCHING  ${target} for up to ${String(seconds)}s (${String(waiting)} of ${String(able)} able to write ` +
        "are waiting).\n"
    );
};

export const watchQuiet = function watchQuiet(target: string): string {
    return `QUIET  No other seat wrote to ${target} before the wait ended.\n`;
};
