import { buildOntology } from "#core/coordinators/ontology.coordinator";
import { defineStep } from "#core/factories/step.factory";
import { ontologyLine } from "#configuration/strings/ontology.strings";
import { relativePath } from "@ssot/paths";

defineStep({
    cache: null,
    name: "ontology",
    phase: "start",
    async run() {
        const built = await buildOntology();
        const files = {
            ontology: relativePath("app.ontology"),
            reference: relativePath("app.reference"),
            vocabulary: relativePath("app.vocabulary"),
        };
        return { gives: { ontology: built.ontology }, line: ontologyLine(built, files) };
    },
});
