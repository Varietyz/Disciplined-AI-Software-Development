import { ROOT, absolutePath } from "@ssot/paths";
import { publishedKeyOf, publishedPaths, treeDeclarations } from "#core/loaders/tree.loader";
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
        const published = treeDeclarations().flatMap((declaration) => {
            const key = publishedKeyOf(declaration.tab);
            return key === null ? [] : [{ declaration, key }];
        });
        const lines = await Promise.all(
            published.map(async ({ declaration, key }) => {
                const sync = await publishTree(
                    join(ROOT, declaration.folder),
                    absolutePath(key),
                    publishedPaths(declaration, pruned),
                );
                return syncedLine(declaration.tab, sync);
            }),
        );
        return { gives: {}, line: lines.join("") };
    },
});
