import type { Block } from "#types/learning.types";

export const renderLearning = function renderLearning(blocks: readonly Block[]): string {
    return [
        'import type { LearningBlock } from "#types/learning.types";',
        "",
        `export const LEARNING: readonly LearningBlock[] = JSON.parse(${JSON.stringify(JSON.stringify(blocks))});`,
        "",
    ].join("\n");
};
