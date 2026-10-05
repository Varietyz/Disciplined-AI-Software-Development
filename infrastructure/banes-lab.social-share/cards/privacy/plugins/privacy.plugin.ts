import { PRIVACY_CARD } from "#core/ids/card.ids";
import { PRIVACY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: PRIVACY_CARD, page: PRIVACY_PAGE }), import.meta.url);
