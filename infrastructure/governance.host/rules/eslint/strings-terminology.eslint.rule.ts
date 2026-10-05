import { CANONICAL_TERMS, canonicalFor, synonymsOf } from "../../shared/manifests/vocabulary.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { STRINGS_CHANNEL, isCheckEnforced } from "../../shared/manifests/writing.canon.manifest.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import type { TermRecord } from "../../types/writing.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { codeLiteralsOf } from "../../shared/selectors/literal.selector.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { firstTermIn } from "../../shared/matchers/vocabulary.matcher.ts";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const ENFORCED = isCheckEnforced("one-term-per-concept", STRINGS_CHANNEL);

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isStringArray = function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((entry) => typeof entry === "string");
};

const isTermRecord = function isTermRecord(value: unknown): value is TermRecord {
    return (
        isRecord(value) &&
        typeof value["canonical"] === "string" &&
        typeof value["concept"] === "string" &&
        isStringArray(value["synonyms"])
    );
};

const declaredTerms = function declaredTerms(context: RuleContext): readonly TermRecord[] {
    const options: unknown = context.options.at(0);
    const declared = isRecord(options) ? options["terms"] : undefined;
    const records = Array.isArray(declared) ? declared.filter(isTermRecord) : [];
    return records.length > 0 ? records : CANONICAL_TERMS;
};

const quasiTexts = function quasiTexts(node: AstNode): string[] {
    return nodesAt(node, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked"));
};

export default {
    create(context: RuleContext): RuleListener {
        if (!ENFORCED || !basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        const terms = declaredTerms(context);
        const synonyms = synonymsOf(terms);
        let code: ReadonlySet<AstNode> = new Set();
        const report = function report(node: AstNode, text: string): void {
            const synonym = code.has(node) ? null : firstTermIn(text, synonyms);
            const record = synonym === null ? null : canonicalFor(terms, synonym);
            if (synonym !== null && record !== null) {
                context.report({
                    data: { canonical: record.canonical, concept: record.concept, synonym },
                    loc: locOf(node),
                    messageId: "retiredSynonym",
                });
            }
        };
        return listener({
            literal(view) {
                const text = literalString(view);
                if (text !== null) {
                    report(view, text);
                }
            },
            program(view) {
                code = codeLiteralsOf(view);
            },
            templateLiteral(view) {
                report(view, quasiTexts(view).join(" "));
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:semantic-consistency"] }),
            description:
                "A user-visible string names each concept by its one canonical term. The term registry records, per concept, the canonical name and the synonyms it retires, and the rule matches a retired synonym at word boundaries inside every literal and template quasi of a strings module, so a concept never reads as two things. The registry is data; the rule never changes when a term is added. A literal consumed as a code sample is code, not prose, and is not held to the registry.",
        },
        messages: {
            retiredSynonym:
                "The literal names the concept '{{concept}}' as '{{synonym}}'. The term registry retires that word in favor of '{{canonical}}'; restate the sentence with the canonical term.",
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    terms: {
                        items: {
                            additionalProperties: false,
                            properties: {
                                canonical: { type: "string" },
                                concept: { type: "string" },
                                synonyms: { items: { type: "string" }, type: "array" },
                            },
                            required: ["canonical", "concept", "synonyms"],
                            type: "object",
                        },
                        type: "array",
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
} satisfies LocalRule;
