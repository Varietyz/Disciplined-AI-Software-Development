import { ARCHITECTURE_CARD } from "#core/ids/card.ids";
import { ARCHITECTURE_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: ARCHITECTURE_CARD, page: ARCHITECTURE_PAGE }), import.meta.url);
