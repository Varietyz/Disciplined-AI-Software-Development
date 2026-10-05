import { REASONING_AXIS } from "#configuration/generated/axis.generated";
import type { ReasoningRung } from "#types/axis.types";

const REASONING_RANK: ReadonlyMap<string, number> = new Map(REASONING_AXIS.map((rung, index) => [rung, index]));

export const reasoningRank = function reasoningRank(rung: ReasoningRung): number {
    return REASONING_RANK.get(rung) ?? -1;
};
