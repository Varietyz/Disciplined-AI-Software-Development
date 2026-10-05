import { defineStep } from "#core/factories/step.factory";
import { recordSurfaces } from "#core/coordinators/surface.coordinator";
import { relativePath } from "@ssot/paths";
import { surfacesLine } from "#configuration/strings/surface.strings";

defineStep({
    cache: null,
    name: "surfaces",
    phase: "start",
    async run() {
        const recorded = await recordSurfaces();
        return { gives: {}, line: surfacesLine(recorded.figures, recorded.reused, relativePath("app.surfaces")) };
    },
});
