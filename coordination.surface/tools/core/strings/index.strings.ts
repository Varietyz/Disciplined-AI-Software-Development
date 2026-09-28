export const foreignWithoutReason = function foreignWithoutReason(by: string, letter: string): string {
    return (
        `REFUSED  ${by} is changing the state of ${letter}, which is another seat, and gave no reason. A seat may ` +
        "change another seat's state, for example when that seat left without marking itself inactive. The index " +
        "then records who made the change and why, so a reader can tell it apart from a change the seat made itself. " +
        'Add `--ref "<reason>"` and run the command again.\n'
    );
};

export const unknownState = function unknownState(state: string, states: readonly string[]): string {
    return (
        `REFUSED  ${state} is not a seat state. The states are ${states.join(", ")}, and every tool that reads this ` +
        "column matches one of them, so any other value would be ignored everywhere.\n"
    );
};

export const unboundLetter = function unboundLetter(letter: string): string {
    return (
        `REFUSED  ${letter} has no row in the index, so it has no state to change. A letter is claimed by adding ` +
        'its row with `--index "<role>"`. Add the row first.\n'
    );
};

export const malformedRow = function malformedRow(letter: string): string {
    return (
        `REFUSED  The row for ${letter} does not have the index's three columns (letter, role, state), so the tool ` +
        "cannot find the state. Correct the row by hand, then run the command again.\n"
    );
};

export const alreadyInState = function alreadyInState(letter: string, state: string): string {
    return `CLEAR  ${letter} is already ${state}. Nothing was written.\n`;
};

export const stateChanged = function stateChanged(letter: string, state: string, by: string | null): string {
    const recorded = by === null ? "" : ` The change is recorded under the row, with ${by}'s reason.`;
    return (
        `STATE  ${letter} is now ${state}.${recorded} Every tool that reads seat states uses the new state from its ` +
        "next run. A seat that is not active no longer needs a role document.\n"
    );
};

export const ROLE_MISSING =
    "REFUSED  A new row needs a role, and none was given. The role states what the letter stands for, as a concern " +
    'rather than a task list, for example `--index "coverage of the governance walks"`.\n';

export const ROW_SECTION_MISSING =
    "REFUSED  The index has no row section (the table under the INDEX heading), so the tool has nowhere to add the " +
    "row. Restore the section from the index template, then run the command again.\n";

export const LETTERS_EXHAUSTED =
    "REFUSED  Every letter in the naming scheme is taken. Letters are never reused, because older items and " +
    "citations still point to them.\n";

export const rowAdded = function rowAdded(letter: string, role: string): string {
    return (
        `ROW  ${letter} is bound to "${role}" and marked ACTIVE. Use this letter for every write from now on. The ` +
        "row is permanent: the letter keeps this role, and it is never given to another.\n"
    );
};

export const INDEX_CONTENDED =
    "CONTENDED  The index changed between the read and the write, so nothing was written. Run the command again; " +
    "the tool reads the current index first.\n";
