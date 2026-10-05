import { buildClosureGraph, graphCounts } from "#core/coordinators/closure.coordinator";
import { absolutePath } from "@ssot/paths";
import { graphLine } from "#configuration/strings/closure.strings";
import { persistReport } from "#core/persistence/report.persistence";
import process from "node:process";

const graph = buildClosureGraph(absolutePath("app.member"));
await persistReport(absolutePath("govlabHost.reports.lint.closureGraph"), graph);
process.stdout.write(graphLine(graphCounts(graph)));
