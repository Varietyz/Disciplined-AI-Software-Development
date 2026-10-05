import { buildDiagrams } from "#core/coordinators/diagram.coordinator";
import { defineStep } from "#core/factories/step.factory";
import { diagramsLine } from "#configuration/strings/diagram.strings";
import { relativePath } from "@ssot/paths";

defineStep({
    cache: null,
    modes: ["build"],
    name: "diagrams",
    needs: ["metrics"],
    phase: "start",
    async run(state) {
        return { gives: {}, line: diagramsLine(await buildDiagrams(state.diagrams), relativePath("app.diagrams")) };
    },
});
