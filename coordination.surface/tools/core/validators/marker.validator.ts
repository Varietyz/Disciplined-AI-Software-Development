import { fencedFlags } from "../predicates/fence.predicate.ts";
import { isClassHeading } from "../predicates/marker.predicate.ts";

const HEADING_LEAD = "### ";

const ENTRIES_MARKER = "ENTRIES";

const INSTANCES_MARKER = "INSTANCES";

interface UnboundedEntry {
    readonly heading: string;
    readonly line: number;
}

interface EntryState {
    readonly heading: string;
    readonly line: number;
    readonly bounded: boolean;
    readonly instances: boolean;
}

const NO_ENTRY: EntryState = { bounded: false, heading: "", instances: false, line: 0 };

const closedEntry = function closedEntry(state: EntryState, classBound: boolean): UnboundedEntry[] {
    const exempt = state.heading.length === 0 || state.bounded || (classBound && state.instances);
    return exempt ? [] : [{ heading: state.heading, line: state.line }];
};

const headingEntry = function headingEntry(text: string, index: number): EntryState {
    const next = text.slice(HEADING_LEAD.length).trim();
    return { ...NO_ENTRY, heading: isClassHeading(next) ? next : "", line: index + 1 };
};

const observedEntry = function observedEntry(state: EntryState, text: string, lead: string): EntryState {
    return {
        ...state,
        bounded: state.bounded || text.trimStart().startsWith(lead),
        instances: state.instances || text.includes(INSTANCES_MARKER),
    };
};

export const unboundedEntries = function unboundedEntries(
    accumulator: string,
    lead: string,
    classBound = false,
): UnboundedEntry[] {
    const lines = accumulator.split("\n");
    const start = lines.findIndex((text) => text.includes(ENTRIES_MARKER));
    if (lead.length === 0 || start === -1) {
        return [];
    }

    const fenced = fencedFlags(accumulator);
    const out: UnboundedEntry[] = [];
    let state = NO_ENTRY;

    for (let index = start + 1; index < lines.length; index += 1) {
        const text = lines[index] ?? "";
        if (text.startsWith(HEADING_LEAD)) {
            out.push(...closedEntry(state, classBound));
            state = headingEntry(text, index);
        } else {
            state = fenced[index] === true ? state : observedEntry(state, text, lead);
        }
    }

    return [...out, ...closedEntry(state, classBound)];
};
