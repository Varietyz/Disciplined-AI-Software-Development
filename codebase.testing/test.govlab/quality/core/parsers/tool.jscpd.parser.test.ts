import { expect, test } from "vitest";
import { parseJscpdOutput } from "@govlab/quality/core/parsers/tool.jscpd.parser.ts";

const SECOND_LINE = 9;

test("parseJscpdOutput reports each clone at its second copy and names the first", () => {
    const stdout = JSON.stringify({
        duplicates: [
            {
                firstFile: { name: "a.ts", start: { line: 3 } },
                secondFile: { name: "b.ts", start: { line: SECOND_LINE } },
            },
        ],
    });
    const [finding] = parseJscpdOutput(stdout, "typescript");
    expect(finding).toMatchObject({ file: "b.ts", line: SECOND_LINE, ruleId: "jscpd/duplicate", tool: "jscpd" });
    expect(finding?.message).toContain("a.ts:3");
    expect(parseJscpdOutput("not json", "typescript")).toStrictEqual([]);
});
