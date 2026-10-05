import { REF_COLLECTIONS, createGovlabContext } from "@govlab/context";
import { describe, expect, it } from "vitest";
import { ontologyRefs } from "@govlab/docs/core/parsers/ontology.parser.ts";

const DOC = [
    "---",
    "name: sample",
    "---",
    "",
    "The check `reasoning:invariant:epi-reachable-check` joins `architecture:caching` and `lexicon:silent-failure`.",
    "A placeholder `reasoning:<kind>:<id>` and a bare word `architecture:` are not refs.",
    "A planted `reasoning:invariant:epi-no-such-invariant` and `architecture:no-such-principle` must fail.",
    "",
    "```text",
    "`architecture:inside-a-fence` is code, not a ref",
    "```",
].join("\n");

describe("ontologyRefs", () => {
    it("finds every collection-prefixed ref outside code and skips placeholders", () => {
        expect(ontologyRefs(DOC, REF_COLLECTIONS).map((found) => found.ref)).toStrictEqual([
            "reasoning:invariant:epi-reachable-check",
            "architecture:caching",
            "lexicon:silent-failure",
            "reasoning:invariant:epi-no-such-invariant",
            "architecture:no-such-principle",
        ]);
    });

    it("hands the context resolver refs it resolves and refs it refuses", () => {
        const { resolveRef } = createGovlabContext();
        expect(resolveRef("reasoning:invariant:epi-reachable-check")).toBe(true);
        expect(resolveRef("architecture:caching")).toBe(true);
        expect(resolveRef("reasoning:invariant:epi-no-such-invariant")).toBe(false);
        expect(resolveRef("architecture:no-such-principle")).toBe(false);
    });
});
