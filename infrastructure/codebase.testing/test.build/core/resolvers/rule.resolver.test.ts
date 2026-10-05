import { catalogRuleRecord, ruleRecordsOf } from "@banes-lab/build-scripts/core/resolvers/rule.resolver.ts";
import { describe, expect, it } from "vitest";

const TRANSIT = "architecture:encryption-in-transit";
const ACCESS = "architecture:access-control";

describe("ruleRecordsOf", () => {
    it("resolves a rule id to the one site record its canonical concepts declare", () => {
        const resolved = ruleRecordsOf(
            [
                { canonical: ["encryption-in-transit"], ruleId: "tls/only" },
                { canonical: ["encryption-in-transit", "access-control"], ruleId: "mixed/rule" },
                { ruleId: "bare/rule" },
            ],
            new Set([TRANSIT, ACCESS]),
        );
        expect(resolved.get("tls/only")).toBe(TRANSIT);
        expect(resolved.has("mixed/rule")).toBe(false);
        expect(resolved.has("bare/rule")).toBe(false);
    });

    it("merges the concepts every tool declares for one rule id", () => {
        const resolved = ruleRecordsOf(
            [
                { canonical: ["encryption-in-transit"], ruleId: "shared" },
                { canonical: ["access-control"], ruleId: "shared" },
            ],
            new Set([TRANSIT, ACCESS]),
        );
        expect(resolved.has("shared")).toBe(false);
    });
});

describe("catalogRuleRecord", () => {
    it("answers no record for a rule id when the site holds none of its records", () => {
        expect(catalogRuleRecord(new Set())("no-var")).toBeNull();
    });
});
