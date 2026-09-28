import { GENERATED_DIR, NO_FIX_FLAG } from "../constants/path.constants.ts";
import { mkdirSync, writeFileSync } from "node:fs";

import { cleanSources } from "../steps/source.step.ts";
import { projectRoot } from "../../../config/surface.config.ts";
import { resolve } from "node:path";
import { sourceSummary } from "../strings/source.strings.ts";

const REPO_ROOT = projectRoot();
const REPORT = `${GENERATED_DIR}/clean.report.generated.json`;

export const RESTATES: readonly string[] = ["mutation_preview_first", "healing_is_default_in_every_entrypoint"];

const main = function main(): void {
    const apply = !process.argv.includes(NO_FIX_FLAG);
    const result = cleanSources(REPO_ROOT, apply);

    const report = {
        applied: apply,
        files: result.files,
        keptAsAttribution: result.kept,
        removed: result.removed,
        scanned: result.scanned,
        tool: "clean",
        verdict: "pass",
    };

    mkdirSync(resolve(REPO_ROOT, GENERATED_DIR), { recursive: true });
    writeFileSync(resolve(REPO_ROOT, REPORT), `${JSON.stringify(report, null, 4)}\n`, "utf8");

    const counts = { files: result.files.length, kept: result.kept, removed: result.removed, scanned: result.scanned };
    process.stdout.write(sourceSummary(apply, counts, REPORT));
};

main();
