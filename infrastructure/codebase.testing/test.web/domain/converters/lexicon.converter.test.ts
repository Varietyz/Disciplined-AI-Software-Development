import { describe, expect, it } from "vitest";
import { lexiconSections, termSubsection } from "@banes-lab/web/domain/converters/lexicon.converter.ts";
import type { Block } from "@banes-lab/web/types/block.types.ts";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";

const { resolution } = ONTOLOGY;

const textsOf = function textsOf(block: Block): string[] {
    if (block.kind === "text") {
        return [block.text];
    }
    if (block.kind === "list") {
        return [...block.items];
    }
    return block.kind === "glossary" ? block.entries.flatMap((entry) => [entry.term, entry.description]) : [];
};

const termOf = function termOf(category: string, id: string): (typeof ONTOLOGY.terms)[number]["terms"][number] {
    const found = ONTOLOGY.terms.find((group) => group.id === category)?.terms.find((term) => term.id === id);
    if (found === undefined) {
        throw new Error(`no term ${id}`);
    }
    return found;
};

describe("lexiconSections and termSubsection", () => {
    it("renders one section per category, sorted, and one anchored record per term carrying its kind and category as links", () => {
        const sections = lexiconSections(ONTOLOGY.terms, resolution);
        expect(sections).toHaveLength(ONTOLOGY.terms.length);
        expect(sections.reduce((total, section) => total + section.subsections.length, 0)).toBe(
            ONTOLOGY.terms.reduce((total, group) => total + group.terms.length, 0),
        );
        expect(sections.map((section) => section.title)).toStrictEqual(
            [...sections.map((section) => section.title)].sort((a, b) => a.localeCompare(b)),
        );
        const first = ONTOLOGY.terms[0]?.terms[0];
        if (first === undefined) {
            throw new Error("no terms");
        }
        const record = termSubsection(first, resolution);
        expect(record.id).toBe(`lexicon-${first.id}`);
        const chips = record.blocks?.[0];
        expect(chips?.kind === "list" ? chips.items[0] : "").toContain(`/ontology/schema#kind-${first.kind.label}`);
    });

    it("shows a placed tag's example as a row and a refused tag's rename as before and after blocks", () => {
        const placed = termSubsection(termOf("domain-concerns", "model-tag"), resolution);
        expect((placed.blocks ?? []).flatMap(textsOf)).toContain("models/order.model.ts");
        const renamed = termSubsection(termOf("refused-tags", "manager-as-a-tag"), resolution);
        const codes = (renamed.blocks ?? []).flatMap((block) => (block.kind === "code" ? [block.code] : []));
        expect(codes).toStrictEqual(["managers/audio.manager.ts", "coordinators/audio.coordinator.ts"]);
    });
});
