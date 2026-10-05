import {
    AGENT_MARKER,
    COORDINATORS,
    IMPERATIVE_OPENERS,
    IRREGULAR_PARTICIPLES,
    JOIN_CAP,
    NON_IMPERATIVE_OPENERS,
    NOT_PARTICIPLES,
    PARTICIPLE_MIN_LENGTH,
    PARTICIPLE_SUFFIX,
    PASSIVE_ADVERBS,
    PASSIVE_ADVERB_SUFFIX,
    PASSIVE_AUXILIARIES,
    SENTENCE_CAP,
    SENTENCE_TERMINALS,
    SENTENCE_WORD_STOPS,
} from "@ssot/govlab/shared/manifests/sentence.manifest.ts";
import { CANONICAL_TERMS, canonicalFor, synonymsOf } from "@ssot/govlab/shared/manifests/vocabulary.manifest.ts";
import type { CanonRule, FieldMood, TermRecord } from "@ssot/govlab/types/writing.types.ts";
import { LESSON_FIELD_MOODS, PROSE_LAYER } from "@ssot/govlab/shared/manifests/writing.prose.manifest.ts";
import {
    STRINGS_CHANNEL,
    WRITING_CANON,
    isCheckEnforced,
} from "@ssot/govlab/shared/manifests/writing.canon.manifest.ts";
import { describe, expect, it } from "vitest";
import { CARD_RULES } from "@ssot/govlab/shared/manifests/writing.card.manifest.ts";
import { COMPOSITION_RULES } from "@ssot/govlab/shared/manifests/writing.composition.manifest.ts";
import { DOCUMENT_LAYER } from "@ssot/govlab/shared/manifests/writing.document.manifest.ts";
import { IDENTIFIER_LAYER } from "@ssot/govlab/shared/manifests/writing.identifier.manifest.ts";
import { NOTE_LAYER } from "@ssot/govlab/shared/manifests/writing.note.manifest.ts";
import { OUTPUT_LAYER } from "@ssot/govlab/shared/manifests/writing.output.manifest.ts";
import { PUNCTUATION_POLICY } from "@ssot/govlab/shared/manifests/punctuation.manifest.ts";
import { ROOT_LAYER } from "@ssot/govlab/shared/manifests/writing.root.manifest.ts";
import { SENTENCE_RULES } from "@ssot/govlab/shared/manifests/writing.sentence.manifest.ts";
import { SHORT_LAYER } from "@ssot/govlab/shared/manifests/writing.short.manifest.ts";
import { SOURCE_RULES } from "@ssot/govlab/shared/manifests/writing.source.manifest.ts";
import { STRUCTURE_RULES } from "@ssot/govlab/shared/manifests/writing.structure.manifest.ts";
import { WORD_RULES } from "@ssot/govlab/shared/manifests/writing.word.manifest.ts";
import { firstTermIn } from "@ssot/govlab/shared/matchers/vocabulary.matcher.ts";

const CANON_RULES: readonly CanonRule[] = WRITING_CANON.flatMap((layer) => layer.rules);

describe("the writing canon", () => {
    it("records every rule once with a statement, a reason, and examples whose repair differs from the rejection", () => {
        const ids = CANON_RULES.map((rule) => rule.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const rule of CANON_RULES) {
            expect(rule.rule.length).toBeGreaterThan(0);
            expect(rule.why.length).toBeGreaterThan(0);
            for (const example of rule.examples) {
                expect(example.repaired).not.toBe(example.rejected);
            }
        }
    });

    it("composes one layer per file and folds each facet into the layer whose ids it carries", () => {
        const layers = [
            ROOT_LAYER,
            PROSE_LAYER,
            SHORT_LAYER,
            OUTPUT_LAYER,
            IDENTIFIER_LAYER,
            DOCUMENT_LAYER,
            NOTE_LAYER,
        ];
        expect(WRITING_CANON).toStrictEqual(layers);
        const facets: [typeof ROOT_LAYER, readonly CanonRule[]][] = [
            [ROOT_LAYER, COMPOSITION_RULES],
            [ROOT_LAYER, SENTENCE_RULES],
            [ROOT_LAYER, WORD_RULES],
            [SHORT_LAYER, CARD_RULES],
            [PROSE_LAYER, STRUCTURE_RULES],
            [PROSE_LAYER, SOURCE_RULES],
        ];
        for (const [layer, rules] of facets) {
            expect(rules.length).toBeGreaterThan(0);
            for (const rule of rules) {
                expect(layer.rules).toContain(rule);
                expect(rule.id.startsWith(`${layer.id}.`)).toBe(true);
            }
        }
    });

    it("derives the punctuation policy from the enforced checks rather than a second boolean", () => {
        expect(PUNCTUATION_POLICY.longDash).toBe(isCheckEnforced("no-long-dash", STRINGS_CHANNEL));
        expect(PUNCTUATION_POLICY.semicolon).toBe(isCheckEnforced("no-semicolon", STRINGS_CHANNEL));
        expect(PUNCTUATION_POLICY.digitMetric).toBe(isCheckEnforced("no-unmeasured-numbers", STRINGS_CHANNEL));
    });

    it("declares a mood for every lesson field it governs", () => {
        const moods: FieldMood[] = Object.values(LESSON_FIELD_MOODS);
        expect(moods.length).toBeGreaterThan(0);
        expect(LESSON_FIELD_MOODS["application"]).toBe("imperative");
        expect(LESSON_FIELD_MOODS["decision"]).toBe("declarative");
    });
});

describe("the sentence registry", () => {
    it("holds the caps, the terminals, the stops and the word classes as data", () => {
        expect(SENTENCE_CAP).toBeGreaterThan(JOIN_CAP);
        expect(SENTENCE_TERMINALS.has(".")).toBe(true);
        expect(SENTENCE_WORD_STOPS.has(" ")).toBe(true);
        expect(SENTENCE_WORD_STOPS.has("-")).toBe(false);
        expect(COORDINATORS.has("and")).toBe(true);
        expect(PASSIVE_AUXILIARIES.has("is")).toBe(true);
        expect(PASSIVE_ADVERBS.has("not")).toBe(true);
        expect(PASSIVE_ADVERB_SUFFIX).toBe("ly");
        expect(PARTICIPLE_SUFFIX).toBe("ed");
        expect(PARTICIPLE_MIN_LENGTH).toBeGreaterThan(PARTICIPLE_SUFFIX.length);
        expect(NOT_PARTICIPLES.has("indeed")).toBe(true);
        expect(IRREGULAR_PARTICIPLES.has("written")).toBe(true);
        expect(AGENT_MARKER).toBe("by");
        expect(IMPERATIVE_OPENERS.has("use")).toBe(true);
        expect(NON_IMPERATIVE_OPENERS.has("the")).toBe(true);
    });
});

describe("the term registry and its matcher", () => {
    const terms: TermRecord[] = [{ canonical: "gate", concept: "gate", synonyms: ["checker"] }];

    it("ships empty, flattens synonyms and resolves a synonym to its record", () => {
        expect(CANONICAL_TERMS).toHaveLength(0);
        expect(synonymsOf(terms)).toStrictEqual(["checker"]);
        expect(canonicalFor(terms, "checker")?.canonical).toBe("gate");
        expect(canonicalFor(terms, "gate")).toBeNull();
    });

    it("matches a term at word boundaries only", () => {
        expect(firstTermIn("The checker reports.", ["checker"])).toBe("checker");
        expect(firstTermIn("The checkerboard.", ["checker"])).toBeNull();
        expect(firstTermIn("A Checker, again", ["checker"])).toBe("checker");
    });
});
