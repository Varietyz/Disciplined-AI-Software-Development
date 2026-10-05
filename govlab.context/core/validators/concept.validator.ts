import { CONCEPTS, VARIANTS } from "#configuration/constants/concept.constants";
import type { UnresolvedConceptRef, VariantId } from "#types/concept.types";

export const unresolvedConceptRefsOf = function unresolvedConceptRefsOf(
    resolve: (ref: string) => boolean,
): UnresolvedConceptRef[] {
    return CONCEPTS.flatMap((concept) =>
        [concept.home, ...concept.members].filter((ref) => !resolve(ref)).map((ref) => ({ concept: concept.id, ref })),
    );
};

export const variantIdsOf = function variantIdsOf(collections: ReadonlyMap<string, readonly string[]>): VariantId[] {
    return [...collections].flatMap(([collection, ids]) =>
        ids.flatMap((id) => {
            const canonical = VARIANTS.get(id);
            return canonical === undefined ? [] : [{ canonical, collection, id }];
        }),
    );
};
