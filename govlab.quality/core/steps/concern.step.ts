import type { CatalogRule } from "#types/catalog.types";
import { absolutePath } from "@ssot/paths";
import { concernOf } from "#core/classifiers/concern.classifier";
import { defineStep } from "#core/registries/step.registry";

defineStep({
    gives: ["catalog"],
    name: "concern",
    needs: ["classified"],
    run: async (state, writer) => {
        const catalog = (state.classified ?? []).map((rule): CatalogRule => ({ ...rule, concern: concernOf(rule) }));
        await writer.json(absolutePath("govlab.quality.generated.rules"), catalog);
        return { catalog };
    },
});
