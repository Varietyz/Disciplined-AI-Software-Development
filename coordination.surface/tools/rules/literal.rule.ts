import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { callBefore, isPathShaped, quotedLiterals, unboundedEnumerations } from "../core/analyzers/literal.analyzer.ts";
import { enumerationFinding, rawPathFinding } from "../core/factories/literal.factory.ts";
import { AUTHORED_ROOTS } from "../core/constants/path.constants.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { underRoots } from "../core/filters/scope.filter.ts";

const COMPOSERS: ReadonlySet<string> = new Set(["within", "withinSurface", "surfacePath", "slotText", "inSurface"]);

const FILESYSTEM_CALLS: ReadonlySet<string> = new Set([
    "join",
    "resolve",
    "existsSync",
    "readFileSync",
    "readdirSync",
    "writeFileSync",
    "statSync",
    "mkdirSync",
    "rmdirSync",
    "renameSync",
    "walk",
    "readSource",
]);

interface LiteralScan {
    readonly findings: Finding[];
    readonly literals: number;
}

const scanLiterals = function scanLiterals(path: string, source: string): LiteralScan {
    const shaped = quotedLiterals(source).filter((literal) => isPathShaped(literal.value));
    const findings = shaped.flatMap((literal) => {
        const composer = callBefore(source, literal.open);
        const raw = FILESYSTEM_CALLS.has(composer) && !COMPOSERS.has(composer);
        return raw ? [rawPathFinding(path, source, literal, composer)] : [];
    });
    return { findings, literals: shaped.length };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const findings: Finding[] = [];
        const scoped = underRoots(context.paths, AUTHORED_ROOTS);
        let literals = 0;

        for (const path of scoped) {
            const source = context.read(path);
            const scan = scanLiterals(path, source);
            literals += scan.literals;
            findings.push(
                ...unboundedEnumerations(source).map((found) => enumerationFinding(path, found)),
                ...scan.findings,
            );
        }

        return {
            derivations: {
                literals,
                reached: scoped,
                skippedAsOutsideAuthoredRoots: context.paths.filter((path) => !scoped.includes(path)),
            },
            findings,
            healed: [],
        };
    },
    extensions: [".ts"],
    heals: false,
    invariant: "a path-shaped string literal in authored source is composed through the parameter surface",
    jurisdiction: "all",
    kinds: ["rawPath", "unboundedEnumeration"],

    stage: "structure",
};
