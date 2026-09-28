export const surfaceMissing = function surfaceMissing(target: string): string {
    return `ABSENT  ${target} does not exist, so there is no member section to add to.\n`;
};

export const regionMissing = function regionMissing(target: string): string {
    return (
        `REFUSED  ${target} declares no member section (a banner line containing ROWS), so the tool has no place ` +
        "to add a member below it. The part above that banner states what a member is, and only its author edits it. " +
        "Add a member by hand, or declare the section first.\n"
    );
};

export const headingTaken = function headingTaken(heading: string, target: string): string {
    return (
        `REFUSED  ${heading} already exists in ${target}. This command only adds new members, because a member ` +
        "belongs to the seat that measured it. Record a later measurement as a new member that names what changed, " +
        "or ask the author to edit theirs.\n"
    );
};

export const memberContended = function memberContended(target: string): string {
    return (
        `CONTENDED  ${target} changed between the read and the write, so the member was not added. Run the command ` +
        "again; the tool checks the heading against the current file.\n"
    );
};

export const memberAdded = function memberAdded(heading: string, target: string): string {
    return (
        `MEMBER  ${heading} was added to ${target}, below the member section banner. The member is yours: this ` +
        "command adds members and never edits one, and a citation names a member by this heading.\n"
    );
};
