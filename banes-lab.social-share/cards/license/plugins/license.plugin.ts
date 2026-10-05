import { LICENSE_CARD } from "#core/ids/card.ids";
import { LICENSE_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: LICENSE_CARD, page: LICENSE_PAGE }), import.meta.url);
