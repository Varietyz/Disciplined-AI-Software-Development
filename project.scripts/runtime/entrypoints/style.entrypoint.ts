import { absolutePath, relativePath } from "@ssot/paths";
import { persistReport } from "#core/persistence/report.persistence";
import process from "node:process";
import { styleVerdict } from "#core/validators/style.validator";
import { unusedSelectors } from "#core/adapters/style.adapter";

const unused = await unusedSelectors();
await persistReport(absolutePath("govlabHost.reports.lint.purgecss"), { unused });
const verdict = styleVerdict(unused, relativePath("govlabHost.reports.lint.purgecss"));
process.stdout.write(verdict.text);
process.exitCode = verdict.held ? 0 : 1;
