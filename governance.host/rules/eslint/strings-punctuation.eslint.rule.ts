import { LONG_DASH, METRIC_UNITS, PUNCTUATION_POLICY, SEMICOLON } from "../../shared/manifests/punctuation.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { codeLiteralsOf } from "../../shared/selectors/literal.selector.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const WORD_STOPS = new Set([" ", "\n", "\t", ",", ";", ":", "!", "?", "(", ")", '"', "'", "*", "`"]);

const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const wordsOf = function wordsOf(text: string): string[] {
    const words: string[] = [];
    let current = "";
    for (const char of text) {
        if (WORD_STOPS.has(char)) {
            if (current.length > 0) {
                words.push(current);
            }
            current = "";
        } else {
            current += char;
        }
    }
    if (current.length > 0) {
        words.push(current);
    }
    return words;
};

const trimTerminal = function trimTerminal(word: string): string {
    let end = word.length;
    while (end > 0 && word.charAt(end - 1) === ".") {
        end -= 1;
    }
    return word.slice(0, end);
};

const isNumeric = function isNumeric(stem: string): boolean {
    for (let index = 0; index < stem.length; index += 1) {
        const char = stem.charAt(index);
        if (!isDigit(char) && char !== ".") {
            return false;
        }
    }
    return stem.length > 0;
};

const isDigitMetric = function isDigitMetric(word: string): boolean {
    const lower = trimTerminal(word.toLowerCase());
    const unit = METRIC_UNITS.find((held) => lower.endsWith(held) && lower.length > held.length);
    return unit === undefined ? false : isNumeric(lower.slice(0, -unit.length));
};

const digitMetricIn = function digitMetricIn(text: string): string | null {
    const found = wordsOf(text).find(isDigitMetric);
    return found === undefined ? null : trimTerminal(found);
};

const quasiTexts = function quasiTexts(node: AstNode): string {
    return nodesAt(node, "quasis")
        .map((part) => stringIn(recordAt(part, "value"), "cooked"))
        .join(" ");
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        let code: ReadonlySet<AstNode> = new Set();
        const report = function report(node: AstNode, text: string): void {
            if (code.has(node)) {
                return;
            }
            if (PUNCTUATION_POLICY.longDash && text.includes(LONG_DASH)) {
                context.report({ loc: locOf(node), messageId: "longDash" });
            }
            if (PUNCTUATION_POLICY.semicolon && text.includes(SEMICOLON)) {
                context.report({ loc: locOf(node), messageId: "semicolon" });
            }
            const metric = PUNCTUATION_POLICY.digitMetric ? digitMetricIn(text) : null;
            if (metric !== null) {
                context.report({ data: { metric }, loc: locOf(node), messageId: "digitMetric" });
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
                report(view, quasiTexts(view));
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:standardization"] }),
            description:
                "A user-visible string honors the punctuation policy the registry declares: no long dash where the policy refuses it, no semicolon where it refuses it, and no digit-form metric standing beside a unit or a percent sign, because a number in copy is a claim that needs a measurement behind it. Each half of the policy is a boolean in the registry, so the operator turns a half on by editing data and the rule never changes. A literal consumed as a code sample is code, not prose, and is not held to the policy.",
        },
        messages: {
            digitMetric:
                "The literal states the digit-form metric '{{metric}}'. A number in user-visible copy is a measured claim; state the shape in words, or carry the measurement into a generated surface where the number is derived.",
            longDash:
                "The literal carries a long dash and the punctuation policy refuses it. Split the sentence or use the separator the policy allows.",
            semicolon:
                "The literal carries a semicolon and the punctuation policy refuses it. Split the sentence in two.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
