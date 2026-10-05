import { HOME_CARD } from "#core/ids/card.ids";
import { HOME_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: HOME_CARD, page: HOME_PAGE }), import.meta.url);
