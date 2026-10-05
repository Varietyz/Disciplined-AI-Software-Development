import type { StepOutput } from "#types/report.types";
import type { StepStore } from "#types/stage.types";

export const createStepStore = function createStepStore(): StepStore {
    const collected: StepOutput[] = [];
    return {
        collect: (output) => {
            collected.push(output);
        },
        outputs: () => [...collected],
    };
};
