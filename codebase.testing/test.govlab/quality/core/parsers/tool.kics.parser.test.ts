import { describe, expect, it } from "vitest";
import { parseKicsReport } from "@govlab/quality/core/parsers/tool.kics.parser.ts";

const EXPECTED_COUNT = 3;
const THIRD = 2;

const RECORDED = JSON.stringify({
    queries: [
        {
            category: "Supply-Chain",
            description: "Setting state to latest performs an update.",
            files: [{ file_name: "govlab-governance/polyglot/ansible/playbook.yml", line: 7 }],
            query_name: "Unpinned Package Version",
            severity: "LOW",
        },
        {
            description: "World-writable file permissions.",
            files: [
                { file_name: "a.yml", line: 3 },
                { file_name: "b.yml", line: 9 },
            ],
            query_name: "Insecure Permissions",
            severity: "HIGH",
        },
    ],
});

describe("parseKicsReport", () => {
    it("expands each query×file pair into an advisory finding keyed by query name, severity mapped", () => {
        const findings = parseKicsReport(RECORDED, "ansible");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            ecosystem: "ansible",
            file: "govlab-governance/polyglot/ansible/playbook.yml",
            line: 7,
            ruleId: "Unpinned Package Version",
            severity: "error",
            tool: "kics",
        });
        expect(findings[1]).toMatchObject({
            advisory: true,
            line: 3,
            ruleId: "Insecure Permissions",
            severity: "error",
        });
        expect(findings[THIRD]).toMatchObject({
            advisory: true,
            file: "b.yml",
            line: 9,
            ruleId: "Insecure Permissions",
        });
    });

    it("returns [] on empty, no-queries, or non-JSON output", () => {
        expect(parseKicsReport("", "ansible")).toEqual([]);
        expect(parseKicsReport(JSON.stringify({ queries: [] }), "ansible")).toEqual([]);
        expect(parseKicsReport("not json", "ansible")).toEqual([]);
    });
});
