import { describe, expect, it } from "vitest";
import {
    hardeningAbort,
    hardeningLine,
    hardeningMessage,
    nonAsciiDetail,
    parenDetail,
    parserUnavailable,
    reservedDetail,
} from "@govlab/docs/configuration/strings/diagram.strings.ts";
import { unmatched } from "./strings.fixture.ts";

const EM_DASH = 0x20_14;

describe("the diagram strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [nonAsciiDetail(EM_DASH), "U+2014"],
                [parenDetail("("), "'('"],
                [reservedDetail("["), "'['"],
                [hardeningAbort("a.md", "  line 1"), "a.md failed hardening"],
                [hardeningLine(4, "paren", "detail"), "line 4: [paren] detail"],
                [hardeningMessage("paren", "detail"), "[paren] detail"],
                [parserUnavailable("no grammar"), "(no grammar)"],
            ]),
        ).toStrictEqual([]);
    });
});
