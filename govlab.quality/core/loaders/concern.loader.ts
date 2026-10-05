import type { EmitInputs } from "#types/config.types";
import { loadCanonicalData } from "#core/loaders/canon.loader";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { ownersInvalid } from "#configuration/strings/quality.strings";
import { validConcepts } from "#core/selectors/concept.selector";
import { validateConcerns } from "#core/validators/concern.validator";
import { validateOwnerOverride } from "#core/validators/surface.validator";

export const loadEmitInputs = async function loadEmitInputs(consumerRoot: string): Promise<EmitInputs> {
    const config = await loadGovlabConfig(consumerRoot);
    const concerns = validateConcerns(config.qualityMaster?.concerns ?? {}, validConcepts());
    const owners = config.qualityMaster?.owners;
    const conflicts = validateOwnerOverride(owners, loadCanonicalData());
    if (conflicts.length > 0) {
        const detail = conflicts.map((conflict) => `  - ${conflict.detail}`).join("\n");
        throw new Error(ownersInvalid(detail));
    }
    return { concerns, config, owners };
};
