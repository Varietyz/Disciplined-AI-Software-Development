import { ANATOMY_CARD } from "#core/ids/card.ids";
import { ANATOMY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: ANATOMY_CARD, page: ANATOMY_PAGE }), import.meta.url);
