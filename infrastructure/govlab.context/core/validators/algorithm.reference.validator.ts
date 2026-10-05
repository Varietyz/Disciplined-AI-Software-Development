import type { AlgoContractView, GrammarGroundingFaces } from "#types/reference.types";
import {
    DOMAIN_CONCEPT_CATEGORIES,
    GATE_SUFFIX,
    REASON_PREFIX,
    REF_SEPARATOR,
} from "#configuration/constants/reference.constants";
import { bareReasonId, kindRefResolves, kindsHolding } from "#core/resolvers/reference.resolver";

export const ungroundedGatesOf = function ungroundedGatesOf(faces: {
    algo: { all: () => AlgoContractView[] };
}): string[] {
    return faces.algo
        .all()
        .filter(
            (contract) =>
                contract.id.endsWith(GATE_SUFFIX) &&
                !DOMAIN_CONCEPT_CATEGORIES.has(contract.domain) &&
                (contract.grounds ?? []).length === 0,
        )
        .map((contract) => contract.id)
        .toSorted((a, b) => a.localeCompare(b));
};

export const unresolvedGrammarGroundsOf = function unresolvedGrammarGroundsOf(
    faces: GrammarGroundingFaces,
): { from: string; target: string }[] {
    const kindMembers = faces.reason.kindMembers();
    return faces.algo.all().flatMap((contract) =>
        (contract.grounds ?? [])
            .filter((target) => {
                const id = bareReasonId(target);
                return id.includes(REF_SEPARATOR)
                    ? !kindRefResolves(kindMembers, `${REASON_PREFIX}${id}`)
                    : faces.reason.resolve(id) === null;
            })
            .map((target) => ({ from: contract.id, target })),
    );
};

export const ambiguousReasonRefsOf = function ambiguousReasonRefsOf(
    faces: GrammarGroundingFaces,
): { from: string; kinds: string[]; target: string }[] {
    const kindMembers = faces.reason.kindMembers();
    return faces.algo.all().flatMap((contract) =>
        (contract.grounds ?? []).flatMap((target) => {
            const bare = bareReasonId(target);
            const kinds = bare.includes(REF_SEPARATOR) ? [] : kindsHolding(kindMembers, bare);
            return kinds.length > 1 ? [{ from: contract.id, kinds, target }] : [];
        }),
    );
};
