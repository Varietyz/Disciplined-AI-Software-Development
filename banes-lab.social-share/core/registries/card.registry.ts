import type { CardSpec, RegisteredCard } from "#types/card.types";
import { createRegistry } from "@banes-lab/web/domain/registries/base.registry.ts";

const cards = createRegistry<RegisteredCard>();
const repeated = new Set<string>();

export const registerCard = function registerCard(spec: CardSpec, origin: string): void {
    if (cards.byId(spec.id) !== undefined) {
        repeated.add(spec.id);
    }
    cards.register({ id: spec.id, origin, spec });
};

export const getCard = function getCard(id: string): RegisteredCard | undefined {
    return cards.byId(id);
};

export const listCards = function listCards(): readonly RegisteredCard[] {
    return cards.all().toSorted((a, b) => a.id.localeCompare(b.id));
};

export const repeatedCards = function repeatedCards(): readonly string[] {
    return [...repeated];
};
