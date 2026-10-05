import { STATE_LEGEND, walkSubtitle } from "@govlab/patterns/configuration/strings/walk.strings.ts";
import { describe, expect, it } from "vitest";
import { STATE_COLOR } from "@govlab/patterns/configuration/tokens/walk.tokens.ts";

const STEPS = 12;

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

describe("the walk strings", () => {
    it("count the steps of a walk in its subtitle", () => {
        expect(walkSubtitle(STEPS)).toBe("12 steps · follow the arrows");
    });

    it("label every state that carries a color", () => {
        expect(STATE_LEGEND.map((item) => item.state).toSorted(byName)).toStrictEqual(
            [...STATE_COLOR.keys()].toSorted(byName),
        );
    });
});
