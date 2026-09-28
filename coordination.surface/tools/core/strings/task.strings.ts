export const planMissing = function planMissing(target: string): string {
    return `REFUSED  ${target} does not exist, so there is no planning surface to add the row to.\n`;
};

export const ROW_INCOMPLETE =
    "REFUSED  A row needs both an id and a statement of the work, and one of them is missing. Other rows and " +
    "closures cite a row by its id, and the statement says what the row asks for.\n";

export const idTaken = function idTaken(id: string, target: string): string {
    return (
        `REFUSED  ${id} is already used by a row on ${target}. Each id belongs to one task, so every citation of it ` +
        "points to one place. Choose the next free id.\n"
    );
};

export const noTaskRows = function noTaskRows(target: string): string {
    return (
        `REFUSED  ${target} has no task rows yet, so the tool cannot tell where a new row belongs. Write the first ` +
        "row by hand; later rows can be added with this command.\n"
    );
};

export const contractMissing = function contractMissing(template: string): string {
    return (
        `REFUSED  The planning template (${template}) declares no row fields, so the tool has no contract to write ` +
        "the row from. Restore the task contract table in the template, then run the command again.\n"
    );
};

export const rowAppended = function rowAppended(id: string, target: string): string {
    return (
        `ROW  ${id} was added to ${target} with every field the planning template declares. The owner is filled ` +
        "in; every other field reads <unwritten> until the row's author writes it.\n"
    );
};
