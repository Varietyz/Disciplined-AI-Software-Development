import { delimitersIn } from "../analyzers/fence.analyzer.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";
import { itemSpans } from "../resolvers/sweep.resolver.ts";

const POSITION_OPENER = "Position ";

const FIELD_INDENT = "  ";

interface SchemaGap {
    readonly record: string;
    readonly field: string;
    readonly declared: readonly string[];
    readonly state: "absent" | "undeclared";
}

const RECORD_OPENER = "Agent ";

const RECORD_CLOSER = "└───";

const DEEPER_INDENT = `${FIELD_INDENT} `;

const fieldNameOf = function fieldNameOf(trimmed: string): string | null {
    const colon = trimmed.indexOf(":");
    const field = colon <= 0 ? "" : trimmed.slice(0, colon).trim();
    return field.length === 0 || field.includes(" ") ? null : field;
};

const isRecordBoundary = function isRecordBoundary(trimmed: string): boolean {
    return trimmed.startsWith(RECORD_OPENER) || trimmed.startsWith(RECORD_CLOSER);
};

const recordFlags = function recordFlags(lines: readonly string[], fenced: readonly boolean[]): boolean[] {
    const out: boolean[] = [];
    let inside = false;

    for (const [index, line] of lines.entries()) {
        out.push(inside);
        const trimmed = line.trim();
        const next: boolean = trimmed.startsWith(RECORD_OPENER) || (inside && !trimmed.startsWith(RECORD_CLOSER));
        inside = fenced[index] === true ? next : inside;
    }

    return out;
};

export const venueFieldsFrom = function venueFieldsFrom(template: string): string[] {
    const lines = template.split("\n");
    const fenced = fencedFlags(template);
    const inside = recordFlags(lines, fenced);

    const fields = lines.flatMap((line, index) => {
        const trimmed = line.trim();
        const eligible = fenced[index] === true && inside[index] === true && !isRecordBoundary(trimmed);
        const field = eligible && line.startsWith(FIELD_INDENT) ? fieldNameOf(trimmed) : null;
        return field === null ? [] : [field];
    });

    return [...new Set(fields)];
};

const absentFields = function absentFields(
    record: string,
    seen: ReadonlySet<string>,
    declared: readonly string[],
): SchemaGap[] {
    if (record.length === 0) {
        return [];
    }
    return declared.filter((field) => !seen.has(field)).map((field) => ({ declared, field, record, state: "absent" }));
};

interface RecordState {
    readonly record: string;
    readonly seen: ReadonlySet<string>;
}

interface RecordStep {
    readonly gaps: readonly SchemaGap[];
    readonly next: RecordState;
}

const NO_RECORD: RecordState = { record: "", seen: new Set() };

const venueFieldAt = function venueFieldAt(line: string, record: string): string | null {
    const indented = record.length > 0 && line.startsWith(FIELD_INDENT) && !line.startsWith(DEEPER_INDENT);
    return indented ? fieldNameOf(line.trim()) : null;
};

const recordStep = function recordStep(state: RecordState, line: string, declared: readonly string[]): RecordStep {
    if (line.startsWith(RECORD_OPENER)) {
        return {
            gaps: absentFields(state.record, state.seen, declared),
            next: { record: line.trim(), seen: new Set() },
        };
    }
    if (line.startsWith(RECORD_CLOSER)) {
        return { gaps: absentFields(state.record, state.seen, declared), next: NO_RECORD };
    }

    const field = venueFieldAt(line, state.record);
    if (field === null) {
        return { gaps: [], next: state };
    }
    if (declared.includes(field)) {
        return { gaps: [], next: { ...state, seen: new Set([...state.seen, field]) } };
    }
    return { gaps: [{ declared, field, record: state.record, state: "undeclared" }], next: state };
};

