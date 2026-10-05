import { describe, expect, it } from "vitest";
import { profilePrinciples, profileSeeds } from "@banes-lab/content/core/converters/principle.converter.ts";

const PROFILE = [
    "# Identity",
    "",
    "A table.",
    "",
    "# How the work is reasoned",
    "",
    "Three principles.",
    "",
    "## The gate holds the line, not discipline",
    "",
    "Every rule ships with a check.",
    "A violation is appended to the rule.",
    "",
    "## The system describes itself",
    "",
    "Definitions own what; code owns how.",
    "",
    "# Engagement",
    "",
    "## Not a principle",
    "",
    "A table.",
].join("\n");

describe("profilePrinciples", () => {
    it("reads only the headings under the reasoning section, joining their paragraphs", () => {
        const principles = profilePrinciples(PROFILE);
        expect(principles.map((held) => held.heading)).toStrictEqual([
            "The gate holds the line, not discipline",
            "The system describes itself",
        ]);
        expect(principles[0]?.body).toBe("Every rule ships with a check. A violation is appended to the rule.");
    });

    it("returns nothing when the section is absent", () => {
        expect(profilePrinciples("# Identity\n\n## Heading\n\nBody")).toStrictEqual([]);
    });
});

describe("profileSeeds", () => {
    it("names each seed by the profile source and the heading slug and lands it on the mental model", () => {
        const seeds = profileSeeds(PROFILE);
        expect(seeds[0]?.id).toBe("profile.the-gate-holds-the-line-not-discipline");
        expect(seeds[0]?.level).toBe("mental-model");
        expect(seeds[1]?.principle).toBe("Definitions own what; code owns how.");
    });
});
