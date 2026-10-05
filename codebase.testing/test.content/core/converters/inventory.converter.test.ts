import { describe, expect, it } from "vitest";
import { lineCount, scanRules } from "@banes-lab/content/core/converters/inventory.converter.ts";

const SOURCE = "policy.md";

const FIXTURE = [
    "# Title",
    "",
    "## Always",
    "",
    "- `claims_need_evidence`: a developer claim stays unverified until the file is read.",
    "- `no_version_control` (LOCKED PROTOCOL): never run a version-control command.",
    "- `single source of truth`: a threshold lives in the gate's config and nowhere else.",
    "- `caught_means_fixed` (LOCKED): a violation is fixed in the same turn · gate: conduct",
    "**The gate holds the line, not discipline** — `gate_every_pattern` (LOCKED PROTOCOL): a pattern ships its check.",
    "Each rule is one line — `` `slug`: directive `` — no scaffolding.",
    "`STAGES` governs the run.",
    "RULE no_fallback: NEVER fallback (debt) → ALWAYS fail-fast (clarity)",
    "RULE no_for_now: NEVER for_now (deferring→forgetting) → ALWAYS now (immediacy→continuity)",
].join("\n");

describe("scanRules", () => {
    const records = scanRules(FIXTURE, SOURCE);
    const bySlug = new Map(records.map((record) => [record.slug, record]));

    it("records a list-marker rule with its tier and directive", () => {
        const record = bySlug.get("claims_need_evidence");
        expect(record?.tier).toBe("Always");
        expect(record?.directive).toBe("a developer claim stays unverified until the file is read.");
        expect(record?.locked).toBe(false);
        expect(record?.gate).toBeNull();
    });

    it("reads the locked marker in both spellings", () => {
        expect(bySlug.get("no_version_control")?.locked).toBe(true);
        expect(bySlug.get("caught_means_fixed")?.locked).toBe(true);
    });

    it("keeps a slug with spaces verbatim", () => {
        expect(bySlug.has("single source of truth")).toBe(true);
    });

    it("splits the gate tail off the directive", () => {
        const record = bySlug.get("caught_means_fixed");
        expect(record?.gate).toBe("conduct");
        expect(record?.directive).toBe("a violation is fixed in the same turn");
    });

    it("accepts a slug after a bold lead-in", () => {
        expect(bySlug.get("gate_every_pattern")?.locked).toBe(true);
    });

    it("ignores prose that merely mentions the rule shape or a backticked name", () => {
        expect(bySlug.has("")).toBe(false);
        expect(bySlug.has("STAGES")).toBe(false);
    });

    it("splits an avoidance line on the arrow outside parentheses", () => {
        const record = bySlug.get("no_for_now");
        expect(record?.kind).toBe("avoidance");
        expect(record?.never).toBe("for_now (deferring→forgetting)");
        expect(record?.always).toBe("now (immediacy→continuity)");
        expect(bySlug.get("no_fallback")?.always).toBe("fail-fast (clarity)");
    });
});

describe("lineCount", () => {
    it("counts every line of the source", () => {
        expect(lineCount("a\nb\nc")).toBe(3);
    });
});
