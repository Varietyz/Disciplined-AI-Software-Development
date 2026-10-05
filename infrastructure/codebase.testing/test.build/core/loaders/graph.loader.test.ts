import { describe, expect, it, vi } from "vitest";
import { graphReportEmpty, graphReportMissing } from "@banes-lab/build-scripts/configuration/strings/graph.strings.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { readGraphReport } from "@banes-lab/build-scripts/core/loaders/graph.loader.ts";
import { relativePath } from "@ssot/paths";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const report = vi.hoisted(() => ({ file: "" }));

vi.mock("@banes-lab/build-scripts/core/resolvers/catalog.resolver.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    graphReport: () => report.file,
}));

const LOCATION = relativePath("govlabHost.reports.content.graph");

const reportAt = function reportAt(text: string | null): void {
    const dir = mkdtempSync(join(tmpdir(), "banes-lab-graph-"));
    const file = join(dir, "graph.report");
    report.file = file;
    if (text !== null) {
        writeVerbatim(file, text);
    }
};

describe("readGraphReport", () => {
    it("refuses a missing report and one that carries no graph, and returns the graph of a whole one", () => {
        reportAt(null);
        expect(() => readGraphReport()).toThrow(graphReportMissing(LOCATION));
        reportAt('{"graph":{"nodes":[]}}');
        expect(() => readGraphReport()).toThrow(graphReportEmpty(LOCATION));
        reportAt('{"graph":{"edges":[],"nodes":[]}}');
        expect(readGraphReport().graph).toStrictEqual({ edges: [], nodes: [] });
    });
});
