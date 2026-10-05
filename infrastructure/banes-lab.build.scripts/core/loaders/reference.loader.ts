import { existsSync, readFileSync } from "node:fs";
import type { CodeTarget } from "@banes-lab/web/types/code.types.js";
import { isRecord } from "#core/selectors/base.selector";

const CHANNELS = ["spans", "strings", "words"] as const;

const targetsIn = function targetsIn(value: unknown): readonly CodeTarget[] {
    return isRecord(value) ? Object.values(value).filter((target): target is CodeTarget => isRecord(target)) : [];
};

export const referenceTargetsOf = function referenceTargetsOf(file: string): readonly CodeTarget[] {
    if (!existsSync(file)) {
        return [];
    }
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
    if (!isRecord(parsed)) {
        return [];
    }
    const listed = parsed["targets"];
    const bound = Array.isArray(listed) ? listed.filter((target): target is CodeTarget => isRecord(target)) : [];
    return [...CHANNELS.flatMap((channel) => targetsIn(parsed[channel])), ...bound];
};
