import { ANALYSIS_MATH_TYPE } from "#configuration/constants/math.constants";
import type { AnalysisTag } from "#types/axis.types";

export const mathTypeOf = function mathTypeOf(analysis: AnalysisTag): string {
    return ANALYSIS_MATH_TYPE[analysis];
};
