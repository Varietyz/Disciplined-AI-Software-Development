import type { AlgoGrammar, Contract } from "#types/algorithm.types";
import { CODELESS_EXEMPLAR, IDENTICAL_EXEMPLAR, MISSING_EXEMPLAR } from "#configuration/strings/validation.strings";
import type { ExemplarGap } from "#types/validation.types";

const CODE_SYNTAX = ["(", ")", "{", "}", ";", "="];
const CODE_MEDIUM = "code";

const exemplarGap = function exemplarGap(contract: Contract): ExemplarGap | null {
    const { exemplar } = contract;
    if (!exemplar || exemplar.before.trim() === "" || exemplar.after.trim() === "") {
        return { id: contract.id, reason: MISSING_EXEMPLAR };
    }
    if (exemplar.before.trim() === exemplar.after.trim()) {
        return { id: contract.id, reason: IDENTICAL_EXEMPLAR };
    }
    if (exemplar.medium === CODE_MEDIUM && !CODE_SYNTAX.some((token) => exemplar.after.includes(token))) {
        return { id: contract.id, reason: CODELESS_EXEMPLAR };
    }
    return null;
};

export const exemplarGapsOf = function exemplarGapsOf(algo: AlgoGrammar): ExemplarGap[] {
    return algo
        .all()
        .filter((entry) => entry.meta !== true)
        .flatMap((contract) => exemplarGap(contract) ?? []);
};
