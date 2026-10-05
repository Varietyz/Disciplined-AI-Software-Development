import { describe, expect, it } from "vitest";
import { parseClangTidyOutput } from "@govlab/quality/core/parsers/tool.clang-tidy.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = [
    String.raw`D:\GIT\govlab\cpp\bad.cpp:2:14: warning: use nullptr [modernize-use-nullptr]`,
    "    2 |     int* p = 0;",
    "      |              ^",
    "      |              nullptr",
    "src/x.cpp:5:3: error: use of undeclared identifier 'foo' [clang-diagnostic-error]",
].join("\n");

describe("parseClangTidyOutput", () => {
    it("parses each diagnostic to an ADVISORY finding (advisory:true), keeping a Windows drive path and reading the check id", () => {
        const findings = parseClangTidyOutput(RECORDED, "cpp");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 14,
            ecosystem: "cpp",
            file: "D:\\GIT\\govlab\\cpp\\bad.cpp",
            line: 2,
            ruleId: "modernize-use-nullptr",
            severity: "error",
            tool: "clang-tidy",
        });
        expect(findings[1]).toMatchObject({
            advisory: true,
            file: "src/x.cpp",
            line: 5,
            ruleId: "clang-diagnostic-error",
            severity: "error",
        });
    });

    it("takes the EARLIEST severity marker, so a warning whose message contains ': error: ' is not dropped", () => {
        const findings = parseClangTidyOutput(
            "foo.cpp:3:5: warning: do not write : error: in text [readability-x]",
            "cpp",
        );
        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            column: 5,
            file: "foo.cpp",
            line: 3,
            ruleId: "readability-x",
            severity: "error",
        });
    });

    it("drops snippet/caret lines and returns [] on empty or marker-less output", () => {
        expect(parseClangTidyOutput("", "cpp")).toEqual([]);
        expect(parseClangTidyOutput("5 warnings generated.\n    2 |     int* p = 0;", "cpp")).toEqual([]);
    });
});
