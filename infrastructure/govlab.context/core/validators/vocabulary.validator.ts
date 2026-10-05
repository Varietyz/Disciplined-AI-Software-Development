import type { CrossFaceIssues, MisspelledForce } from "#types/validation.types";
import type { Faces } from "#types/context.types";
import { canonicalForceOf } from "#core/normalizers/vocabulary.normalizer";
import { classifyForce } from "#core/classifiers/vocabulary.classifier";

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

const misspelledForcesOf = function misspelledForcesOf(faces: Faces): MisspelledForce[] {
    const tokens = [
        ...faces.algo.all().flatMap((contract) => contract.force.map((token) => ({ record: contract.id, token }))),
        ...faces.arch.all().flatMap((principle) => principle.scope.map((token) => ({ record: principle.id, token }))),
    ];
    return tokens.flatMap(({ record, token }) => {
        const canonical = canonicalForceOf(token);
        return canonical === null ? [] : [{ canonical, record, token }];
    });
};

export const crossValidateFaces = function crossValidateFaces(faces: Faces): CrossFaceIssues {
    const archIds = new Set(faces.arch.ids());
    const forces = new Set(faces.algo.all().flatMap((contract) => contract.force));
    return {
        danglingPrincipleRefs: [...faces.algo.all(), ...faces.reason.techniques()]
            .filter(
                (record) =>
                    typeof record.principleRef === "string" &&
                    record.principleRef.length > 0 &&
                    !archIds.has(record.principleRef),
            )
            .map((record) => record.id)
            .toSorted(byName),
        misspelledForces: misspelledForcesOf(faces),
        unknownForces: [...forces].filter((force) => classifyForce(force) === "unknown").toSorted(byName),
    };
};
