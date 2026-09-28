import type { Block, Counted, Phase } from "../types/checklist.types.ts";
import { HISTORY_HEADINGS, PAST_MARKERS, STATUS_MARKERS } from "../constants/tense.constants.ts";
import { MILESTONE_MARKER, PHASE_MARKER, TASK_MARKER } from "../constants/checklist.constants.ts";
import { carriesMarker } from "../analyzers/marker.analyzer.ts";

const HISTORY_MARKERS = [...PAST_MARKERS, ...STATUS_MARKERS, ...HISTORY_HEADINGS];

export const isTask = function isTask(line: string): boolean {
    return line.trimStart().startsWith(TASK_MARKER);
};

export const missingFields = function missingFields(text: string, fields: readonly string[]): string[] {
    return fields.filter((field) => !text.includes(field));
};

interface OpenBlock {
    readonly line: number;
    readonly parts: readonly string[];
}

const CONTINUATION_INDENT = "  ";

const blocksOf = function blocksOf(open: OpenBlock | null): Block[] {
    return open === null ? [] : [{ line: open.line, text: open.parts.join(" ") }];
};

const continuesBlock = function continuesBlock(line: string): boolean {
    return line.trim().length > 0 && line.startsWith(CONTINUATION_INDENT);
};

interface BlockScan {
    readonly done: readonly Block[];
    readonly open: OpenBlock | null;
}

const blockStep = function blockStep(scan: BlockScan, line: string, index: number): BlockScan {
    if (isTask(line)) {
        return { done: [...scan.done, ...blocksOf(scan.open)], open: { line: index + 1, parts: [line.trim()] } };
    }
    if (scan.open !== null && continuesBlock(line)) {
        return { ...scan, open: { ...scan.open, parts: [...scan.open.parts, line.trim()] } };
    }
    return { done: [...scan.done, ...blocksOf(scan.open)], open: null };
};

export const taskBlocks = function taskBlocks(lines: readonly string[]): Block[] {
    let scan: BlockScan = { done: [], open: null };
    for (const [index, line] of lines.entries()) {
        scan = blockStep(scan, line, index);
    }
    return [...scan.done, ...blocksOf(scan.open)];
};

export const declaresContract = function declaresContract(
    blocks: readonly Block[],
    fields: readonly string[],
): boolean {
    if (fields.length === 0) {
        return false;
    }
    return blocks.some((block) => missingFields(block.text, fields).length === 0);
};

export const count = function count(lines: readonly string[]): Counted {
    let milestones = 0;
    let phases = 0;
    let tasks = 0;

    for (const line of lines) {
        if (line.startsWith(MILESTONE_MARKER)) {
            milestones += 1;
        }
        if (line.startsWith(PHASE_MARKER)) {
            phases += 1;
        }
        if (isTask(line)) {
            tasks += 1;
        }
    }

    return { milestones, phases, tasks };
};

export const historyIn = function historyIn(line: string): string | null {
    const lowered = line.toLowerCase();
    return HISTORY_MARKERS.find((marker) => carriesMarker(lowered, marker)) ?? null;
};

const SECTION_HEADING = "## ";

interface PhaseState {
    readonly open: Phase | null;
    readonly argued: boolean;
}

interface PhaseStep {
    readonly emitted: readonly Phase[];
    readonly next: PhaseState;
}

const CLOSED: PhaseState = { argued: false, open: null };

const scaffolding = function scaffolding(line: string, labels: readonly string[]): boolean {
    const upper = line.toUpperCase();
    return labels.some((label) => upper.includes(label));
};

const closedOut = function closedOut(state: PhaseState): Phase[] {
    return state.open !== null && state.argued ? [state.open] : [];
};

const argues = function argues(line: string, scaffold: readonly string[]): boolean {
    return line.trim().length > 0 && !scaffolding(line, scaffold);
};

const phaseStep = function phaseStep(
    state: PhaseState,
    line: string,
    index: number,
    scaffold: readonly string[],
): PhaseStep {
    if (line.startsWith(PHASE_MARKER)) {
        const open = { line: index + 1, title: line.slice(PHASE_MARKER.length).trim() };
        return { emitted: closedOut(state), next: { argued: false, open } };
    }
    if (state.open === null) {
        return { emitted: [], next: state };
    }
    if (isTask(line)) {
        return { emitted: [], next: CLOSED };
    }
    if (line.startsWith(MILESTONE_MARKER) || line.startsWith(SECTION_HEADING)) {
        return { emitted: closedOut(state), next: CLOSED };
    }
    return { emitted: [], next: argues(line, scaffold) ? { ...state, argued: true } : state };
};

export const emptyPhases = function emptyPhases(lines: readonly string[], scaffold: readonly string[] = []): Phase[] {
    const out: Phase[] = [];
    let state = CLOSED;

    for (const [index, line] of lines.entries()) {
        const step = phaseStep(state, line, index, scaffold);
        out.push(...step.emitted);
        state = step.next;
    }

    return [...out, ...closedOut(state)];
};
