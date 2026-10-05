import { INFORMATION_CARD } from "#core/ids/card.ids";
import { INFORMATION_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: INFORMATION_CARD, page: INFORMATION_PAGE }), import.meta.url);
