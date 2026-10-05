import type { CodeFinding, CodeSymbol } from "#types/code.types";
import { DEAD_DETAIL, FINDING_KINDS, REMEDY, duplicateDetail } from "#configuration/strings/code.strings";
import { HIGH_SEVERITY, MEDIUM_SEVERITY, MODULE_SCOPE } from "#configuration/constants/report.constants";
import { ROLE_DEFINITION } from "#core/classifiers/syntax.classifier";
import { identifierNames } from "#core/analyzers/syntax.analyzer";
import { increment } from "#core/counters/base.counter";

const REL_DEAD = 9;
const REL_DUP = 9;
const REFERENCE_MIN = 2;
const MIN_DUP_FILES = 2;
const DUP_MAX_FILES = 4;
const MIN_DUP_SIZE = 160;
const CONFIDENCE = "high";
const GO_EXT = ".go";
const SHELL_EXT = ".sh";
const METHOD_KIND = "method";
const GENERATED_MARKER = ".generated.";
const GO_ENTRY: ReadonlySet<string> = new Set(["main", "init"]);
const SCHEMA_EXTS: readonly string[] = [".sql", ".graphql", ".gql", ".prisma"];
const TYPE_DECL_KINDS: ReadonlySet<string> = new Set(["interface_declaration", "type_alias_declaration"]);
const MALFORMED_CHARS: ReadonlySet<string> = new Set([" ", "{", "}", "(", ")", ",", ".", '"', "'", "[", "]"]);

const startsUpper = function startsUpper(name: string): boolean {
    const first = name.charAt(0);
    return first !== "" && first === first.toUpperCase() && first !== first.toLowerCase();
};

const isExported = function isExported(symbol: CodeSymbol): boolean {
    return symbol.exported || (symbol.file.endsWith(GO_EXT) && (startsUpper(symbol.name) || GO_ENTRY.has(symbol.name)));
};

const isCleanName = function isCleanName(name: string): boolean {
    for (const char of name) {
        if (MALFORMED_CHARS.has(char)) {
            return false;
        }
    }
    return name.length > 0;
};

const isModuleDefinition = function isModuleDefinition(symbol: CodeSymbol): boolean {
    return symbol.role === ROLE_DEFINITION && symbol.enclosing === MODULE_SCOPE;
};

const isNamedDefinition = function isNamedDefinition(symbol: CodeSymbol): boolean {
    return isModuleDefinition(symbol) && isCleanName(symbol.name);
};

const isUnreferenced = function isUnreferenced(
    symbol: CodeSymbol,
    used: ReadonlySet<string>,
    testUses: ReadonlySet<string>,
): boolean {
    return !used.has(symbol.name) && !testUses.has(symbol.name);
};

const isHandWritten = function isHandWritten(symbol: CodeSymbol): boolean {
    return !symbol.kind.includes(METHOD_KIND) && !symbol.file.includes(GENERATED_MARKER);
};

const isDiagnosableSource = function isDiagnosableSource(symbol: CodeSymbol): boolean {
    return (
        !symbol.file.endsWith(SHELL_EXT) &&
        !SCHEMA_EXTS.some((ext) => symbol.file.endsWith(ext)) &&
        !TYPE_DECL_KINDS.has(symbol.kind)
    );
};

const usedNames = function usedNames(records: readonly Record<string, unknown>[]): Set<string> {
    const counts = new Map<string, number>();
    for (const name of identifierNames(records)) {
        increment(counts, name);
    }
    return new Set([...counts].filter(([, count]) => count >= REFERENCE_MIN).map(([name]) => name));
};

const deadFinding = function deadFinding(def: CodeSymbol): CodeFinding {
    return {
        confidence: CONFIDENCE,
        detail: DEAD_DETAIL,
        file: def.file,
        kind: FINDING_KINDS.deadCode,
        line: def.line,
        members: [],
        name: def.name,
        relevance: REL_DEAD,
        remedy: REMEDY.get(FINDING_KINDS.deadCode) ?? "",
        severity: MEDIUM_SEVERITY,
    };
};

export const deadFindings = function deadFindings(
    symbols: readonly CodeSymbol[],
    records: readonly Record<string, unknown>[],
    testUses: ReadonlySet<string>,
): CodeFinding[] {
    const used = usedNames(records);
    const dead = symbols
        .filter((symbol) => isNamedDefinition(symbol) && isDiagnosableSource(symbol) && !isExported(symbol))
        .filter((symbol) => isUnreferenced(symbol, used, testUses));
    return [...new Map(dead.map((def) => [`${def.file}:${def.line}`, def])).values()].map(deadFinding);
};

const duplicateGroups = function duplicateGroups(name: string, defs: readonly CodeSymbol[]): CodeFinding[] {
    const byHash = new Map<string, CodeSymbol[]>();
    for (const def of defs) {
        byHash.set(def.hash, [...(byHash.get(def.hash) ?? []), def]);
    }
    return [...byHash.values()].flatMap((group): CodeFinding[] => {
        const files = [...new Set(group.map((def) => def.file))].sort((a, b) => a.localeCompare(b));
        const [first] = group;
        const qualifies =
            files.length >= MIN_DUP_FILES && files.length <= DUP_MAX_FILES && (first?.size ?? 0) >= MIN_DUP_SIZE;
        if (!qualifies || first === undefined) {
            return [];
        }
        return [
            {
                confidence: CONFIDENCE,
                detail: duplicateDetail(files.length, files.join(", ")),
                file: first.file,
                kind: FINDING_KINDS.duplicate,
                line: first.line,
                members: files,
                name,
                relevance: REL_DUP,
                remedy: REMEDY.get(FINDING_KINDS.duplicate) ?? "",
                severity: HIGH_SEVERITY,
            },
        ];
    });
};

export const duplicateFindings = function duplicateFindings(symbols: readonly CodeSymbol[]): CodeFinding[] {
    const byName = new Map<string, CodeSymbol[]>();
    const exported = symbols.filter(
        (symbol) => isNamedDefinition(symbol) && isExported(symbol) && isHandWritten(symbol),
    );
    for (const def of exported) {
        byName.set(def.name, [...(byName.get(def.name) ?? []), def]);
    }
    return [...byName].flatMap(([name, defs]) => duplicateGroups(name, defs));
};
