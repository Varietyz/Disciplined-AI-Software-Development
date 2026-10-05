import { PAG_GROUNDING_EXEMPT, PAG_PRODUCTION_EXEMPT } from "#configuration/constants/reference.constants";
import type { PagGroundingFaces } from "#types/reference.types";
import { kindRefResolves } from "#core/resolvers/reference.resolver";
import { roleIdOf } from "#core/selectors/grammar.selector";

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

const groundedConstructs = function groundedConstructs(
    faces: PagGroundingFaces,
): { id: string; grounds: readonly string[] | undefined }[] {
    return [
        ...faces.pag
            .keywords()
            .flatMap((keyword) =>
                keyword.roles.map((role) => ({ grounds: role.grounds, id: roleIdOf(keyword, role) })),
            ),
        ...faces.pag.productions().map((production) => ({ grounds: production.grounds, id: production.lhs })),
        ...faces.pag.documentTypes().map((doctype) => ({ grounds: doctype.grounds, id: doctype.type })),
    ];
};

export const unresolvedPagGroundsOf = function unresolvedPagGroundsOf(
    faces: PagGroundingFaces,
): { from: string; target: string }[] {
    const kindMembers = faces.reason.kindMembers();
    return groundedConstructs(faces).flatMap((construct) =>
        (construct.grounds ?? [])
            .filter((target) => !kindRefResolves(kindMembers, target))
            .map((target) => ({ from: construct.id, target })),
    );
};

export const ungroundedPagConstructsOf = function ungroundedPagConstructsOf(faces: PagGroundingFaces): string[] {
    return [
        ...faces.pag
            .keywords()
            .flatMap((keyword) =>
                keyword.roles
                    .filter((role) => !PAG_GROUNDING_EXEMPT.has(role.category) && (role.grounds ?? []).length === 0)
                    .map((role) => roleIdOf(keyword, role)),
            ),
        ...faces.pag
            .productions()
            .filter(
                (production) => !PAG_PRODUCTION_EXEMPT.has(production.lhs) && (production.grounds ?? []).length === 0,
            )
            .map((production) => production.lhs),
    ].toSorted(byName);
};

const unresolvedRef = function unresolvedRef(value: string | undefined, set: Set<string>): boolean {
    return typeof value !== "string" || value === "" || !set.has(value);
};

export const doctypeModelAxisOf = function doctypeModelAxisOf(faces: PagGroundingFaces): string[] {
    const models = new Set(faces.reason.models().map((model) => model.id));
    const axes = new Set(faces.reason.axes().map((axis) => axis.id));
    return faces.pag
        .documentTypes()
        .filter((doctype) => unresolvedRef(doctype.model, models) || unresolvedRef(doctype.axis, axes))
        .map((doctype) => doctype.type)
        .toSorted(byName);
};
