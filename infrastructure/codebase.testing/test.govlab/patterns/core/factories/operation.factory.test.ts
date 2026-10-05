import { createInterventionBridge, proposerFromRules } from "@govlab/patterns/core/factories/operation.factory.ts";
import { describe, expect, it } from "vitest";
import type { Intervention } from "@govlab/patterns/types/operation.types.ts";
import { NO_APPLY_HANDLER } from "@govlab/patterns/configuration/strings/operation.strings.ts";
import { analyze } from "@govlab/patterns/core/pipelines/record.pipeline.ts";

const rules = new Map([["uniformity", "review-distribution"]]);
const { findings } = analyze([{ color: "red" }, { color: "red" }, { color: "blue" }]);

describe("the intervention bridge", () => {
    it("proposes an intervention for each finding a rule names", () => {
        const proposals = createInterventionBridge({ propose: proposerFromRules(rules) }).propose(findings);
        expect(proposals.length).toBeGreaterThan(0);
        expect(proposals.every((proposal) => proposal.action === "review-distribution")).toBe(true);
    });

    it("applies interventions through the injected handler", async () => {
        const applied: Intervention[] = [];
        const bridge = createInterventionBridge({
            async apply(intervention) {
                await Promise.resolve();
                applied.push(intervention);
                return { applied: true, detail: "ok", intervention };
            },
            propose: proposerFromRules(rules),
        });
        const results = await bridge.apply(bridge.propose(findings));
        expect(results.every((result) => result.applied)).toBe(true);
        expect(applied).toHaveLength(results.length);
    });

    it("proposes nothing and applies nothing when no handlers are wired", async () => {
        const bridge = createInterventionBridge();
        expect(bridge.propose(findings)).toStrictEqual([]);
        const [result] = await bridge.apply([{ action: "a", field: "f", finding: "n", rationale: "r" }]);
        expect(result?.detail).toBe(NO_APPLY_HANDLER);
    });
});
