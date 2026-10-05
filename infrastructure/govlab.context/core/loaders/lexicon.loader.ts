import type { Term, TermCategory } from "#types/lexicon.types";
import { foldCategories, loadCategories, readJsonFile } from "#core/loaders/ontology.loader";
import { COLLECTION_CHECK_FILE } from "#configuration/constants/lexicon.constants";
import type { ReadAudit } from "#core/observers/record.observer";
import { absolutePath } from "@ssot/paths";
import { asCheck } from "#core/converters/check.converter";
import { join } from "node:path";
import { termNormalizer } from "#core/normalizers/lexicon.normalizer";

export const loadTerms = function loadTerms(audit: ReadAudit, data?: TermCategory[]): Term[] {
    const dir = absolutePath("govlab.context.lexicon");
    const collectionCheck = readJsonFile(join(dir, COLLECTION_CHECK_FILE));
    const normalize = termNormalizer(asCheck(collectionCheck));
    return data
        ? foldCategories(data, normalize, audit)
        : loadCategories(dir, normalize, audit, { exclude: (name) => name === COLLECTION_CHECK_FILE });
};
