import type { CardInput, CardSpec } from "#types/card.types";
import { DEFAULT_TIMELINE, PROFILES } from "#configuration/configs/card.config";

export const createCard = function createCard(input: CardInput): CardSpec {
    return {
        alt: input.alt,
        id: input.id,
        layers: input.layers,
        page: input.page,
        profiles: input.profiles ?? PROFILES.map((profile) => profile.id),
        stylesheet: input.stylesheet,
        timeline: { ...DEFAULT_TIMELINE, ...input.timeline },
        tone: input.tone,
    };
};
