import { ROOT, absolutePath } from "@ssot/paths";
import { publishedPaths, treeDeclarations } from "#core/loaders/tree.loader";
import { METHODOLOGY_BRANCH } from "#configuration/constants/tree.constants";
import { defineStep } from "#core/factories/step.factory";
import { excludeMatcher } from "@govlab/quality/config";
import { existsSync } from "node:fs";
import { extractConfigs } from "#core/coordinators/config.coordinator";
import { join } from "node:path";
import { publishTree } from "#core/persistence/tree.persistence";
import { syncedLine } from "#configuration/strings/folder.strings";

defineStep({
    cache: null,
    modes: ["build"],
    name: "trees",
    needs: ["chapters"],
    phase: "close",
    async run() {
        if (!existsSync(absolutePath("app.configs"))) {
            await extractConfigs();
        }
        const pruned = await excludeMatcher(ROOT);
        const published = treeDeclarations().filter((declaration) => declaration.repository !== null);
        const lines = await Promise.all(
            published.map(async (declaration) => {
                const sync = await publishTree(
                    join(ROOT, declaration.folder),
                    absolutePath(`${METHODOLOGY_BRANCH}.${declaration.tab}`),
                    publishedPaths(declaration, pruned),
                );
                return syncedLine(declaration.tab, sync);
            }),
        );
        return { gives: {}, line: lines.join("") };
    },
});
