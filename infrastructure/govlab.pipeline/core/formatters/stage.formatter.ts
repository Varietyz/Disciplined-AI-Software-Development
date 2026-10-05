import { DURATION_DECIMALS, MS_PER_SECOND } from "#configuration/constants/stage.constants";

export const seconds = function seconds(startedAt: number): string {
    return ((Date.now() - startedAt) / MS_PER_SECOND).toFixed(DURATION_DECIMALS);
};
