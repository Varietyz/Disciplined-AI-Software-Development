import {
    MALFORMED_ROOT,
    MISSING_VIEWBOX,
    forbiddenToken,
} from "@govlab/patterns/configuration/strings/markup.strings.ts";
import { assertHardened, hardenIssues } from "@govlab/patterns/core/validators/markup.validator.ts";
import { describe, expect, it } from "vitest";

const SAFE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"></svg>';

describe("the markup hardening check", () => {
    it("passes a bounded, script-free SVG", () => {
        expect(hardenIssues(SAFE)).toStrictEqual([]);
        expect(() => {
            assertHardened(SAFE, "safe");
        }).not.toThrow();
    });

    it("names every forbidden token, a missing viewBox and a malformed root", () => {
        expect(hardenIssues("<g><script/></g>")).toStrictEqual([
            forbiddenToken("<script"),
            MISSING_VIEWBOX,
            MALFORMED_ROOT,
        ]);
        expect(() => {
            assertHardened("<g/>", "broken");
        }).toThrow("broken");
    });
});
