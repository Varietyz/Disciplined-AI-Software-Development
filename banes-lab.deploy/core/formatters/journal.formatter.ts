import {
    BAR_EMPTY,
    BAR_FILLED,
    MS_PER_SECOND,
    PERCENT,
    PROGRESS_BAR_WIDTH,
} from "#configuration/constants/deployment.constants";
import { TIME_UNKNOWN, transferLine } from "#configuration/strings/deployment.strings";
import { formatBytes, formatClock } from "#core/converters/text.converter";
import type { TransferState } from "#types/deployment.types";

export const percentOf = function percentOf(state: TransferState): number {
    const ratio = state.size > 0 ? state.transferred / state.size : state.done / Math.max(state.total, 1);
    return Math.min(PERCENT, Math.floor(ratio * PERCENT));
};

const barOf = function barOf(percent: number): string {
    const filled = Math.round((percent / PERCENT) * PROGRESS_BAR_WIDTH);
    return BAR_FILLED.repeat(filled) + BAR_EMPTY.repeat(PROGRESS_BAR_WIDTH - filled);
};

export const transferLineOf = function transferLineOf(state: TransferState, now: number): string {
    const percent = percentOf(state);
    const seconds = Math.max((now - state.startedAt) / MS_PER_SECOND, 0);
    const rate = seconds > 0 ? state.transferred / seconds : 0;
    const remaining = Math.max(state.size - state.transferred, 0);
    return transferLine({
        bar: barOf(percent),
        done: state.done.toLocaleString(),
        failed: String(state.failed),
        label: state.label,
        left: rate > 0 ? formatClock(remaining / rate) : TIME_UNKNOWN,
        moved: formatBytes(state.transferred),
        percent: String(percent),
        rate: formatBytes(rate),
        size: formatBytes(state.size),
        total: state.total.toLocaleString(),
        unit: state.unit,
    });
};
