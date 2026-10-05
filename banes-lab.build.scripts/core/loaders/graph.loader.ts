import { existsSync, readFileSync } from "node:fs";
import { graphReportEmpty, graphReportMissing } from "#configuration/strings/graph.strings";
import type { Graph } from "#types/graph.types";
import { graphReport } from "#core/resolvers/catalog.resolver";
import { isRecord } from "#core/selectors/base.selector";
import { relativePath } from "@ssot/paths";

const REPORT_KEY = "govlabHost.reports.content.graph";

const isGraph = function isGraph(value: unknown): value is Graph {
    return isRecord(value) && Array.isArray(value["nodes"]) && Array.isArray(value["edges"]);
};

export const readGraphReport = function readGraphReport(): { readonly graph: Graph; readonly report: unknown } {
    const path = graphReport();
    if (!existsSync(path)) {
        throw new Error(graphReportMissing(relativePath(REPORT_KEY)));
    }
    const report: unknown = JSON.parse(readFileSync(path, "utf8"));
    const graph = isRecord(report) ? report["graph"] : null;
    if (!isGraph(graph)) {
        throw new Error(graphReportEmpty(relativePath(REPORT_KEY)));
    }
    return { graph, report };
};
