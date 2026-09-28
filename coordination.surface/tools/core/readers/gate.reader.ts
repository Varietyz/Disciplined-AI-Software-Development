import { existsSync, readFileSync } from "node:fs";
import { fieldOf, tryParse } from "./json.reader.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { resolve } from "node:path";

const GATE_REPORT = "gate.report.generated.json";

export const priorKindVerdicts = function priorKindVerdicts(repoRoot: string): Record<string, string> {
    const path = resolve(repoRoot, GENERATED_DIR, GATE_REPORT);
    const parsed = existsSync(path) ? tryParse(readFileSync(path, "utf8")) : null;
    const held = parsed !== null && isObject(parsed.value) ? fieldOf(parsed.value, "kindVerdicts") : null;
    if (!isObject(held)) {
        return {};
    }
    return Object.fromEntries(
        Object.entries(held).flatMap(([kind, state]) => (typeof state === "string" ? [[kind, state]] : [])),
    );
};

export const publishedKinds = function publishedKinds(repoRoot: string): string[] {
    return Object.keys(priorKindVerdicts(repoRoot));
};
