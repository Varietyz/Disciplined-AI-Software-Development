import { MANIFEST_ERRORS, unknownContract, unknownSectionKey } from "#configuration/strings/manifest.strings";
import { isNonEmptyStringArray, recordField, stringsOf } from "#core/selectors/record.selector";
import type { ManifestPlugin } from "#types/manifest.types";
import { createAlgoGrammar } from "@govlab/context";
import { isPlainRecord } from "#core/predicates/record.predicate";

const SECTION = "algoGrammar";
const CONTRACTS_KEY = "contracts";
const known: { ids?: ReadonlySet<string> } = {};

const contractIds = function contractIds(): ReadonlySet<string> {
    known.ids ??= new Set(createAlgoGrammar().ids());
    return known.ids;
};

const contractErrors = function contractErrors(contracts: unknown): string[] {
    if (contracts === undefined) {
        return [];
    }
    if (!isNonEmptyStringArray(contracts)) {
        return [MANIFEST_ERRORS.contractsShape];
    }
    const ids = contractIds();
    return ids.size === 0 ? [] : contracts.filter((id) => !ids.has(id)).map(unknownContract);
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        const contracts = stringsOf(recordField(manifest, SECTION)?.[CONTRACTS_KEY]);
        if (contracts.length > 0) {
            entry[SECTION] = { contracts };
        }
    },
    name: "algo-grammar",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const grammar = manifest[SECTION];
            if (grammar === undefined) {
                return [];
            }
            if (!isPlainRecord(grammar)) {
                return [MANIFEST_ERRORS.algoGrammarShape];
            }
            const unknownKeys = Object.keys(grammar)
                .filter((key) => key !== CONTRACTS_KEY)
                .map((key) => unknownSectionKey(SECTION, key));
            return [...unknownKeys, ...contractErrors(grammar[CONTRACTS_KEY])];
        },
    },
};
