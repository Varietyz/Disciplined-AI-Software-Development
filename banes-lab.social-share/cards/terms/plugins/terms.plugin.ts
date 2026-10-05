import { TERMS_CARD } from "#core/ids/card.ids";
import { TERMS_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: TERMS_CARD, page: TERMS_PAGE }), import.meta.url);
