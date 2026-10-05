import { describe, expect, it } from "vitest";
import { parseClippyOutput } from "@govlab/quality/core/parsers/tool.clippy.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = [
    { reason: "compiler-artifact", target: { name: "polyglotfixture" } },
    {
        message: {
            code: { code: "clippy::too_many_arguments" },
            level: "warning",
            message: "this function has too many arguments (5/4)",
            spans: [{ column_start: 1, file_name: "src/main.rs", is_primary: true, line_start: 3 }],
        },
        reason: "compiler-message",
    },
    {
        message: {
            code: { code: "clippy::needless_return" },
            level: "warning",
            message: "unneeded return statement",
            spans: [
                {
                    column_start: 5,
                    file_name: "src/main.rs",
                    is_primary: true,
                    line_start: 5,
                    suggestion_applicability: "MachineApplicable",
                },
            ],
        },
        reason: "compiler-message",
    },
    { message: { code: null, level: "warning", message: "2 warnings emitted", spans: [] }, reason: "compiler-message" },
    { reason: "build-finished", success: true },
]
    .map((entry) => JSON.stringify(entry))
    .join("\n");

describe("parseClippyOutput", () => {
    it("maps only coded compiler-messages to gating (error, advisory:false) Findings", () => {
        const findings = parseClippyOutput(RECORDED, "rust");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 1,
            ecosystem: "rust",
            file: "src/main.rs",
            fixable: false,
            line: 3,
            ruleId: "clippy::too_many_arguments",
            severity: "error",
            tool: "clippy",
        });
    });

    it("marks a MachineApplicable diagnostic fixable", () => {
        const findings = parseClippyOutput(RECORDED, "rust");
        const needless = findings.find((finding) => finding.ruleId === "clippy::needless_return");
        expect(needless?.fixable).toBe(true);
    });

    it("drops control lines and codeless summary messages", () => {
        const findings = parseClippyOutput(RECORDED, "rust");
        expect(findings.every((finding) => finding.ruleId.startsWith("clippy::"))).toBe(true);
    });

    it("returns [] on empty or non-JSON output", () => {
        expect(parseClippyOutput("", "rust")).toEqual([]);
        expect(parseClippyOutput("not json\n{bad", "rust")).toEqual([]);
    });
});
