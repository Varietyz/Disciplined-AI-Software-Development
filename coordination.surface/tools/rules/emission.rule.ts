import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { AXIS_DOCUMENTS } from "../core/constants/path.constants.ts";

import type { Finding } from "../core/types/segment.types.ts";
import { readDeclaredRules } from "../core/readers/rule.reader.ts";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { surfacePath } from "../../config/surface.config.ts";
import { walk } from "../core/iterators/file.iterator.ts";

const MECHANISM_ROOT = surfacePath("entrypoints");

const FIELD = "RESTATES";

interface Restatement {
    readonly slug: string;
    readonly path: string;
    readonly line: number;
}

const QUOTE = '"';

interface Quoted {
    readonly at: number;
    readonly slug: string;
}

const lineOf = function lineOf(source: string, index: number): number {
    return source.slice(0, index).split("\n").length;
};

const listBounds = function listBounds(source: string): readonly [number, number] | null {
    const at = source.indexOf(FIELD);
    const assign = at === -1 ? -1 : source.indexOf("=", at);
    const open = assign === -1 ? -1 : source.indexOf("[", assign);
    const close = open === -1 ? -1 : source.indexOf("]", open);
    return close === -1 ? null : [open, close];
};

const closingQuote = function closingQuote(source: string, quote: number): number {
    return quote === -1 ? -1 : source.indexOf(QUOTE, quote + 1);
};

const quotedWithin = function quotedWithin(source: string, open: number, close: number): Quoted[] {
    const out: Quoted[] = [];
    let quote = source.indexOf(QUOTE, open);
    let end = closingQuote(source, quote);

    while (end !== -1 && end <= close) {
        out.push({ at: quote, slug: source.slice(quote + 1, end) });
        quote = source.indexOf(QUOTE, end + 1);
        end = closingQuote(source, quote);
    }

    return out;
};

const declaredRestatements = function declaredRestatements(source: string, path: string): Restatement[] {
    const bounds = listBounds(source);
    if (bounds === null) {
        return [];
    }
    return quotedWithin(source, bounds[0], bounds[1])
        .filter((quoted) => quoted.slug.length > 0)
        .map((quoted) => ({ line: lineOf(source, quoted.at), path, slug: quoted.slug }));
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const readAxes = AXIS_DOCUMENTS.filter((path) => context.exists(path));
        const declared = new Set(
            readAxes.flatMap((path) => readDeclaredRules(context.read(path)).map((declaredRule) => declaredRule.slug)),
        );

        if (declared.size === 0) {
            return {
                derivations: {
                    declaredSlugs:
                        "ABSENT — no axis document resolved, so the branch comparing a declaration against the set does not run",
                    readAxes,
                },
                findings: [],
                healed: [],
            };
        }

        const root = resolve(context.repoRoot, MECHANISM_ROOT);
        const sources = context.exists(MECHANISM_ROOT) ? walk({ extensions: [".ts"], ignored: [], root }) : [];

        const restatements = sources.flatMap((file) => {
            const relative = file
                .slice(context.repoRoot.length + 1)
                .split("\\")
                .join("/");
            return declaredRestatements(readFileSync(file, "utf8"), relative);
        });

        const stale = restatements.filter((restatement) => !declared.has(restatement.slug));
        const unresolved = stale.map((restatement) => restatement.slug);
        const findings: Finding[] = stale.map((restatement) => ({
            actual: `${restatement.slug} is declared as a rule this mechanism states and resolves to no declared rule`,
            expected: null,
            healed: false,
            line: restatement.line,
            locus: restatement.slug,
            path: restatement.path,
            remediation: {
                action: "declare",
                decide: "a mechanism prints its own statement of a protocol rule, and the surface that delivers a rule most often is a mechanism's output — which is the surface a repair pass reaches last, because output reads as a result rather than as a statement of the rule. Name the slug this mechanism now states, or remove the declaration where it no longer states one. THE SCOPE IS STATED RATHER THAN IMPLIED: this closes RENAME and RETIREMENT, where a slug stops resolving and the declaration says so. It does NOT close REWORDING — a rule whose text changes while its slug stands leaves every mechanism string stale and this check green, which is where the class actually lives, and the repair for that half is composing the string from the rule rather than declaring a pointer to it",
                deterministic: false,
                from: restatement.slug,
                target: restatement.path,
                to: null,
            },
            rule: "emission/unresolvedSlug",
            stack: [
                { check: "declaredSet", resolved: String(declared.size) },
                { check: "restates", resolved: restatement.slug },
                { check: "resolution", resolved: "absent" },
            ],
        }));

        return {
            derivations: {
                declaredSlugs: declared.size,
                mechanismsScanned: sources.length,
                range: "the population is every slug a mechanism DECLARES; a mechanism stating a rule and declaring nothing is invisible to it, and a declaration that resolves says nothing about whether the string still matches the rule's text",
                readAxes,
                restatements: restatements.map((entry) => `${entry.slug} @ ${entry.path}`),
                unresolved,
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant:
        "every rule slug a mechanism declares its strings to state resolves against the declared rule set, so a renamed or retired rule cannot leave a mechanism stating it",
    jurisdiction: "all",
    kinds: ["unresolvedSlug"],

    reads: [...AXIS_DOCUMENTS],
    readsTree:
        "the subject is a declaration inside a MECHANISM, and the mechanism sources are entrypoints rather " +
        "than governed documents — so they are outside the scanned path set by construction, and a rule " +
        "reading only that set would report a clean green over every mechanism in the tree",

    stage: "meta",
};
