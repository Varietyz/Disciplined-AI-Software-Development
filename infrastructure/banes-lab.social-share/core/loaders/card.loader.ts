import "#core/plugins/card.barrel";
import "@banes-lab/web/presentation/records/records.barrel.ts";
import { listCards, repeatedCards } from "#core/registries/card.registry";
import type { CardPage } from "#types/card.types";
import type { LoadedCards } from "#types/stage.types";
import { SITE_MARKS } from "#configuration/data/site.data";
import { pageAddress } from "#core/evaluators/page.evaluator";
import { registeredPages } from "@banes-lab/web/domain/registries/page.registry.ts";

const PLUGIN_FILES = import.meta.glob("../../cards/*/plugins/*.plugin.ts");

export const CARD_PLUGINS: readonly string[] = Object.keys(PLUGIN_FILES);

export const cardPages = function cardPages(): readonly CardPage[] {
    return registeredPages().map((page) => ({
        accent: page.accent,
        address: pageAddress(page.id),
        headline: page.share.headline,
        icon: page.icon,
        id: page.id,
        mark: page.mark,
        tagline: page.share.tagline,
    }));
};

export const loadCards = function loadCards(): LoadedCards {
    return {
        brand: SITE_MARKS,
        cards: listCards(),
        pages: cardPages(),
        plugins: CARD_PLUGINS,
        repeated: repeatedCards(),
    };
};
