import type { CallEdge, CodeFinding, CodeSymbol } from "#types/code.types";
import { FINDING_KINDS, REMEDY, crossConcernDetail } from "#configuration/strings/code.strings";
import { keyOf, scopeOf } from "#core/formatters/definition.formatter";
import { MEDIUM_SEVERITY } from "#configuration/constants/report.constants";
import { ROLE_DEFINITION } from "#core/classifiers/syntax.classifier";

const REL_CONCERN = 7;
const CONCERN_SPAN = 4;
const CONFIDENCE = "medium";
const PATH_SEP = "/";
const WRAPPER_DIRS: ReadonlySet<string> = new Set(["src", "internal", "lib", "pkg", "cmd", "app"]);
const FACTORY_PREFIXES: readonly string[] = ["create", "build", "make", "new", "setup", "register", "compose", "wire"];

const concernOf = function concernOf(file: string): string {
    const [top = "", next = ""] = file.split(PATH_SEP);
    return WRAPPER_DIRS.has(top) && file.includes(PATH_SEP) ? next : top;
};

const isFactory = function isFactory(name: string): boolean {
    const lower = name.toLowerCase();
    return FACTORY_PREFIXES.some((prefix) => lower.startsWith(prefix));
};

export const crossConcernFindings = function crossConcernFindings(
    symbols: readonly CodeSymbol[],
    edges: readonly CallEdge[],
): CodeFinding[] {
    const spans = new Map<string, Set<string>>();
    for (const edge of edges) {
        const concern = concernOf(scopeOf(edge.to));
        spans.set(edge.from, (spans.get(edge.from) ?? new Set<string>()).add(concern));
    }
    const callable = new Map(
        symbols
            .filter((symbol) => symbol.role === ROLE_DEFINITION && symbol.callable)
            .map((symbol) => [keyOf(symbol.file, symbol.name), symbol]),
    );
    return [...callable]
        .filter(([key, def]) => !isFactory(def.name) && (spans.get(key)?.size ?? 0) >= CONCERN_SPAN)
        .map(([key, def]) => {
            const span = [...(spans.get(key) ?? [])].sort((a, b) => a.localeCompare(b));
            return {
                confidence: CONFIDENCE,
                detail: crossConcernDetail(span.length),
                file: def.file,
                kind: FINDING_KINDS.crossConcern,
                line: def.line,
                members: span,
                name: def.name,
                relevance: REL_CONCERN,
                remedy: REMEDY.get(FINDING_KINDS.crossConcern) ?? "",
                severity: MEDIUM_SEVERITY,
            };
        });
};
