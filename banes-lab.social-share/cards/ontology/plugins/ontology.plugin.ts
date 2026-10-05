import { ONTOLOGY_CARD } from "#core/ids/card.ids";
import { ONTOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";

registerCard(createPageCard({ id: ONTOLOGY_CARD, page: ONTOLOGY_PAGE }), import.meta.url);
