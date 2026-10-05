import { flagValue, hasFlag, numberFlag } from "@govlab/argv";
import type { ParsedArgv } from "@govlab/argv";
import { SNAPSHOT_DEFAULTS } from "#configuration/configs/snapshot.config";
import type { SnapshotOptions } from "#types/snapshot.types";
import { resolve } from "node:path";

const CLICK_PAIR = 2;
const CLICK_SEPARATOR = ",";

export const readOptions = function readOptions(argv: ParsedArgv): SnapshotOptions | null {
    const address = flagValue(argv, "--url");
    const out = flagValue(argv, "--out");
    const log = flagValue(argv, "--log");
    if (address === undefined || (out === undefined && log === undefined)) {
        return null;
    }
    const click = flagValue(argv, "--click");
    const spot = click === undefined ? null : click.split(CLICK_SEPARATOR).map(Number);
    return {
        browser: flagValue(argv, "--browser") ?? null,
        clickAfterMs: numberFlag(argv, "--click-after", SNAPSHOT_DEFAULTS.clickAfterMs),
        clickAt: spot?.length === CLICK_PAIR && spot.every((value) => Number.isFinite(value)) ? spot : null,
        height: numberFlag(argv, "--height", SNAPSHOT_DEFAULTS.height),
        log: log === undefined ? null : resolve(log),
        out: out === undefined ? null : resolve(out),
        settleMs: numberFlag(argv, "--settle", SNAPSHOT_DEFAULTS.settleMs),
        software: !hasFlag(argv, "--gpu"),
        timeoutMs: numberFlag(argv, "--timeout", SNAPSHOT_DEFAULTS.timeoutMs),
        url: address,
        width: numberFlag(argv, "--width", SNAPSHOT_DEFAULTS.width),
    };
};
