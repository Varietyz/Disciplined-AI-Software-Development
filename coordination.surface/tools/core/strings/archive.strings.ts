export const handledBy = function handledBy(agent: string): string {
    return `handled by ${agent}`;
};

export const classesFiled = function classesFiled(classes: readonly string[], records: number): string {
    return (
        `\nCLASSES ALREADY FILED  ${classes.join("; ")}.\n` +
        `The history file also holds ${String(records)} record heading(s) of single drained items, which are not ` +
        "listed. Check the classes above before filing a new one: whether two headings name the same class is your " +
        "call, and the tool refuses nothing on that ground.\n"
    );
};

export const historyMissing = function historyMissing(archive: string): string {
    return (
        `REFUSED  ${archive} does not exist. The history file is not created by this command, because removals ` +
        "elsewhere must cite an entry that already exists in it. Restore the file from its template first.\n"
    );
};

export const entryExists = function entryExists(heading: string, archive: string): string {
    return (
        `REFUSED  ${heading} already exists in ${archive}. This command adds new entries and never edits one, ` +
        "because an entry belongs to its author. Extend the existing entry, or file under a heading that names a " +
        "different class.\n"
    );
};

export const leadsMissing = function leadsMissing(missing: readonly string[]): string {
    return (
        `REFUSED  The body has no ${missing.join(" and no ")} line. Each of those leads has to start its own line, ` +
        "because the tools that extend an entry find a lead by line. A lead in the middle of a paragraph usually " +
        "means the body was cut or joined on the way in; pass it whole from a file or on standard input.\n"
    );
};

export const historyContended = function historyContended(archive: string): string {
    return (
        `CONTENDED  ${archive} changed between the read and the write, so nothing was written. Run the command ` +
        "again; the tool checks the heading against the current file.\n"
    );
};

export const entryAdded = function entryAdded(heading: string, archive: string): string {
    return (
        `ENTRY  ${heading} was added to ${archive}. A closure elsewhere can now cite it as ` +
        `\`changelog:${heading}\`.\n`
    );
};

export const repairMissingHistory = function repairMissingHistory(archive: string): string {
    return `REFUSED  ${archive} does not exist, so there is no entry to repair.\n`;
};

export const entryNotFound = function entryNotFound(heading: string, archive: string): string {
    return `REFUSED  There is no entry ${heading} in ${archive}.\n`;
};

export const leadsInPlace = function leadsInPlace(heading: string): string {
    return (
        `CLEAR  Every lead in ${heading} already starts its own line. Nothing was written; this command only moves ` +
        "leads onto their own lines and never changes wording.\n"
    );
};

export const repairContended = function repairContended(archive: string): string {
    return `CONTENDED  ${archive} changed between the read and the write, so the repair was not applied.\n`;
};

export const leadsRepaired = function leadsRepaired(leads: readonly string[], heading: string): string {
    return (
        `REPAIRED  ${leads.join(" and ")} in ${heading} now start their own lines. No words were changed; the ` +
        "tools that extend an entry can now find these leads.\n"
    );
};

export const extendMissingHistory = function extendMissingHistory(archive: string): string {
    return `REFUSED  ${archive} does not exist, so there is no entry to extend.\n`;
};

export const leadUndeclared = function leadUndeclared(lead: string, leads: readonly string[]): string {
    return `REFUSED  ${lead} is not a lead this command extends. Leads: ${leads.join(", ")}\n`;
};

export const extendNotFound = function extendNotFound(heading: string, archive: string): string {
    return (
        `REFUSED  There is no entry ${heading} in ${archive}. This command extends an existing entry; file a new ` +
        "one with the entry command.\n"
    );
};

export const clauseMissing = function clauseMissing(heading: string, lead: string): string {
    return `REFUSED  ${heading} has no ${lead} line to extend.\n`;
};

export const extendContended = function extendContended(archive: string): string {
    return `CONTENDED  ${archive} changed between the read and the write, so the clause was not extended.\n`;
};

export const CLOSES_NEEDS_AGENT = "REFUSED  --closes needs --agent <LETTER>.\n";

export const judgmentWithRef = function judgmentWithRef(closes: string): string {
    return (
        `REFUSED  ${closes} is a judgment item, which is closed by acknowledging it, with no reference. Run the ` +
        "command again without --ref.\n"
    );
};

export const artifactNeedsRef = function artifactNeedsRef(closes: string, empty: string): string {
    return (
        `REFUSED  ${closes} is an artifact item, so closing it needs --ref, naming the history entry its content ` +
        `was extracted to (\`changelog:<heading>\`). If the item carries nothing worth keeping, pass --ref ${empty}; ` +
        "the closure line records that, so a peer can dispute it. If the item only asks for a reading, its marker " +
        "should say kind:judgment.\n"
    );
};

export const refKindWrong = function refKindWrong(
    closes: string,
    kind: string,
    extraction: string,
    empty: string,
): string {
    return (
        `REFUSED  ${closes} cites a ${kind} reference, and a closure cites only the history entry the item's ` +
        `content was extracted to. Cite ${extraction}:<heading>, or ${empty} if the item carries nothing worth ` +
        "keeping.\n"
    );
};

export const fenceMalformed = function fenceMalformed(closes: string): string {
    return `REFUSED  ${closes} does not have exactly one opening and one closing marker.\n`;
};

export const notReader = function notReader(text: string): string {
    return `${text}.\n`;
};

export const compressNeedsExtracted = function compressNeedsExtracted(changelog: string): string {
    return (
        "REFUSED  --compress needs --extracted <heading>. The board keeps no history, so extract the item to " +
        `${changelog} first, then name the heading it landed under. Rehearse with --no-fix to see what would go.\n`
    );
};

export const extractedUnresolved = function extractedUnresolved(changelog: string, extracted: string): string {
    return `REFUSED  ${changelog} has no heading matching "${extracted}". Extract the item first, then name its heading.\n`;
};

export const clauseExtended = function clauseExtended(lead: string, heading: string, archive: string): string {
    return (
        `EXTENDED  The ${lead} clause of ${heading} in ${archive} now carries the new text. The history file ` +
        "records no author, so extend only entries you wrote or were asked to extend.\n"
    );
};
