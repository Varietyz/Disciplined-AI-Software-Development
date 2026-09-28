import {
    BANNED_TERMS,
    KNOWN_VIOLATIONS,
    LEGAL_SUBJECTS,
    PROPER_NAMES,
    RETIRED_SYNONYMS,
} from "../../shared/manifests/vocabulary.manifest.ts";
import type { LocalRule, RuleContext, RuleListener, RuleNode } from "../../types/rule.types.ts";
import { firstKnownIn, firstTermIn, replaceKnown } from "../../shared/matchers/vocabulary.matcher.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { codeLiteralsOf } from "../../shared/selectors/literal.selector.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const SUBJECT_MARK = ".";
const RETIRED_TERMS: readonly string[] = [...RETIRED_SYNONYMS.keys()];
const KNOWN_TERMS: readonly string[] = [...KNOWN_VIOLATIONS.keys()];

const quasiTexts = function quasiTexts(node: AstNode): string[] {
    return nodesAt(node, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked"));
};

const subjectOf = function subjectOf(filename: string): string {
    const base = basenameOf(filename);
    return base.slice(0, base.indexOf(SUBJECT_MARK));
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        const mapped = !LEGAL_SUBJECTS.has(subjectOf(context.filename));
        let code: ReadonlySet<AstNode> = new Set();
        const reportKnown = function reportKnown(node: AstNode, raw: RuleNode, text: string): void {
            const known = mapped ? firstKnownIn(text, KNOWN_TERMS, PROPER_NAMES) : null;
            if (known === null) {
                return;
            }
            const source = context.sourceCode.getText(raw);
            context.report({
                data: { canonical: KNOWN_VIOLATIONS.get(known) ?? known, term: known },
                fix: (fixer) => fixer.replaceText(raw, replaceKnown(source, KNOWN_VIOLATIONS, PROPER_NAMES)),
                loc: locOf(node),
                messageId: "knownViolation",
            });
        };
        const report = function report(node: AstNode, raw: RuleNode, text: string): void {
            if (code.has(node)) {
                return;
            }
            const term = firstTermIn(text, BANNED_TERMS);
            if (term !== null) {
                context.report({ data: { term }, loc: locOf(node), messageId: "bannedTerm" });
            }
            const retired = firstTermIn(text, RETIRED_TERMS);
            if (retired !== null) {
                const canonical = RETIRED_SYNONYMS.get(retired) ?? retired;
                context.report({ data: { canonical, term: retired }, loc: locOf(node), messageId: "retiredSynonym" });
            }
            reportKnown(node, raw, text);
        };
        return listener({
            literal(view, raw) {
                const text = literalString(view);
                if (text !== null) {
                    report(view, raw, text);
                }
            },
            program(view) {
                code = codeLiteralsOf(view);
            },
            templateLiteral(view, raw) {
                report(view, raw, quasiTexts(view).join(" "));
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:semantic-consistency"] }),
            description:
                "A user-visible string carries no term the vocabulary registry bans, no retired name for a concept, and no known violation. The registry holds the writing constitution as data. The banned terms are praise and marketing words, reported for a rewrite. The retired synonyms are names whose replacement is not a drop-in, reported with the canonical term. The known violations are exact phrases with an exact replacement, such as the names of the two parties: the model and the developer. They are fixed in place at word boundaries, matched without regard to case, with the leading capital kept. Legal documents keep their legal parties, so the subjects the registry declares legal are outside the known-violation mapping. A literal consumed as a code sample is code, not prose, and is not held to the registry.",
        },
        fixable: "code",
        messages: {
            bannedTerm:
                "The vocabulary registry bans '{{term}}' in user-visible copy. Restate the sentence without the term; the registry is data, so widening it is a maintainer edit, never a rewrite of this rule.",
            knownViolation:
                "'{{term}}' is a known violation with one exact replacement: '{{canonical}}'. The fix rewrites it in place; the mapping is data in the vocabulary registry.",
            retiredSynonym:
                "'{{term}}' is a retired name for a concept that carries one name across the site: write '{{canonical}}'. One concept with two names reads as two concepts; the synonym registry is data, so adding a retired name is a maintainer edit.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
