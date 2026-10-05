import {
    ARM_SEPARATOR,
    CHECK_MARKERS,
    EVIDENCE_OPEN,
    GATE_MARKER,
    MEASURED_MARKER,
    POPULATION_MARKER,
    POPULATION_SLASH,
    REFUSAL_PREFIX,
    RESULT_ARROWS,
    RESULT_BLOCKED,
    RESULT_OWNER_OPEN,
    RESULT_PASS,
    RESULT_PREFIX,
    RESULT_UNKNOWN,
    RETIRED_CHECK_MARKERS,
    RETIRED_GATE_MARKERS,
    STANDING_PREFIX,
} from "#configuration/constants/grammar.constants";
import type {
    GateStep,
    MarkerHit,
    PagCheck,
    PagFailureArm,
    PagGate,
    PagPopulation,
    PagResult,
} from "#types/grammar.document.types";
import { valueAfter } from "#core/converters/text.converter";

const PAREN_CLOSE = ")";

export const gateMarkerOf = function gateMarkerOf(trimmed: string): { retired: boolean } | null {
    const lower = trimmed.toLowerCase();
    if (lower.startsWith(GATE_MARKER)) {
        return { retired: false };
    }
    return RETIRED_GATE_MARKERS.some((marker) => lower.startsWith(marker)) ? { retired: true } : null;
};

export const checkMarkerOf = function checkMarkerOf(trimmed: string): MarkerHit | null {
    const live = CHECK_MARKERS.find((marker) => trimmed.startsWith(marker));
    if (live !== undefined) {
        return { marker: live.trim(), retired: false };
    }
    const retired = RETIRED_CHECK_MARKERS.find((marker) => trimmed.startsWith(marker));
    return retired === undefined ? null : { marker: retired.trim(), retired: true };
};

const populationOf = function populationOf(text: string): PagPopulation | null {
    const over = text.indexOf(POPULATION_MARKER);
    if (over === -1) {
        return null;
    }
    const afterOver = text.slice(over + POPULATION_MARKER.length);
    const measured = afterOver.indexOf(MEASURED_MARKER);
    const set = (measured === -1 ? afterOver : afterOver.slice(0, measured)).trim();
    const counts = measured === -1 ? "" : afterOver.slice(measured + MEASURED_MARKER.length);
    const slash = counts.indexOf(POPULATION_SLASH);
    return {
        measured: (slash === -1 ? counts : counts.slice(0, slash)).trim(),
        set,
        whole: slash === -1 ? "" : counts.slice(slash + 1).trim(),
    };
};

const stripTrailingParen = function stripTrailingParen(text: string): string {
    const trimmed = text.trim();
    return trimmed.endsWith(PAREN_CLOSE) ? trimmed.slice(0, -1).trim() : trimmed;
};

const firstMarkerAt = function firstMarkerAt(rest: string, candidates: number[]): number {
    const present = candidates.filter((index) => index !== -1);
    return present.length === 0 ? rest.length : Math.min(...present);
};

const evidenceOf = function evidenceOf(rest: string, evidenceAt: number, over: number): string | null {
    if (evidenceAt === -1) {
        return null;
    }
    const end = over === -1 || over < evidenceAt ? rest.length : over;
    return stripTrailingParen(rest.slice(evidenceAt + EVIDENCE_OPEN.length, end));
};

export const parseCheck = function parseCheck(trimmed: string, marker: string, line: number): PagCheck {
    const rest = trimmed.slice(marker.length).trim();
    const evidenceAt = rest.indexOf(EVIDENCE_OPEN);
    const over = rest.indexOf(POPULATION_MARKER);
    return {
        condition: rest.slice(0, firstMarkerAt(rest, [evidenceAt, over])).trim(),
        evidence: evidenceOf(rest, evidenceAt, over),
        line,
        marker,
        population: populationOf(rest),
    };
};

const ownerOf = function ownerOf(arm: string): string {
    const open = arm.indexOf(RESULT_OWNER_OPEN);
    if (open === -1) {
        return "";
    }
    const close = arm.indexOf(PAREN_CLOSE, open);
    return arm.slice(open + RESULT_OWNER_OPEN.length, close === -1 ? arm.length : close).trim();
};

const firstArrowAt = function firstArrowAt(arm: string): { at: number; length: number } | null {
    const hits = RESULT_ARROWS.map((arrow) => ({ at: arm.indexOf(arrow), length: arrow.length })).filter(
        (hit) => hit.at !== -1,
    );
    const [head, ...rest] = hits;
    return head === undefined ? null : rest.reduce((first, hit) => (hit.at < first.at ? hit : first), head);
};

const targetAfter = function targetAfter(trimmed: string, word: string): string | null {
    if (!trimmed.startsWith(word)) {
        return null;
    }
    const rest = trimmed.slice(word.length).trim();
    const arrow = RESULT_ARROWS.find((candidate) => rest.startsWith(candidate));
    return arrow === undefined ? null : rest.slice(arrow.length).trim();
};

const failureOf = function failureOf(arm: string): PagFailureArm {
    const arrow = firstArrowAt(arm);
    return { name: (arrow === null ? arm : arm.slice(0, arrow.at)).trim(), owner: ownerOf(arm) };
};

const applyArm = function applyArm(result: PagResult, arm: string): PagResult {
    const trimmed = arm.trim();
    if (trimmed === "") {
        return result;
    }
    const pass = targetAfter(trimmed, RESULT_PASS);
    if (pass !== null) {
        return { ...result, pass };
    }
    const unknown = targetAfter(trimmed, RESULT_UNKNOWN);
    if (unknown !== null) {
        return { ...result, unknown: unknown.startsWith(RESULT_BLOCKED) ? RESULT_BLOCKED : unknown };
    }
    return { ...result, failures: [...result.failures, failureOf(trimmed)] };
};

export const withResultArms = function withResultArms(result: PagResult, text: string): PagResult {
    return text.split(ARM_SEPARATOR).reduce(applyArm, result);
};

export const parseResult = function parseResult(trimmed: string, line: number): PagResult {
    return withResultArms({ failures: [], line, pass: "", unknown: null }, trimmed.slice(RESULT_PREFIX.length));
};

const clauseOf = function clauseOf(gate: PagGate, trimmed: string, lineNo: number): PagGate | null {
    if (trimmed.startsWith(REFUSAL_PREFIX)) {
        return { ...gate, refusal: valueAfter(trimmed, REFUSAL_PREFIX) };
    }
    if (trimmed.startsWith(STANDING_PREFIX)) {
        return { ...gate, standing: valueAfter(trimmed, STANDING_PREFIX) };
    }
    if (trimmed.startsWith(RESULT_PREFIX)) {
        return { ...gate, result: parseResult(trimmed, lineNo) };
    }
    if (trimmed.startsWith(ARM_SEPARATOR) && gate.result !== null) {
        return { ...gate, result: withResultArms(gate.result, trimmed) };
    }
    return null;
};

export const stepGate = function stepGate(gate: PagGate, trimmed: string, lineNo: number): GateStep {
    const hit = checkMarkerOf(trimmed);
    if (hit !== null) {
        const retired = hit.retired ? { kind: "check" as const, line: lineNo, token: hit.marker } : null;
        return {
            closes: false,
            consumed: true,
            gate: { ...gate, checks: [...gate.checks, parseCheck(trimmed, hit.marker, lineNo)] },
            retired,
        };
    }
    const next = clauseOf(gate, trimmed, lineNo);
    return next === null
        ? { closes: gate.result !== null, consumed: false, gate, retired: null }
        : { closes: false, consumed: true, gate: next, retired: null };
};
