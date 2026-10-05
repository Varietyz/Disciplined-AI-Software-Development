import { describe, expect, it } from "vitest";
import { GENERATED_MARK_PREFIX } from "@govlab/canonical-write";
import type { ToneBaseline } from "@banes-lab/content/types/tone.types.ts";
import { renderBaseline } from "@banes-lab/content/core/renderers/baseline.renderer.ts";

const BASELINE: ToneBaseline = {
    modules: [
        {
            agentlessPassives: 1,
            bannedTerms: 1,
            chainedSentences: 2,
            collectivePerson: 0,
            digitMetrics: 2,
            firstPerson: 3,
            labeledItems: 4,
            literals: 10,
            longDashes: 5,
            longestSentence: 12,
            module: "fixture.strings.ts",
            secondPerson: 6,
            semicolons: 7,
            sentences: 8,
            words: 40,
        },
    ],
};

describe("renderBaseline", () => {
    const rendered = renderBaseline(BASELINE);

    it("opens with frontmatter carrying the document's type, name, concern and status", () => {
        expect(rendered.startsWith("---\ntype: reference\nname: tone-baseline\n")).toBe(true);
        expect(rendered).toContain("concern: product\nstatus: current\n---");
    });

    it("carries one row per module with the mean words per sentence, and leaves the generated mark to the writer", () => {
        expect(rendered).not.toContain(GENERATED_MARK_PREFIX);
        expect(rendered).toContain(
            "| fixture.strings.ts | 10 | 8 | 5.0 | 12 | 1 | 2 | 5 | 7 | 2 | 1 | 3 | 6 | 0 | 4 |",
        );
    });
});
