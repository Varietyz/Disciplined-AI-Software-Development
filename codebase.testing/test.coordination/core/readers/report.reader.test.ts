import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { priorKindVerdicts, publishedKinds } from "coordination-surface/tools/core/readers/gate.reader.ts";
import { reportEntries, reportIdOf, reportsIn } from "coordination-surface/tools/core/readers/report.reader.ts";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import { REPORT_SUFFIX } from "coordination-surface/tools/core/constants/report.constants.ts";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const withReports = function withReports(files: Readonly<Record<string, string>>, check: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-reports-"));
    try {
        const dir = resolve(root, GENERATED_DIR);
        mkdirSync(dir, { recursive: true });
        for (const [name, text] of Object.entries(files)) {
            writeVerbatim(join(dir, name), text);
        }
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("reportIdOf, reportEntries and reportsIn", () => {
    it("list the reports in the generated folder and parse the ones holding an object", () => {
        withReports(
            {
                [`board${REPORT_SUFFIX}`]: JSON.stringify({ rule: "board" }),
                [`broken${REPORT_SUFFIX}`]: "{ not json",
                "notes.txt": "",
            },
            (root) => {
                assert.equal(reportIdOf(`board${REPORT_SUFFIX}`), "board");
                assert.deepEqual(reportEntries(root).toSorted(), [`board${REPORT_SUFFIX}`, `broken${REPORT_SUFFIX}`]);
                assert.deepEqual(
                    reportsIn(root).map((report) => [report.entry, report.value]),
                    [[`board${REPORT_SUFFIX}`, { rule: "board" }]],
                );
            },
        );
        const absentRoot = join(tmpdir(), "coordination-no-such-root");
        assert.deepEqual(reportEntries(absentRoot), []);
    });
});

describe("priorKindVerdicts and publishedKinds", () => {
    it("read the kind verdicts the last gate run published, keeping only textual states", () => {
        const report = JSON.stringify({ kindVerdicts: { "board/fence": "proven", odd: 3 } });
        withReports({ "gate.report.generated.json": report }, (root) => {
            assert.deepEqual(priorKindVerdicts(root), { "board/fence": "proven" });
            assert.deepEqual(publishedKinds(root), ["board/fence"]);
        });
        withReports({}, (root) => {
            assert.deepEqual(priorKindVerdicts(root), {});
        });
    });
});
