import type { Principle, PrincipleCategory } from "#types/architecture.types";
import { foldCategories, loadCategories } from "#core/loaders/ontology.loader";
import type { ReadAudit } from "#core/observers/record.observer";
import { absolutePath } from "@ssot/paths";
import { normalizePrinciple } from "#core/normalizers/architecture.normalizer";

export const loadPrinciples = function loadPrinciples(audit: ReadAudit, data?: PrincipleCategory[]): Principle[] {
    return data
        ? foldCategories(data, normalizePrinciple, audit)
        : loadCategories(absolutePath("govlab.context.principles"), normalizePrinciple, audit);
};
