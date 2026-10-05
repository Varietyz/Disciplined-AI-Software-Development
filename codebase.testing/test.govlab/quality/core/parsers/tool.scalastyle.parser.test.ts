import { describe, expect, it } from "vitest";
import { parseScalastyleXml } from "@govlab/quality/core/parsers/tool.scalastyle.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<checkstyle version="5.0">',
    String.raw` <file name="D:\proj\scala\Bad.scala">`,
    '  <error column="18" line="6" source="org.scalastyle.scalariform.NullChecker" severity="error" message="Avoid using null"/>',
    '  <error line="3" source="org.scalastyle.scalariform.MagicNumberChecker" severity="warning" message="Magic Number found: 42"/>',
    " </file>",
    "</checkstyle>",
].join("\n");

describe("parseScalastyleXml", () => {
    it("maps each <error> to a gating (advisory:false) finding keyed by its source, bound to its <file>", () => {
        const findings = parseScalastyleXml(RECORDED, "scala");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 18,
            ecosystem: "scala",
            file: "D:\\proj\\scala\\Bad.scala",
            line: 6,
            message: "Avoid using null",
            ruleId: "org.scalastyle.scalariform.NullChecker",
            severity: "error",
            tool: "scalastyle",
        });
        expect(findings[1]).toMatchObject({
            advisory: false,
            column: 1,
            line: 3,
            ruleId: "org.scalastyle.scalariform.MagicNumberChecker",
            severity: "error",
        });
    });

    it("returns [] on empty or error-free XML", () => {
        expect(parseScalastyleXml("", "scala")).toEqual([]);
        expect(parseScalastyleXml('<checkstyle version="5.0"></checkstyle>', "scala")).toEqual([]);
    });
});
