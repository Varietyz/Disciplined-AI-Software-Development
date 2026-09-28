const AGENDA_MARK = "`";

const ROW_LEAD = "|";

const PLANNED_STATE = "planned";

const LETTER_SCALE = 100;

interface AgendaRow {
    readonly invariant: string;
    readonly ordinal: string;
    readonly planned: boolean;
}

interface DisorderedRow {
    readonly invariant: string;
    readonly ordinal: string;
    readonly after: string;
}

const stateCellOf = function stateCellOf(row: string): string {
    const cells = row.split(ROW_LEAD);
    if (cells.length < 3) {
        return "";
    }

    const cell = (cells.at(-2) ?? "").trim();
    if (!cell.startsWith(AGENDA_MARK)) {
        return cell;
    }

    const closes = cell.indexOf(AGENDA_MARK, 1);
    return closes === -1 ? cell.slice(1) : cell.slice(1, closes);
};

const agendaRowOf = function agendaRowOf(line: string): AgendaRow | null {
    const trimmed = line.trim();
    const opens = trimmed.startsWith(ROW_LEAD) ? trimmed.indexOf(AGENDA_MARK) : -1;
    const closes = opens === -1 ? -1 : trimmed.indexOf(AGENDA_MARK, opens + 1);
    const invariant = closes === -1 ? "" : trimmed.slice(opens + 1, closes).trim();
    if (invariant.length === 0) {
        return null;
    }

    const cell = trimmed.indexOf(ROW_LEAD, 1);
    const ordinal = cell === -1 ? "" : trimmed.slice(1, cell).trim();
    return { invariant, ordinal, planned: stateCellOf(trimmed).startsWith(PLANNED_STATE) };
};

export const agendaRows = function agendaRows(agenda: string): AgendaRow[] {
    return agenda
        .split("\n")
        .flatMap((line) => {
            const row = agendaRowOf(line);
            return row === null ? [] : [row];
        })
        .filter((row, index, rows) => rows.findIndex((held) => held.invariant === row.invariant) === index);
};

export const ordinalValue = function ordinalValue(ordinal: string): number | null {
    let digits = "";
    let cursor = 0;

    while (cursor < ordinal.length && ordinal.charAt(cursor) >= "0" && ordinal.charAt(cursor) <= "9") {
        digits += ordinal.charAt(cursor);
        cursor += 1;
    }

    if (digits.length === 0) {
        return null;
    }

    let suffix = 0;
    for (; cursor < ordinal.length; cursor += 1) {
        const char = ordinal.charAt(cursor);
        if (char < "a" || char > "z") {
            return null;
        }
        suffix = suffix * LETTER_SCALE + ((char.codePointAt(0) ?? 0) - ("a".codePointAt(0) ?? 0) + 1);
    }

    return Number(digits) + suffix / (LETTER_SCALE * LETTER_SCALE);
};

export const disorderedRows = function disorderedRows(agenda: string): DisorderedRow[] {
    const out: DisorderedRow[] = [];
    let held: { value: number; invariant: string } | null = null;

    for (const row of agendaRows(agenda)) {
        const value = ordinalValue(row.ordinal);
        if (value !== null) {
            if (held !== null && value < held.value) {
                out.push({ after: held.invariant, invariant: row.invariant, ordinal: row.ordinal });
            } else {
                held = { invariant: row.invariant, value };
            }
        }
    }

    return out;
};

export const agendaOrdinalOf = function agendaOrdinalOf(agenda: string, invariant: string): string {
    return agendaRows(agenda).find((row) => row.invariant === invariant)?.ordinal ?? "";
};

export const agendaInvariants = function agendaInvariants(agenda: string): string[] {
    return agendaRows(agenda).map((row) => row.invariant);
};

export const plannedInvariants = function plannedInvariants(agenda: string): string[] {
    return agendaRows(agenda)
        .filter((row) => row.planned)
        .map((row) => row.invariant);
};

export const admissibleInvariants = function admissibleInvariants(agenda: string, venues: readonly string[]): string[] {
    return agendaRows(agenda)
        .filter((row) => row.planned && !venues.some((venue) => venue.includes(row.invariant)))
        .map((row) => row.invariant);
};

export const nextUnraised = function nextUnraised(agenda: string, venues: readonly string[]): string | null {
    return admissibleInvariants(agenda, venues)[0] ?? null;
};
