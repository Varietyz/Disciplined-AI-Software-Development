import { FAILURE_EXIT, FLAG_NAMES } from "#configuration/constants/invocation.constants";
import { blockingGaps, coverageRow, renderCoverage } from "#core/formatters/coverage.formatter";
import { hasFlag, resolveArgv } from "@govlab/argv";
import { COVERAGE_ARGV } from "#configuration/configs/invocation.config";
import { discoverModules } from "#core/loaders/manifest.loader";
import { print } from "#core/reporters/base.reporter";
import process from "node:process";

const argv = resolveArgv(COVERAGE_ARGV);
const rows = discoverModules().map(coverageRow);

for (const line of renderCoverage(rows)) {
    print(line);
}

process.exitCode = hasFlag(argv, FLAG_NAMES.strict) && blockingGaps(rows) > 0 ? FAILURE_EXIT : 0;
