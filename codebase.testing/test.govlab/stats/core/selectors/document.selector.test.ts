import {
    CENSUS_FILE,
    FRONTMATTER_FENCE,
    NO_STATUS,
    README_NAME,
    ROOT_FORM,
    STATUS_KEY,
    UNSPECIFIED_MATURITY,
} from "@govlab/stats/configuration/constants/document.constants.ts";
import { describe, expect, it } from "vitest";
import { frontmatterValue } from "@govlab/stats/core/selectors/document.selector.ts";

const DOC = `${FRONTMATTER_FENCE}\nname: probe\n${STATUS_KEY}: current\n${FRONTMATTER_FENCE}\n\n# Title\n`;

describe("frontmatterValue", () => {
    it("reads a declared key and stops at the closing fence", () => {
        expect(frontmatterValue(DOC, STATUS_KEY)).toBe("current");
        expect(frontmatterValue(DOC, "member")).toBeNull();
        expect(frontmatterValue("# Title\n\nstatus: current\n", STATUS_KEY)).toBeNull();
        expect(frontmatterValue("---\nname: probe\n---\nstatus: body\n", STATUS_KEY)).toBeNull();
    });
});

describe("the document fallbacks", () => {
    it("are distinct words, so a missing status never reads as a form or a maturity", () => {
        expect(new Set([NO_STATUS, ROOT_FORM, UNSPECIFIED_MATURITY]).size).toBe(3);
        expect(CENSUS_FILE.endsWith(".generated.md")).toBe(true);
        expect(README_NAME).toBe("README.md");
    });
});
