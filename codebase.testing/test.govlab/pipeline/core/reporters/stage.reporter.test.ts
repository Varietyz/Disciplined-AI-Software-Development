import type { ReportRow, Stage } from "@govlab/pipeline/types/stage.types.ts";
import {
    abort,
    line,
    printHeader,
    printOutput,
    printReportSummary,
    printStageHeading,
    reportLine,
} from "@govlab/pipeline/core/reporters/stage.reporter.ts";
import { describe, expect, it, vi } from "vitest";
import process from "node:process";

const EXIT_STATUS = 3;
const RUN_LABEL = "verify-codebase";

const captured = function captured(run: () => void): string {
    const written: string[] = [];
    const spy = vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
        written.push(String(chunk));
        return true;
    });
    try {
        run();
    } finally {
        spy.mockRestore();
    }
    return written.join("");
};

const row = function row(over: Partial<ReportRow> = {}): ReportRow {
    return { code: 0, count: null, label: "step", out: "", stage: "prepare", ...over };
};

const stage = function stage(slug: string): Stage {
    return { label: slug, slug, steps: [] };
};

describe("line", () => {
    it("terminates the text it writes, and writes a bare newline when given nothing", () => {
        expect(
            captured(() => {
                line("text");
                line();
            }),
        ).toBe("text\n\n");
    });
});

describe("printOutput", () => {
    it("ends captured output on a newline without doubling one that is there", () => {
        expect(
            captured(() => {
                printOutput("a");
                printOutput("b\n");
            }),
        ).toBe("a\nb\n");
    });
});

describe("printStageHeading", () => {
    it("names the stage only on its first unit", () => {
        const unit = { firstInStage: true, from: 1, stage: stage("linting"), step: { run: "echo" }, to: 1 };
        expect(
            captured(() => {
                printStageHeading(unit);
            }),
        ).toContain("linting [linting]");
        expect(
            captured(() => {
                printStageHeading({ ...unit, firstInStage: false });
            }),
        ).toBe("");
    });
});

describe("printHeader", () => {
    it("states the run label, the step total and the stage count", () => {
        const out = captured(() => {
            printHeader({ activeCount: 2, bypassed: [], label: RUN_LABEL, scope: [], total: 7 });
        });
        expect(out).toContain(RUN_LABEL);
        expect(out).toContain("7 steps across 2 stage(s)");
    });

    it("names every bypassed stage, so a shortened run is visible", () => {
        const out = captured(() => {
            printHeader({
                activeCount: 1,
                bypassed: [stage("linting"), stage("validation")],
                label: RUN_LABEL,
                scope: [],
                total: 1,
            });
        });
        expect(out).toContain("linting");
        expect(out).toContain("validation");
        expect(out).toContain(", 2 bypassed");
    });

    it("names the scope when the run is narrowed to members", () => {
        const out = captured(() => {
            printHeader({ activeCount: 1, bypassed: [], label: RUN_LABEL, scope: ["quality", "pipeline"], total: 1 });
        });
        expect(out).toContain("scoped to quality + pipeline");
    });
});

describe("reportLine", () => {
    it("marks a passing step and carries its label", () => {
        expect(
            captured(() => {
                reportLine("  ", row({ label: "Typecheck" }));
            }),
        ).toContain("Typecheck");
    });

    it("names the exit code of a failing step", () => {
        expect(
            captured(() => {
                reportLine("  ", row({ code: 2 }));
            }),
        ).toContain("exit 2");
    });

    it("appends a counted total when the step reported one", () => {
        expect(
            captured(() => {
                reportLine("  ", row({ count: 41 }));
            }),
        ).toContain("(41)");
    });
});

describe("printReportSummary", () => {
    it("reports every step passing when none failed", () => {
        const out = captured(() => {
            printReportSummary([row(), row()], RUN_LABEL, Date.now());
        });
        expect(out).toContain("all 2 steps passed");
    });

    it("reports the failing fraction and replays each failure's captured output", () => {
        const out = captured(() => {
            printReportSummary([row(), row({ code: 1, out: "the captured trace" })], RUN_LABEL, Date.now());
        });
        expect(out).toContain("1/2 steps failed");
        expect(out).toContain("the captured trace");
    });

    it("totals counted violations across the run", () => {
        const out = captured(() => {
            printReportSummary([row({ count: 4 }), row({ count: 6 })], RUN_LABEL, Date.now());
        });
        expect(out).toContain("10 total violations counted");
    });
});

describe("abort", () => {
    it("names the failing step, its command and the steps not run, then exits with its status", () => {
        const exit = vi.spyOn(process, "exit").mockImplementation((): never => {
            throw new Error("exited");
        });
        try {
            const out = captured(() => {
                expect(() =>
                    abort({
                        command: "npx tsc --noEmit",
                        elapsed: "1.2",
                        label: RUN_LABEL,
                        notRun: 5,
                        status: EXIT_STATUS,
                        stepLabel: "Typecheck",
                        tag: "[1/9]",
                    }),
                ).toThrow("exited");
            });
            expect(out).toContain("Typecheck");
            expect(out).toContain("npx tsc --noEmit");
            expect(out).toContain("5 step(s) not run.");
            expect(exit).toHaveBeenCalledWith(EXIT_STATUS);
        } finally {
            exit.mockRestore();
        }
    });
});
