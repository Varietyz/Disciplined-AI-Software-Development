import type { Block, LearningRouter, TabsFor } from "#types/learning.types";
import { teachingBlocks, teachingRoute } from "#core/converters/learning.converter";
import { absolutePath } from "@ssot/paths";
import { loadContentGraphs } from "@banes-lab/content/core/loaders/coverage.loader.ts";
import { renderLearning } from "#core/formatters/learning.formatter";
import { writeCanonicalText } from "@govlab/canonical-write";

export const buildLearningMap = async function buildLearningMap(
    router: LearningRouter,
    tabsFor: TabsFor,
): Promise<readonly Block[]> {
    const blocks = teachingBlocks(teachingRoute(router, await loadContentGraphs(), tabsFor));
    await writeCanonicalText(absolutePath("app.learning"), renderLearning(blocks));
    return blocks;
};
