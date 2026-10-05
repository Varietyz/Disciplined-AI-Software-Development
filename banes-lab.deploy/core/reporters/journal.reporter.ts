import type { ByteStep, Journal, Progress, ProgressSink, TransferPlan, TransferState } from "#types/deployment.types";
import {
    CARRIAGE_RETURN,
    CLEAR_LINE,
    ELLIPSIS,
    LINE_BREAK,
    PROGRESS_JOURNAL_STEP,
    PROGRESS_LOG_STEP,
    PROGRESS_REDRAW_MS,
    STEP_SUMMARY_LIMIT,
} from "#configuration/constants/deployment.constants";
import { percentOf, transferLineOf } from "#core/formatters/journal.formatter";
import { SECONDS_SUFFIX } from "#configuration/strings/deployment.strings";
import { formatDuration } from "#core/converters/text.converter";

const write = function write(message: string): void {
    process.stdout.write(message + LINE_BREAK);
};

export const createJournal = function createJournal(): Journal {
    const steps: string[] = [];
    let lastStepAt = Date.now();
    const log = function log(message: string): void {
        steps.push(`[${new Date().toLocaleTimeString()}] ${message}`);
        write(message);
    };
    const mark = function mark(message: string): void {
        const now = Date.now();
        const duration = formatDuration(now - lastStepAt);
        lastStepAt = now;
        log(`${message} (${duration}${SECONDS_SUFFIX})`);
    };
    const summary = function summary(): string {
        const joined = steps.join(LINE_BREAK);
        return joined.length > STEP_SUMMARY_LIMIT ? joined.slice(0, STEP_SUMMARY_LIMIT) + ELLIPSIS : joined;
    };
    return {
        error: (message) => {
            console.error(message);
        },
        log,
        mark,
        summary,
    };
};

export const createByteProgress = function createByteProgress(
    journal: Journal,
    label: string,
    unit: string,
    sink: ProgressSink = process.stdout,
    now: () => number = Date.now,
): { readonly finish: () => void; readonly step: ByteStep } {
    let progress: Progress | null = null;
    let reached = 0;
    return {
        finish: () => {
            progress?.finish();
        },
        step: (transferred, size) => {
            progress ??= createProgress(journal, { label, size, total: 1, unit }, sink, now);
            const crossed = reached < size && transferred >= size ? 1 : 0;
            progress.advance(crossed, transferred - reached, false);
            reached = transferred;
        },
    };
};

const stepOf = function stepOf(percent: number, step: number): number {
    return Math.floor(percent / step);
};

export const createProgress = function createProgress(
    journal: Journal,
    plan: TransferPlan,
    sink: ProgressSink = process.stdout,
    now: () => number = Date.now,
): Progress {
    const live = sink.isTTY === true;
    let state: TransferState = { ...plan, done: 0, failed: 0, startedAt: now(), transferred: 0 };
    let drawnAt = 0;
    let logged = 0;
    let journaled = 0;
    const draw = function draw(): void {
        sink.write(CARRIAGE_RETURN + CLEAR_LINE + transferLineOf(state, now()));
        drawnAt = now();
    };
    const note = function note(message: string): void {
        if (live) {
            sink.write(CARRIAGE_RETURN + CLEAR_LINE);
        }
        journal.log(message);
        if (live) {
            draw();
        }
    };
    const report = function report(): void {
        const percent = percentOf(state);
        if (stepOf(percent, PROGRESS_JOURNAL_STEP) > journaled) {
            journaled = stepOf(percent, PROGRESS_JOURNAL_STEP);
            logged = stepOf(percent, PROGRESS_LOG_STEP);
            note(transferLineOf(state, now()));
            return;
        }
        if (live) {
            if (now() - drawnAt >= PROGRESS_REDRAW_MS) {
                draw();
            }
            return;
        }
        if (stepOf(percent, PROGRESS_LOG_STEP) > logged) {
            logged = stepOf(percent, PROGRESS_LOG_STEP);
            sink.write(transferLineOf(state, now()) + LINE_BREAK);
        }
    };
    return {
        advance: (items, bytes, failed) => {
            state = {
                ...state,
                done: state.done + (failed ? 0 : items),
                failed: state.failed + (failed ? items : 0),
                transferred: state.transferred + bytes,
            };
            report();
        },
        finish: () => {
            if (live) {
                draw();
                sink.write(LINE_BREAK);
            }
        },
        note,
    };
};
