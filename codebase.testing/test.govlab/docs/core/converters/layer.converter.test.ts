import { describe, expect, it } from "vitest";
import { stripConcern, wrapLayer } from "@govlab/docs/core/converters/layer.converter.ts";

describe("wrapLayer and stripConcern", () => {
    it("wrap a body in its markers and strip exactly that layer back out", () => {
        const layer = wrapLayer("metrics", "stats");
        expect(layer).toBe("<!-- concern:metrics -->\nstats\n<!-- /concern:metrics -->");
        expect(stripConcern(`intro\n\n${layer}\n\noutro`, "metrics")).toBe("intro\n\noutro");
        expect(stripConcern(`intro\n\n${layer}`, "metrics")).toBe("intro\n");
        expect(stripConcern(layer, "metrics")).toBe("");
        expect(stripConcern("no layer", "metrics")).toBe("no layer");
    });
});
