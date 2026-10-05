import { SEARCH_CARD } from "#core/ids/card.ids";
import { SEARCH_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: SEARCH_CARD, page: SEARCH_PAGE }), import.meta.url);
