import { describe, expect, it } from "vitest";
import { streamReports, windowedReports } from "@govlab/patterns/core/pipelines/snapshot.pipeline.ts";
import { AnalysisGraph } from "@govlab/patterns/core/models/graph.model.ts";
import type { WindowSnapshot } from "@govlab/patterns/types/record.types.ts";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { report } from "@govlab/patterns/core/pipelines/record.pipeline.ts";
import { streamJsonlFile } from "@govlab/patterns/core/loaders/record.loader.ts";

const WINDOW = 2;
const TOTAL = 4;
const LOG_WINDOW = 8;
const SMALL = 100;
const LARGE = 1000;
const DISTINCT = 5;
const COLORS = ["red", "green", "blue", "amber", "violet"];
const FIXTURE = join(absolutePath("codebase.testing.govlab"), "patterns", "core", "pipelines", "agent.fixture.jsonl");

const records = function records(count = TOTAL): Record<string, unknown>[] {
    return Array.from({ length: count }, (_, index) => ({ color: COLORS[index % DISTINCT], score: index % DISTINCT }));
};

const collect = async function collect(
    source: AsyncIterable<unknown> | Iterable<unknown>,
    size: number,
): Promise<WindowSnapshot[]> {
    const snapshots: WindowSnapshot[] = [];
    for await (const snapshot of streamReports(source, size)) {
        snapshots.push(snapshot);
    }
    return snapshots;
};

const namesOf = function namesOf(snapshot: WindowSnapshot | undefined): Set<string> {
    return new Set((snapshot?.report.findings ?? []).map((finding) => finding.name));
};

describe("windowedReports", () => {
    it("emits one graph-valid snapshot per window with cumulative counts", () => {
        const snapshots = [...windowedReports(records(), WINDOW)];
        expect(snapshots.map((snapshot) => snapshot.count)).toStrictEqual([WINDOW, TOTAL]);
        for (const snapshot of snapshots) {
            const graph = new AnalysisGraph(snapshot.report.graph.nodes);
            expect(() => {
                graph.validate();
            }).not.toThrow();
        }
    });

    it("folds the whole set into one window when the size is not positive", () => {
        expect([...windowedReports(records(), 0)].map((snapshot) => snapshot.count)).toStrictEqual([TOTAL]);
    });
});

describe("streamReports", () => {
    it("streams a jsonl log lazily into rolling snapshots", async () => {
        const last = (await collect(streamJsonlFile(FIXTURE), LOG_WINDOW)).at(-1);
        expect(last?.report.headline.findings).toBeGreaterThan(0);
        expect(last?.report.schema.map((field) => field.name)).toContain("latencyMs");
    });

    it("emits one snapshot per record at window size one and converges on the batch report", async () => {
        const snapshots = await collect(records(SMALL), 1);
        expect(snapshots).toHaveLength(SMALL);
        const batch = report(records(SMALL));
        expect(namesOf(snapshots.at(-1))).toStrictEqual(new Set(batch.findings.map((finding) => finding.name)));
    });

    it("keeps the finding structure bounded by distinct values, not records", async () => {
        const small = (await collect(records(SMALL), 1)).at(-1);
        const large = (await collect(records(LARGE), 1)).at(-1);
        expect(namesOf(large)).toStrictEqual(namesOf(small));
    });
});
