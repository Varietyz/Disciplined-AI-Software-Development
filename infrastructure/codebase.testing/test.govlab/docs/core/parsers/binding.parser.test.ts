import { declaredSlotsOf, slotFamiliesOf, slotRefs } from "@govlab/docs/core/parsers/binding.parser.ts";
import { describe, expect, it } from "vitest";

const ADAPTER = [
    "| `{gate}` | the gate |",
    "| `{project.agent_registry}` | the agents folder |",
    "| `{convention.cache_ttl_days}` | **absent** |",
    "a prose mention of {project.unticked} is not a declaration",
].join("\n");

const CORE = [
    "Read {project.agent_registry} and {project.invented_slot}.",
    "Run {gate} and {convention.cache_ttl_days}.",
    "A wildcard {project.*} and a placeholder {t.id} or {{workflow_name}} are not slots.",
].join("\n");

const byName = function byName(left: string, right: string): number {
    return left.localeCompare(right);
};

describe("declaredSlotsOf and slotFamiliesOf", () => {
    it("declares only backticked slots, and the families are their roots", () => {
        const declared = declaredSlotsOf(ADAPTER);
        expect([...declared].toSorted(byName)).toStrictEqual([
            "convention.cache_ttl_days",
            "gate",
            "project.agent_registry",
        ]);
        expect([...slotFamiliesOf(declared)].toSorted(byName)).toStrictEqual(["convention", "gate", "project"]);
    });
});

describe("slotRefs", () => {
    it("reads the slots of a declared family and skips placeholders and wildcards", () => {
        const declared = declaredSlotsOf(ADAPTER);
        const refs = slotRefs(CORE, slotFamiliesOf(declared)).map((found) => found.slot);
        expect(refs).toStrictEqual([
            "project.agent_registry",
            "project.invented_slot",
            "gate",
            "convention.cache_ttl_days",
        ]);
        expect(refs.filter((slot) => !declared.has(slot))).toStrictEqual(["project.invented_slot"]);
    });
});
