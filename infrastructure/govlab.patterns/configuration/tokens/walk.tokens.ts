import {
    STATE_CALL,
    STATE_CONTROL,
    STATE_DECLARE,
    STATE_READ,
    STATE_STRUCT,
    STATE_WRITE,
} from "#configuration/constants/walk.constants";

export const COLOR_FALLBACK = "#c9d1d9";

export const MUTED_COLOR = "#8b949e";

export const FLAG_FALLBACK = "#f0c000";

export const STATE_COLOR: ReadonlyMap<string, string> = new Map([
    [STATE_READ, "#58a6ff"],
    [STATE_CALL, "#d29922"],
    [STATE_WRITE, "#f85149"],
    [STATE_DECLARE, "#3fb950"],
    [STATE_CONTROL, "#bc8cff"],
    [STATE_STRUCT, "#586274"],
]);

export const SEVERITY_COLOR: ReadonlyMap<string, string> = new Map([
    ["high", "#f85149"],
    ["medium", "#d29922"],
    ["low", MUTED_COLOR],
]);

export const FLOW_COLOR: ReadonlyMap<string, string> = new Map([
    ["entry", "#d29922"],
    ["relay", "#58a6ff"],
    ["leaf", "#3fb950"],
    ["isolated", "#f85149"],
]);

export const DEPENDENTS_COLOR = "#bc8cff";
