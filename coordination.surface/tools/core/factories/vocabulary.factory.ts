import type { Finding } from "../types/segment.types.ts";
import type { OffVocabulary } from "../types/vocabulary.types.ts";

export const offVocabularyFinding = function offVocabularyFinding({
    closed,
    declared,
    target,
}: OffVocabulary): Finding {
    return {
        actual: `${target} declares a ${declared.axis} value the closed set for that axis does not contain`,
        expected: closed.join(" "),
        healed: false,
        line: declared.line,
        locus: declared.axis,
        path: target,
        remediation: {
            action: "declare",
            decide: "state a value the closed set carries, or raise the missing one as an approved extension against the DECLARED set rather than writing it locally — a vocabulary that grows by one word per surface is not closed, and a value invented where it is USED is a second declaration of the set that disagrees with the first the moment either moves. A SET CLOSED IN ITS STATEMENT AND OPEN IN ITS CONTENTS IS THE FAILURE THIS OBSERVES: the statement reads as governed, every author can satisfy it, and nothing joins the declaration to the members, so a value outside it survives every reading by every party. THIS CHECK RESOLVES THE SET FROM THE PARAMETER SURFACE RATHER THAN CARRYING A COPY OF IT, so an extension is one edit to the declaration and reaches the check and every other consumer at once — the class surface states what the axes MEAN and the declaration states what their values ARE, which is one fact with one home and no transcription between them",
            deterministic: false,
            from: declared.value,
            target,
            to: null,
        },
        rule: "vocabulary/undeclaredValue",
        stack: [
            { check: "axis", resolved: declared.axis },
            { check: "declaredSet", resolved: closed.join(" ") },
            { check: "carried", resolved: declared.value },
            { check: "member", resolved: "no" },
        ],
    };
};
