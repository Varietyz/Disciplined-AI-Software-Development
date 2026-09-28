export const planFileMissing = function planFileMissing(plan: string): string {
    return (
        `REFUSED  ${plan} does not exist, so there is no agenda plan to add a row to. The table in the agenda file ` +
        "is generated from this plan, so a row written into the table directly is lost on the next run.\n"
    );
};

export const invariantTaken = function invariantTaken(invariant: string): string {
    return (
        `REFUSED  ${invariant} is already a row in the plan. The invariant name is the row's key, so it appears ` +
        "once. Edit the existing row instead.\n"
    );
};

export const planTerminatorMissing = function planTerminatorMissing(plan: string): string {
    return (
        `REFUSED  ${plan} has no closing line for the schedule, so the tool cannot tell where a new row belongs. ` +
        "Restore the closing `]);` of the schedule, then run the command again.\n"
    );
};

export const planContended = function planContended(plan: string): string {
    return (
        `CONTENDED  ${plan} changed between the read and the write, so the row was not added. Run the command ` +
        "again; the tool reads the current plan first.\n"
    );
};

export const agendaRowAdded = function agendaRowAdded(invariant: string, plan: string): string {
    return (
        `ROW  ${invariant} was added to the plan in ${plan}. Its state is not written: every run works it out from ` +
        "the venues on disk and renders it into the agenda table.\n"
    );
};
