import { lengthVerdict, nonBlankLines } from "#core/validators/source.validator";
import { FILE_LENGTH } from "@ssot/govlab/shared/generated/thresholds.generated.ts";
import type { LengthFinding } from "#types/source.types";
import { SURFACE_EXTENSIONS } from "#configuration/constants/source.constants";
import { absolutePath } from "@ssot/paths";
import { includedFilesUnder } from "#core/loaders/source.loader";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { persistReport } from "#core/persistence/report.persistence";
import process from "node:process";
import { readFileSync } from "node:fs";
import { relative } from "node:path";

const files = includedFilesUnder(absolutePath("app.member"), SURFACE_EXTENSIONS);
const findings: LengthFinding[] = files.flatMap((file) => {
    const count = nonBlankLines(readFileSync(file, "utf8"));
    return count > FILE_LENGTH ? [{ count, file: normalizePath(relative(process.cwd(), file)) }] : [];
});

await persistReport(absolutePath("govlabHost.reports.lint.loc"), {
    maxLines: FILE_LENGTH,
    scanned: files.length,
    violations: findings,
});
const verdict = lengthVerdict(findings, FILE_LENGTH, files.length);
process.stdout.write(verdict.text);
process.exitCode = verdict.held ? 0 : 1;
