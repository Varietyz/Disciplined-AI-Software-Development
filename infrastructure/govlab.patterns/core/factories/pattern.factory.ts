import type { GovlabPatterns, GovlabPatternsOptions } from "#types/pattern.types";
import { foldFaces, registeredFaces } from "#core/registries/pattern.registry";
import { NOOP_LOGGER } from "#core/reporters/pattern.reporter";

export const createGovlabPatterns = function createGovlabPatterns(options: GovlabPatternsOptions = {}): GovlabPatterns {
    const built = foldFaces(registeredFaces(), { logger: options.logger ?? NOOP_LOGGER });
    return Object.freeze({ faces: Object.freeze([...built.keys()]) });
};
