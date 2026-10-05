import type { Contract, ContractCategory, SymbolEntry } from "#types/algorithm.types";
import { foldCategories, loadCategories, readJsonFile } from "#core/loaders/ontology.loader";
import type { ReadAudit } from "#core/observers/record.observer";
import { SYMBOLS_KEY } from "#configuration/constants/algorithm.constants";
import { absolutePath } from "@ssot/paths";
import { isObject } from "#core/predicates/record.predicate";
import { normalizeContract } from "#core/normalizers/algorithm.normalizer";

export const loadContracts = function loadContracts(audit: ReadAudit, data?: ContractCategory[]): Contract[] {
    return data
        ? foldCategories(data, normalizeContract, audit)
        : loadCategories(absolutePath("govlab.context.algorithms"), normalizeContract, audit);
};

const asSymbolEntries = function asSymbolEntries(value: unknown): SymbolEntry[] {
    if (!isObject(value) || !Array.isArray(value[SYMBOLS_KEY])) {
        return [];
    }
    return value[SYMBOLS_KEY].filter((entry): entry is SymbolEntry => isObject(entry));
};

export const symbolsPath = function symbolsPath(): string {
    return absolutePath("govlab.context.symbols");
};

export const loadBundledSymbols = function loadBundledSymbols(): SymbolEntry[] {
    return asSymbolEntries(readJsonFile(symbolsPath()));
};
