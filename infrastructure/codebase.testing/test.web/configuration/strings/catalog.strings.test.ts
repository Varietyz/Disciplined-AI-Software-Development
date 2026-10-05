import {
    ADDRESS_GROUP_TITLES,
    COLLECTION_TITLES,
    CONTRACT_MEMBER,
    PRINCIPLE_MEMBER,
    TERM_MEMBER,
    addressGroupTitle,
    facetCollectionTitle,
    facetFieldTitle,
    facetTitle,
    forceSummary,
    forceTitleOf,
    groupSummary,
    groupTitleOf,
    listedInSentence,
    loopSummary,
    nameShardTitle,
    nodeSummary,
    recordCountPhrase,
    relationSummary,
    routeStopSentence,
    substrateSummary,
} from "@banes-lab/web/strings/catalog.strings";
import { describe, expect, it } from "vitest";
import { ONTOLOGY_FACES } from "@govlab/constants";
import { relationLabelOf } from "@banes-lab/web/strings/reference.strings";

describe("catalog strings", () => {
    it("titles every ontology collection and every other address group", () => {
        expect([...ONTOLOGY_FACES].every((collection) => COLLECTION_TITLES.has(collection))).toBe(true);
        expect([...ADDRESS_GROUP_TITLES.keys()].sort()).toStrictEqual(["anatomy", "api", "chapter"]);
    });

    it("writes counts and titles as phrases without a full stop", () => {
        expect(recordCountPhrase(1)).toBe("1 record");
        expect(recordCountPhrase(451)).toBe("451 records");
        expect(facetTitle("Architecture principles", "type", "anti-pattern")).toBe(
            "Architecture principles whose type is anti-pattern",
        );
        expect(addressGroupTitle("sections")).toBe("Every published address for sections");
        expect(nameShardTitle("s")).toBe("Name lookup entries for names that start with s");
        expect(facetCollectionTitle("Architecture principles")).toBe("Architecture principles by field");
        expect(facetFieldTitle("Architecture principles", "severity")).toBe("Architecture principles by severity");
    });

    it("labels a relation by its declared label and otherwise by its words", () => {
        expect(relationLabelOf("conflicts-with")).toBe("Conflicts with");
        expect(relationLabelOf("derived-by")).toBe("Named in the derivation of");
        expect(relationLabelOf("layer")).toBe("Layer");
        expect(relationLabelOf("detected-by-lens")).toBe("Detected by lens");
    });

    it("titles a group by its name, and a raw id through the title map", () => {
        expect(groupTitleOf("core-modular-design", "Core Modular Design")).toBe("Core Modular Design");
        expect(groupTitleOf("css-cascade", "css-cascade")).toBe("CSS cascade");
        expect(() => groupTitleOf("unmapped-domain", "unmapped-domain")).toThrow("unmapped-domain");
        expect(forceTitleOf("architecture_evolution")).toBe("Architecture evolution");
    });

    it("derives a summary sentence from each record's own fields", () => {
        expect(groupSummary("Core Modular Design", "category", 16, PRINCIPLE_MEMBER)).toBe(
            "The Core Modular Design category holds 16 architecture principles.",
        );
        expect(groupSummary("Core Vocabulary", "category", 1, TERM_MEMBER)).toBe(
            "The Core Vocabulary category holds 1 lexicon term.",
        );
        expect(groupSummary("Taxonomy", "domain", 12, CONTRACT_MEMBER)).toBe(
            "The Taxonomy domain holds 12 algorithm contracts.",
        );
        expect(forceSummary(73, 11)).toBe("73 algorithm contracts and 11 architecture principles name this force.");
        expect(forceSummary(7, 0)).toBe("7 algorithm contracts name this force.");
        expect(forceSummary(0, 1)).toBe("1 architecture principle names this force.");
        expect(relationSummary(["anti-pattern"])).toBe("This relation points only at anti-pattern records.");
        expect(relationSummary(["a", "b"])).toBe("This relation can point at 2 kinds of record.");
        expect(nodeSummary("anomaly", "analysis", "dynamical-systems")).toBe(
            "This node covers the anomaly concept on the analysis axis. Its mathematical type is dynamical systems.",
        );
        expect(substrateSummary("substrate", "optimization", ["Ontogenesis", "Cognition"])).toBe(
            "This node sits on the substrate layer. Its mathematical type is optimization. The Ontogenesis and Cognition models build on it.",
        );
        expect(substrateSummary("substrate", "graph", [])).toBe(
            "This node sits on the substrate layer. Its mathematical type is graph.",
        );
        expect(loopSummary("Derivation Loop", ["Orient", "Act", "Terminate"])).toBe(
            "The derivation loop runs through 3 stages, from Orient to Terminate.",
        );
    });

    it("places a leaf in the index that lists it, with the neighbors it has", () => {
        expect(listedInSentence("[I](i)", "[A](a)", "[C](c)")).toBe(
            "Listed in [I](i), after [A](a) and before [C](c).",
        );
        expect(listedInSentence("[I](i)", null, "[C](c)")).toBe("Listed in [I](i), before [C](c).");
        expect(listedInSentence("[I](i)", null, null)).toBe("Listed in [I](i).");
    });

    it("places a section on the learning route with the neighbors it has", () => {
        expect(routeStopSentence(3, 102, "[B](b)", "[D](d)")).toBe(
            "This section is stop 3 of 102 in the learning route, after [B](b) and before [D](d).",
        );
        expect(routeStopSentence(1, 102, null, "[B](b)")).toBe(
            "This section is stop 1 of 102 in the learning route, before [B](b).",
        );
        expect(routeStopSentence(1, 1, null, null)).toBe("This section is stop 1 of 1 in the learning route.");
    });
});
