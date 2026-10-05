import { describe, expect, it } from "vitest";
import { REASONING_AXIS } from "@govlab/patterns/configuration/generated/axis.generated.ts";
import { reasoningRank } from "@govlab/patterns/core/resolvers/axis.resolver.ts";

describe("reasoningRank", () => {
    it("ranks every rung by its position on the reasoning axis", () => {
        REASONING_AXIS.forEach((rung, index) => {
            expect(reasoningRank(rung)).toBe(index);
        });
    });

    it("ranks observation below explanation", () => {
        expect(reasoningRank("observation")).toBeLessThan(reasoningRank("explanation"));
    });
});
