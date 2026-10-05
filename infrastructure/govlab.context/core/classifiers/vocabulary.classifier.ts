import { ANTI_FORCE_MARK, CANONICAL_FORCES } from "#configuration/constants/vocabulary.constants";
import type { ForceKind } from "#types/vocabulary.types";

export const classifyForce = function classifyForce(token: string): ForceKind {
    if (CANONICAL_FORCES.has(token)) {
        return "force";
    }
    if (token.includes(ANTI_FORCE_MARK)) {
        return "anti-force";
    }
    return "unknown";
};
