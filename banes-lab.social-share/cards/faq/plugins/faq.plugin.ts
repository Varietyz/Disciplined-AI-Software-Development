import { FAQ_CARD } from "#core/ids/card.ids";
import { FAQ_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: FAQ_CARD, page: FAQ_PAGE }), import.meta.url);