export const venueSchemaGaps = function venueSchemaGaps(source: string, template: string): SchemaGap[] {
    const declared = venueFieldsFrom(template);
    if (declared.length === 0) {
        return [];
    }

    const fenced = fencedFlags(source);
    const out: SchemaGap[] = [];
    let state = NO_RECORD;

    for (const [index, line] of source.split("\n").entries()) {
        const step = fenced[index] === true ? { gaps: [], next: state } : recordStep(state, line, declared);
        out.push(...step.gaps);
        state = step.next;
    }

    return [...out, ...absentFields(state.record, state.seen, declared)];
};

const CONTRADICTS_LEAD = "Contradicts:";

const FIELD_BLOCK_LEAD = "carries these fields";

const isLetter = function isLetter(char: string): boolean {
    return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
};

const labelWord = function labelWord(line: string): string {
    const trimmed = line.trim();
    const colon = trimmed.indexOf(":");
    const label = colon <= 0 ? "" : trimmed.slice(0, colon);
    for (const char of label) {
        if (!isLetter(char)) {
            return "";
        }
    }
    return label;
};

export const positionFieldLabels = function positionFieldLabels(template: string): string[] {
    const lines = template.split("\n");
    const start = lines.findIndex((line) => line.includes(FIELD_BLOCK_LEAD));
    if (start === -1) {
        return [];
    }

    const words = lines.slice(start + 1).map(labelWord);
    const first = words.findIndex((word) => word.length > 0 && word !== SIGNED_WORD);
    const block = first === -1 ? [] : words.slice(first);
    const end = block.indexOf("");
    return (end === -1 ? block : block.slice(0, end)).filter((word) => word !== SIGNED_WORD);
};

const SIGNED_WORD = "Signed";

export const SIGNED_LEAD = "Signed:";

const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const citesAt = function citesAt(clause: string, index: number, letter: string): boolean {
    const before = index === 0 ? " " : clause.charAt(index - 1);
    const after = index + letter.length;
    const cursor = clause.charAt(after) === "-" ? after + 1 : after;
    return !isLetter(before) && isDigit(clause.charAt(cursor));
};

const citesOwnLetter = function citesOwnLetter(clause: string, letter: string): boolean {
    let index = letter.length === 0 ? -1 : clause.indexOf(letter);
    while (index !== -1) {
        if (citesAt(clause, index, letter)) {
            return true;
        }
        index = clause.indexOf(letter, index + 1);
    }
    return false;
};

const contradictionClause = function contradictionClause(body: string): string | null {
    const opens = body.indexOf(CONTRADICTS_LEAD);
    if (opens === -1) {
        return null;
    }
    const after = body.slice(opens + CONTRADICTS_LEAD.length);
    const stop = after.indexOf(SIGNED_LEAD);
    return stop === -1 ? after : after.slice(0, stop);
};

export const selfCorrections = function selfCorrections(source: string): string[] {
    const lines = source.split("\n");
    return itemSpans(source)
        .filter((span) => {
            const clause = contradictionClause(lines.slice(span.from, span.through).join(" "));
            return clause !== null && citesOwnLetter(clause, span.agent);
        })
        .map((span) => span.key);
};

interface StrayPosition {
    readonly key: string;
    readonly line: number;
}

const claimKeyOf = function claimKeyOf(line: string): string {
    const rest = line.slice(POSITION_OPENER.length);
    const dash = rest.indexOf(" —");
    const key = dash === -1 ? rest : rest.slice(0, dash);
    return key.trim();
};

const depthChanges = function depthChanges(source: string): Map<number, number> {
    const out = new Map<number, number>();
    for (const mark of delimitersIn(source)) {
        out.set(mark.line, (out.get(mark.line) ?? 0) + (mark.open ? 1 : -1));
    }
    return out;
};

export const positionsOutsideRecords = function positionsOutsideRecords(source: string): StrayPosition[] {
    const fenced = fencedFlags(source);
    const changes = depthChanges(source);
    const out: StrayPosition[] = [];
    let depth = 0;

    for (const [index, line] of source.split("\n").entries()) {
        depth += changes.get(index + 1) ?? 0;
        const stray = fenced[index] !== true && depth <= 0 && line.startsWith(POSITION_OPENER);
        if (stray) {
            out.push({ key: claimKeyOf(line), line: index + 1 });
        }
    }

    return out;
};
