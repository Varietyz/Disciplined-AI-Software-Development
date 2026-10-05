import type { RuleFile } from "#types/rule.types";
import { isRecord } from "#core/selectors/record.selector";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readdirSync } from "node:fs";

export const loadRuleFolder = async function loadRuleFolder(dir: string, suffix: string): Promise<RuleFile[]> {
    const names = readdirSync(dir)
        .filter((name) => name.endsWith(suffix))
        .toSorted((a, b) => a.localeCompare(b));
    return Promise.all(
        names.map(async (name): Promise<RuleFile> => {
            const file = path.join(dir, name);
            const loaded: unknown = await import(pathToFileURL(file).href);
            return { file, id: name.slice(0, -suffix.length), module: isRecord(loaded) ? loaded : {} };
        }),
    );
};
