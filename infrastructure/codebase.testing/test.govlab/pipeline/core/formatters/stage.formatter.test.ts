import { describe, expect, it } from "vitest";
import { seconds } from "@govlab/pipeline/core/formatters/stage.formatter.ts";

const MS_PER_SECOND = 1000;
const FIVE_SECONDS = 5 * MS_PER_SECOND;

describe("seconds", () => {
    it("reports elapsed seconds to one decimal", () => {
        expect(seconds(Date.now() - FIVE_SECONDS)).toBe("5.0");
    });

    it("reports a span that just started as zero", () => {
        expect(seconds(Date.now())).toBe("0.0");
    });
});
