import { absolutePath, relativePath } from "@ssot/paths";
import { defineStep } from "#core/factories/step.factory";
import { linksLine } from "#configuration/strings/link.strings";
import { writeLinkedPages } from "#core/coordinators/link.coordinator";

defineStep({
    cache: null,
    name: "links",
    needs: ["ontology"],
    phase: "start",
    async run() {
        return {
            gives: {},
            line: linksLine(await writeLinkedPages(absolutePath("app.member")), relativePath("app.pages")),
        };
    },
});
