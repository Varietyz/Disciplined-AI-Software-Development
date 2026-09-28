import { EMISSION_CALL, RULE_DIR, STEP_DIR } from "../constants/report.constants.ts";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { identityOf } from "../registries/rule.registry.ts";
import { resolve } from "node:path";

const SOURCE_EXTENSION = ".ts";

const QUOTE = '"';

const quotedArgument = function quotedArgument(source: string, at: number): string | null {
    const comma = source.indexOf(",", at);
    let open = comma === -1 ? source.length + 1 : comma + 1;
    while (source.charAt(open) === " ") {
        open += 1;
    }
    if (source.charAt(open) !== QUOTE) {
        return null;
    }

    const close = source.indexOf(QUOTE, open + 1);
    const value = close === -1 ? source.slice(open + 1) : source.slice(open + 1, close);
    return value.length > 0 ? value : null;
};

export const emittedIds = function emittedIds(source: string): string[] {
    const out = new Set<string>();
    let at = source.indexOf(EMISSION_CALL);

    while (at !== -1) {
        const id = quotedArgument(source, at + EMISSION_CALL.length);
        if (id !== null) {
            out.add(id);
        }
        at = source.indexOf(EMISSION_CALL, at + 1);
    }

    return [...out];
};

const idsDeclaredIn = function idsDeclaredIn(repoRoot: string, relativeDir: string): string[] {
    const dir = resolve(repoRoot, relativeDir);
    if (!existsSync(dir)) {
        return [];
    }
    return readdirSync(dir)
        .filter((entry) => entry.endsWith(SOURCE_EXTENSION))
        .flatMap((entry) => [identityOf(entry), ...emittedIds(readFileSync(resolve(dir, entry), "utf8"))]);
};

export const stepEmittedIds = function stepEmittedIds(repoRoot: string): string[] {
    return [...new Set(idsDeclaredIn(repoRoot, STEP_DIR))];
};

export const claimedReportIds = function claimedReportIds(repoRoot: string): Set<string> {
    return new Set([...stepEmittedIds(repoRoot), ...idsDeclaredIn(repoRoot, RULE_DIR)]);
};
