import { MINUTE_LENGTH, UTC_SUFFIX } from "@govlab/canonical-write/configuration/constants/mark.constants.ts";
import { composeMark, markTimeOf, parseMark, stampGenerated, stripMark } from "@govlab/canonical-write";
import { describe, expect, it } from "vitest";

const EARLIER = new Date("2026-09-25T21:01:42.000Z");
const LATER = new Date("2026-09-26T08:30:00.000Z");
const BODY = "# Title\n\nFirst fact.\n";
const CHANGED = "# Title\n\nSecond fact.\n";
const FRONTMATTER_BODY = "---\ntype: reference\n---\n\n# Title\n";

describe("markTimeOf", () => {
    it("keeps the minute and the UTC zone", () => {
        expect(markTimeOf(EARLIER)).toBe("2026-09-25T21:01Z");
        expect(markTimeOf(EARLIER)).toHaveLength(MINUTE_LENGTH + UTC_SUFFIX.length);
    });
});

describe("composeMark", () => {
    it("writes the line parseMark reads back", () => {
        const line = composeMark({ time: "2026-09-25T21:01Z", version: 7 });
        expect(line).toBe("<!-- Auto-generated 2026-09-25T21:01Z v7 -->");
        expect(parseMark(`${line}\n\n${BODY}`)).toEqual({ time: "2026-09-25T21:01Z", version: 7 });
    });
});

describe("stripMark", () => {
    it("removes the mark line and the blank lines after it", () => {
        expect(stripMark(`${composeMark({ time: "t", version: 1 })}\n\n${BODY}`)).toBe(BODY);
    });

    it("leaves a text with no mark unchanged", () => {
        expect(stripMark(BODY)).toBe(BODY);
    });
});

describe("stampGenerated", () => {
    it("starts a new file at version one with the current time", () => {
        expect(stampGenerated(BODY, "", EARLIER)).toBe(`<!-- Auto-generated 2026-09-25T21:01Z v1 -->\n\n${BODY}`);
    });

    it("keeps the held mark when the body is unchanged", () => {
        const first = stampGenerated(BODY, "", EARLIER);
        expect(stampGenerated(BODY, first, LATER)).toBe(first);
    });

    it("moves the time and bumps the version when the body changes", () => {
        const first = stampGenerated(BODY, "", EARLIER);
        expect(parseMark(stampGenerated(CHANGED, first, LATER))).toEqual({ time: "2026-09-26T08:30Z", version: 2 });
    });

    it("compares through the normalizer it is given", () => {
        const first = stampGenerated(BODY, "", EARLIER);
        const same = stampGenerated(CHANGED, first, LATER, () => "");
        expect(parseMark(same)).toEqual({ time: "2026-09-25T21:01Z", version: 1 });
    });

    it("keeps the held mark for an unchanged body with frontmatter", () => {
        const first = stampGenerated(FRONTMATTER_BODY, "", EARLIER);
        expect(stampGenerated(FRONTMATTER_BODY, first, LATER)).toBe(first);
    });

    it("reads a mark only at its anchored line, never one quoted in the body", () => {
        const quoted = `# Title\n\nThe mark reads \`${composeMark({ time: "t", version: 3 })}\`.\n`;
        expect(parseMark(quoted)).toBeNull();
        expect(stripMark(quoted)).toBe(quoted);
        expect(stampGenerated(quoted, "", EARLIER)).toBe(`<!-- Auto-generated 2026-09-25T21:01Z v1 -->\n\n${quoted}`);
    });

    it("places the mark after the frontmatter", () => {
        expect(stampGenerated(FRONTMATTER_BODY, "", EARLIER)).toBe(
            "---\ntype: reference\n---\n<!-- Auto-generated 2026-09-25T21:01Z v1 -->\n\n# Title\n",
        );
    });
});
