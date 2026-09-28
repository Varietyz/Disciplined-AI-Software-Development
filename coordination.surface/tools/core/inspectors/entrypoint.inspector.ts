import { braceDelta, memberKey, memberValue } from "../analyzers/source.analyzer.ts";
import type { BranchOperand } from "../types/entrypoint.types.ts";

const DECLARE_CONST = "const ";

const BLOCK_CLOSE = "}";

const BRANCH_MARKS = ["?", "if (", "&&", "||"];

interface ScanState {
    readonly inRun: boolean;
    readonly inReport: boolean;
    readonly runDepth: number;
    readonly reportDepth: number;
}

interface LineFacts {
    readonly line: number;
    readonly branching: string | null;
    readonly passed: string | null;
    readonly published: readonly string[];
}

interface Calls {
    readonly carrier: string;
    readonly runCall: string;
    readonly reportCall: string;
}

const OUTSIDE: ScanState = { inReport: false, inRun: false, reportDepth: 0, runDepth: 0 };

const declaresCarrier = function declaresCarrier(trimmed: string, carrier: string): boolean {
    const lead = `${DECLARE_CONST}${carrier}`;
    if (!trimmed.startsWith(lead)) {
        return false;
    }
    const next = trimmed.charAt(lead.length);
    return next === " " || next === ":" || next === "=";
};

const carrierIn = function carrierIn(line: string, reportCall: string): string {
    const at = line.indexOf(`${reportCall}(`);
    if (at === -1) {
        return "";
    }
    const inside = line.slice(at + reportCall.length + 1);
    const close = inside.indexOf(")");
    return close === -1 ? "" : (inside.slice(0, close).split(",").at(-1) ?? "").trim();
};

const reportCarrier = function reportCarrier(lines: readonly string[], reportCall: string): string {
    return lines.map((line) => carrierIn(line, reportCall)).find((carrier) => carrier.length > 0) ?? "";
};

const branchingName = function branchingName(trimmed: string): string | null {
    if (!trimmed.startsWith(DECLARE_CONST) || !BRANCH_MARKS.some((mark) => trimmed.includes(mark))) {
        return null;
    }
    const rest = trimmed.slice(DECLARE_CONST.length);
    const stop = rest.indexOf(" ");
    return stop <= 0 ? null : rest.slice(0, stop);
};

const opened = function opened(state: ScanState, trimmed: string, calls: Calls): ScanState {
    const declared = calls.carrier.length > 0 && declaresCarrier(trimmed, calls.carrier);
    const opensReport = declared || trimmed.includes(`${calls.reportCall}(`);
    const opensRun = trimmed.includes(`${calls.runCall}(`);
    return {
        inReport: state.inReport || opensReport,
        inRun: state.inRun || opensRun,
        reportDepth: opensReport ? 0 : state.reportDepth,
        runDepth: opensRun ? 0 : state.runDepth,
    };
};

const closed = function closed(state: ScanState, trimmed: string): ScanState {
    const delta = braceDelta(trimmed);
    const runDepth = state.runDepth + (state.inRun ? delta : 0);
    const reportDepth = state.reportDepth + (state.inReport ? delta : 0);
    const closes = trimmed.startsWith(BLOCK_CLOSE);
    return {
        inReport: state.inReport && !(reportDepth <= 0 && closes),
        inRun: state.inRun && !(runDepth <= 0 && closes),
        reportDepth,
        runDepth,
    };
};

const factsOf = function factsOf(state: ScanState, trimmed: string, line: number): LineFacts {
    const value = memberValue(trimmed);
    return {
        branching: branchingName(trimmed),
        line,
        passed: state.inRun && value.length > 0 ? value : null,
        published: state.inReport ? [memberKey(trimmed), value].filter((word) => word.length > 0) : [],
    };
};

const scannedFacts = function scannedFacts(lines: readonly string[], calls: Calls): LineFacts[] {
    const out: LineFacts[] = [];
    let state = OUTSIDE;

    for (const [index, line] of lines.entries()) {
        const trimmed = line.trim();
        state = opened(state, trimmed, calls);
        out.push(factsOf(state, trimmed, index + 1));
        state = closed(state, trimmed);
    }

    return out;
};

export const unpublishedBranchOperands = function unpublishedBranchOperands(
    source: string,
    runCall: string,
    reportCall: string,
): BranchOperand[] {
    const lines = source.split("\n");
    const facts = scannedFacts(lines, { carrier: reportCarrier(lines, reportCall), reportCall, runCall });

    const branching = new Set(facts.flatMap((fact) => (fact.branching === null ? [] : [fact.branching])));
    const published = new Set(facts.flatMap((fact) => fact.published));
    const passed = new Map(
        facts
            .flatMap((fact): [string, number][] => (fact.passed === null ? [] : [[fact.passed, fact.line]]))
            .toReversed(),
    );

    return [...passed]
        .filter(([name]) => branching.has(name) && !published.has(name))
        .toSorted((left, right) => left[1] - right[1])
        .map(([name, line]) => ({ line, name }));
};
