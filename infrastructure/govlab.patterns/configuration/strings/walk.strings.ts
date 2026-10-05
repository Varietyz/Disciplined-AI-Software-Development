import {
    STATE_CALL,
    STATE_CONTROL,
    STATE_DECLARE,
    STATE_READ,
    STATE_STRUCT,
    STATE_WRITE,
} from "#configuration/constants/walk.constants";
import type { LegendItem } from "#types/walk.types";

export const DEFAULT_WALK_TITLE = "code flow";

export const EMPTY_WALK_NOTE = ": no code";

export const WARN_MARK = "!";

export const walkSubtitle = function walkSubtitle(steps: number): string {
    return `${steps} steps · follow the arrows`;
};

export const STATE_LEGEND: readonly LegendItem[] = [
    { state: STATE_DECLARE, text: "declare" },
    { state: STATE_CALL, text: "call" },
    { state: STATE_WRITE, text: "write" },
    { state: STATE_READ, text: "read" },
    { state: STATE_CONTROL, text: "control" },
    { state: STATE_STRUCT, text: "structure" },
];
