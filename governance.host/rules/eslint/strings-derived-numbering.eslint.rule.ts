import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { NUMBERED_NOUNS } from "../../shared/manifests/vocabulary.manifest.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { numberedPhraseIn } from "../../shared/matchers/vocabulary.matcher.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const SPACE = " ";

const quasiTexts = function quasiTexts(node: AstNode): string[] {
    return nodesAt(node, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked"));
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        const report = function report(node: AstNode, text: string): void {
            const phrase = numberedPhraseIn(text, NUMBERED_NOUNS);
            if (phrase !== null) {
                const noun = phrase.slice(0, phrase.indexOf(SPACE)).toLowerCase();
                context.report({ data: { noun, phrase }, loc: locOf(node), messageId: "handNumbered" });
            }
        };
        return listener({
            literal(view) {
                const text = literalString(view);
                if (text !== null) {
                    report(view, text);
                }
            },
            templateLiteral(view) {
                report(view, quasiTexts(view).join(" "));
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "A user-visible string never writes the number of a figure, example, table, section or other captioned part by hand. A number written by hand goes out of date when a part is added, removed or moved, so copy refers to the part by its caption or its title. The nouns are data in the vocabulary manifest; the rule matches a noun followed by a space and digits inside every literal and template quasi of a strings module.",
        },
        messages: {
            handNumbered:
                "'{{phrase}}' writes a number by hand, which goes out of date when a {{noun}} is added, removed or moved. Refer to the {{noun}} by its caption with <cite>, or by its title as a link.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
