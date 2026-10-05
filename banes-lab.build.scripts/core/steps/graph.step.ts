import { absolutePath } from "@ssot/paths";
import { defineStep } from "#core/factories/step.factory";
import { deriveGraph } from "#core/coordinators/graph.coordinator";
import { ontologyOf } from "#core/guards/site.guard";

const GRAPH = "graph";

defineStep({
    cache: null,
    name: GRAPH,
    needs: ["ontology", "metrics", "links"],
    phase: "start",
    async run(state) {
        return { gives: {}, line: await deriveGraph(absolutePath("app.member"), ontologyOf(state, GRAPH)) };
    },
});
