import { DEFAULT_MONTHS, REPORT_NAME } from "#configuration/constants/rate.constants";
import { flagValue, numberFlag } from "@govlab/argv";
import { join, resolve } from "node:path";
import type { ParsedArgv } from "@govlab/argv";
import type { RateOptions } from "#types/rate.types";
import { absolutePath } from "@ssot/paths";

export const readRateOptions = function readRateOptions(argv: ParsedArgv): RateOptions {
    const asked = numberFlag(argv, "--rate", Number.NaN);
    const out = flagValue(argv, "--out");
    return {
        months: numberFlag(argv, "--months", DEFAULT_MONTHS),
        out: out === undefined ? join(absolutePath("scratch"), REPORT_NAME) : resolve(out),
        rate: Number.isFinite(asked) ? asked : null,
    };
};
