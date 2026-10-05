import { describe, expect, it } from "vitest";
import { invariantsOf, modelSeeds, slotWordsOf } from "@banes-lab/content/core/converters/invariant.converter.ts";

const TEMPLATE = [
    "**THE SLOTS, AND OMITTING ANY ONE LEAVES IT UNSTATED:** the PROPERTY in a form that could be false, since",
    "a statement nothing could contradict states nothing; the SET it quantifies over; and the PARTIES it binds.",
    "",
    "## Gate",
    "",
    "- An invariant stated with no objector fails unless it declares itself unheld.",
].join("\n");

const PARAGRAPH_MODEL = [
    "## The invariants",
    "",
    "### A declared lifetime is READ",
    "",
    "**PROPERTY** — every decision resolves from the declared lifetime, and never from",
    "the shape of its path. **SET** — every mechanism that scans. **PARTIES** — every author. **OBJECTOR** — a check comparing each",
    "operand against the declaration.",
    "",
    "### Prose only",
    "",
    "A section with no slots.",
].join("\n");

const BULLET_MODEL = [
    "## Invariant — the count is derived",
    "",
    "- **Property.** The count follows from the partition.",
    "- **Set.** Every allocation decision.",
    "- **Parties.** Whoever proposes a count.",
    "- **Its objector, named because the template forbids a statement nothing can contradict.** The partition is derived from a relation.",
].join("\n");

const WORDS = { objector: "objector", parties: "parties", property: "property", set: "set" };

describe("slotWordsOf", () => {
    it("takes three slot words from the slots sentence and the objector from the gate bullet", () => {
        expect(slotWordsOf(TEMPLATE)).toStrictEqual(WORDS);
    });

    it("returns null when the template names no slots", () => {
        expect(slotWordsOf("## Gate\n- nothing here")).toBeNull();
    });
});

describe("invariantsOf", () => {
    it("reads the bold-paragraph shape across wrapped lines and skips a block with no slots", () => {
        const found = invariantsOf(PARAGRAPH_MODEL, WORDS);
        expect(found).toHaveLength(1);
        expect(found[0]?.heading).toBe("A declared lifetime is READ");
        expect(found[0]?.property).toBe(
            "every decision resolves from the declared lifetime, and never from the shape of its path.",
        );
        expect(found[0]?.objector).toBe("a check comparing each operand against the declaration.");
    });

    it("reads the bulleted shape with a long objector label", () => {
        const found = invariantsOf(BULLET_MODEL, WORDS);
        expect(found).toHaveLength(1);
        expect(found[0]?.property).toBe("The count follows from the partition.");
        expect(found[0]?.objector).toBe("The partition is derived from a relation.");
    });
});

describe("modelSeeds", () => {
    it("names each seed by the model stem and the heading slug", () => {
        const seeds = modelSeeds([{ path: "surface/models/coupling.model.md", text: BULLET_MODEL }], WORDS);
        expect(seeds).toHaveLength(1);
        expect(seeds[0]?.id).toBe("coupling.invariant-the-count-is-derived");
        expect(seeds[0]?.source).toBe("model");
    });
});
