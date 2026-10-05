import { CLOSED, declaredIn } from "../core/analyzers/vocabulary.analyzer.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import type { OffVocabulary } from "../core/types/vocabulary.types.ts";
import { lifetime } from "../../config/surface.config.ts";
import { offVocabularyFinding } from "../core/factories/vocabulary.factory.ts";

const MARKDOWN = ".md";

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const declaring = context.paths
            .filter((target) => target.endsWith(MARKDOWN))
            .map((target) => ({ declarations: declaredIn(context.read(target)), target }))
            .filter((entry) => entry.declarations.length > 0);
        const walked = declaring.map((entry) => entry.target);

        const off: OffVocabulary[] = declaring.flatMap((entry) =>
            entry.declarations
                .map((declared) => ({ closed: CLOSED[declared.axis] ?? [], declared, target: entry.target }))
                .filter((candidate) => !candidate.closed.includes(candidate.declared.value)),
        );
        const offVocabulary = off.map(
            (entry) => `${entry.target}:${String(entry.declared.line)} ${entry.declared.axis}`,
        );
        const findings = off.map(offVocabularyFinding);

        return {
            derivations: {
                axes: Object.keys(CLOSED),
                columnSource:
                    "THE TWO COLUMN LABELS THAT IDENTIFY A DECLARING TABLE ARE READ FROM THE PARAMETER SURFACE, THE WAY THE MEMBER SETS ALREADY ARE, so this check transcribes no part of the schema it enforces. A declaring table is recognized by its own header naming an axis column and a value column; holding those two words as literals here was the same construct this check removed from its axis matching — a schema copied into a mechanism, which fails identically the moment a surface relabels its columns, dropping that surface out of the population silently while the walk stays green over it. The smallest possible registry is still a registry, and what made the earlier form deficient was position rather than size: it sat INSIDE the mechanism rather than beside the vocabulary it belongs to. One declaration now names the axes, their members and the columns that carry them, so a relabeling is one edit that reaches this check and every other consumer at once",
                offVocabulary,
                population:
                    "every markdown surface in this run's path set carrying a table whose OWN HEADER declares an axis column and a value column, which is the surface stating where its declarations live rather than this check matching an axis by an English spelling it carries. THE SPELLING FORM WAS THE DEFECT AND IT FAILED IN BOTH DIRECTIONS: a hardcoded set of axis names is a name list inside a check about closed vocabularies, so a surface reworded its rows and fell silently out of the population while the walk stayed green, and widening the match to any word made every prose cell mentioning an axis word into a declaration. The header is the surface's own identity for its columns, so a declaring table is recognized however its cells are worded and a prose table is outside by construction. A surface that DEFINES the axes without declaring a lifetime carries no value column and is therefore outside — which is correct rather than an exclusion, since it declares nothing for this check to test",
                range: "the check decides MEMBERSHIP and claims nothing more: whether the value the surface carries is one the set contains, never whether it is the RIGHT value for that surface, which is a reading of the surface and stays with its author. An axis the set does not cover contributes no comparison rather than a passing one, so a new axis is unmeasured here until its set arrives — an unmeasured axis and a satisfied one are different states and collapsing them is the defect this whole venue named",
                surfacesCarryingADeclaration: walked,
                valueKinds:
                    "a value cell resolves to one of three kinds and only the last is a finding. It STATES THE SET where every one of its separated tokens is a member and there is more than one — the surface exhibiting the vocabulary rather than using it. It DEFINES the axis where the cell is more than one word, which is prose about what the axis separates and carries no claim a member could satisfy. It USES a value where the cell is a single word, and that is the only kind compared against the set. The definition kind is the one this walk lacked, and its absence made a surface that DESCRIBES an axis indistinguishable from one declaring an off-vocabulary value for it",
                vocabularySource: lifetime.vocabulary,
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant:
        "a surface declaring a lifetime axis carries a value the closed set for that axis contains, so a vocabulary closed in its statement and open in its contents fails rather than reading as governed",
    jurisdiction: "all",
    kinds: ["undeclaredValue"],

    stage: "content",
};
