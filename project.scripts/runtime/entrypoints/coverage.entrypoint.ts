import { absolutePath, relativePath } from "@ssot/paths";
import { MIN_PASSING_TESTS } from "#configuration/constants/coverage.constants";
import { floorVerdict } from "#core/validators/coverage.validator";
import process from "node:process";
import { reportAt } from "#core/loaders/report.loader";
import { reportMissing } from "#configuration/strings/coverage.strings";

const report = reportAt(absolutePath("govlabHost.reports.lint.test"));

if (report === null) {
    process.stderr.write(reportMissing(relativePath("govlabHost.reports.lint.test")));
    process.exitCode = 1;
} else {
    const verdict = floorVerdict(report, MIN_PASSING_TESTS);
    (verdict.held ? process.stdout : process.stderr).write(verdict.text);
    process.exitCode = verdict.held ? 0 : 1;
}
