import type { PathRef, SymbolRef } from "#types/reference.types";
import { exportedNames } from "#core/parsers/export.parser";
import { isCodeFile } from "#core/predicates/source.predicate";
import { isExternalTarget } from "#core/predicates/reference.predicate";
import { pathReferences } from "#core/parsers/location.parser";
import { resolveTargetFile } from "#core/resolvers/source.resolver";
import { unquote } from "#core/normalizers/reference.normalizer";

const SYMBOL_SEPARATOR = "#";

const parseSymbolRef = function parseSymbolRef(raw: string): SymbolRef | null {
    const hash = raw.indexOf(SYMBOL_SEPARATOR);
    if (hash <= 0) {
        return null;
    }
    const file = raw.slice(0, hash);
    const symbol = raw.slice(hash + 1);
    return symbol.length === 0 || isExternalTarget(file) || !isCodeFile(file) ? null : { file, symbol };
};

const driftForRef = function driftForRef(ref: PathRef, moduleDir: string, consumerRoot: string): string | null {
    const parsed = parseSymbolRef(unquote(ref.path));
    if (parsed === null) {
        return null;
    }
    const resolved = resolveTargetFile(parsed.file, moduleDir, consumerRoot);
    if (resolved === null || exportedNames(resolved).has(parsed.symbol)) {
        return null;
    }
    return `${parsed.file}${SYMBOL_SEPARATOR}${parsed.symbol}`;
};

export const symbolDriftIn = function symbolDriftIn(
    fragment: string,
    moduleDir: string,
    consumerRoot: string,
): string[] {
    return pathReferences(fragment).flatMap((ref) => {
        const hit = driftForRef(ref, moduleDir, consumerRoot);
        return hit === null ? [] : [hit];
    });
};
