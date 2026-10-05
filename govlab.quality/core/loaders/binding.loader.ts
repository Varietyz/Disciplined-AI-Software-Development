import { readFileSync, readdirSync } from "node:fs";
import type { RuleSource } from "#types/binding.types";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

const RULE_FOLDER_KEYS = [
    "govlabHost.rules",
    "govlab.quality.eslintRules",
    "govlab.quality.contextRules",
    "govlab.quality.stylelintRules",
];
const RULE_MARKER = "rule";
const SEGMENT_SEPARATOR = ".";
const RULE_FILE_SEGMENTS = 4;
const MARKER_INDEX = 2;

const ruleIdOf = function ruleIdOf(name: string): string | null {
    const segments = name.split(SEGMENT_SEPARATOR);
    return segments.length === RULE_FILE_SEGMENTS && segments[MARKER_INDEX] === RULE_MARKER
        ? (segments[0] ?? null)
        : null;
};

export const loadRuleSources = function loadRuleSources(): RuleSource[] {
    return RULE_FOLDER_KEYS.flatMap((key) => {
        const folder = absolutePath(key);
        return readdirSync(folder)
            .toSorted((a, b) => a.localeCompare(b))
            .flatMap((name): RuleSource[] => {
                const id = ruleIdOf(name);
                const file = join(folder, name);
                return id === null ? [] : [{ file, id, text: readFileSync(file, "utf8") }];
            });
    });
};
