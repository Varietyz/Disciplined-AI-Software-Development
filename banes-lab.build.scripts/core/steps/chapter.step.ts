import { renderSurfaces, surfacesKey } from "#core/coordinators/chapter.coordinator";
import { defineStep } from "#core/factories/step.factory";

defineStep({
    cache: { key: surfacesKey, outputs: ["methodology", "methodology.wiki"] },
    modes: ["build"],
    name: "chapters",
    needs: ["prune"],
    phase: "close",
    async run() {
        return { gives: {}, line: await renderSurfaces() };
    },
});
