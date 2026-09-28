import { STRINGS_CHANNEL, isCheckEnforced } from "./writing.canon.manifest.ts";
import type { PunctuationPolicy } from "../../types/manifest.types.ts";

export const PUNCTUATION_POLICY: PunctuationPolicy = {
    digitMetric: isCheckEnforced("no-unmeasured-numbers", STRINGS_CHANNEL),
    longDash: isCheckEnforced("no-long-dash", STRINGS_CHANNEL),
    semicolon: isCheckEnforced("no-semicolon", STRINGS_CHANNEL),
};

export const LONG_DASH = "—";

export const SEMICOLON = ";";

export const PERCENT_SIGN = "%";

export const METRIC_UNITS: readonly string[] = ["ms", "s", "kb", "mb", "gb", "%"];
