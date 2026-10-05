import {
    FIELD_SEPARATOR,
    FRONTMATTER_CLOSE,
    FRONTMATTER_OPEN,
    GENERATED_MARK_PREFIX,
    LINE_END,
    MARK_CLOSE,
    VERSION_PREFIX,
} from "@govlab/canonical-write/configuration/constants/mark.constants.ts";
import { bodyStartOf, markLineAt, parseMark } from "@govlab/canonical-write/core/selectors/mark.selector.ts";
import { describe, expect, it } from "vitest";

const LINE = `${GENERATED_MARK_PREFIX}2026-09-25T21:01Z${FIELD_SEPARATOR}${VERSION_PREFIX}7${MARK_CLOSE}`;
const BODY = "# Title\n\nFirst fact.\n";
const FRONTMATTER = `${FRONTMATTER_OPEN}type: reference${FRONTMATTER_CLOSE}`;

describe("bodyStartOf", () => {
    it("starts at zero with no frontmatter and after the frontmatter otherwise", () => {
        expect(bodyStartOf(BODY)).toBe(0);
        expect(bodyStartOf(`${FRONTMATTER}${BODY}`)).toBe(FRONTMATTER.length);
    });
});

describe("markLineAt", () => {
    it("spans the mark line at the body start, and finds none elsewhere", () => {
        expect(markLineAt(`${LINE}${LINE_END}${BODY}`)).toEqual({ end: LINE.length, start: 0 });
        expect(markLineAt(`${BODY}${LINE}`)).toBeNull();
    });
});

describe("parseMark", () => {
    it("reads the time and the version", () => {
        expect(parseMark(`${LINE}\n\n${BODY}`)).toEqual({ time: "2026-09-25T21:01Z", version: 7 });
    });

    it("answers null for a text with no mark or a malformed one", () => {
        expect(parseMark(BODY)).toBeNull();
        expect(parseMark(`${GENERATED_MARK_PREFIX}2026-09-25T21:01Z v0 -->\n`)).toBeNull();
        expect(parseMark(`${GENERATED_MARK_PREFIX}2026-09-25T21:01Z seven -->\n`)).toBeNull();
        expect(parseMark(`${GENERATED_MARK_PREFIX}2026-09-25T21:01Z v1\n`)).toBeNull();
    });
});
