import { buildIcons } from "#core/coordinators/icons.coordinator";
import { defineStep } from "#core/factories/step.factory";
import { iconsLine } from "#configuration/strings/icons.strings";
import { relativePath } from "@ssot/paths";

defineStep({
    cache: null,
    name: "icons",
    needs: ["metrics"],
    phase: "start",
    async run() {
        return { gives: {}, line: iconsLine(await buildIcons(), relativePath("app.icons")) };
    },
});
