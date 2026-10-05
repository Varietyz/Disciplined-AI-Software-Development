import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const HREF = "href=";
const QUOTES = "\"'";

const writesHrefValue = function writesHrefValue(text: string): boolean {
    let from = text.indexOf(HREF);
    while (from !== -1) {
        const quote = from + HREF.length;
        if (QUOTES.includes(text.charAt(quote)) && quote + 1 < text.length) {
            return true;
        }
        from = text.indexOf(HREF, quote);
    }
    return false;
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        const report = function report(node: AstNode, texts: readonly string[]): void {
            if (texts.some(writesHrefValue)) {
                context.report({ loc: locOf(node), messageId: "handBuiltHref" });
            }
        };
        return listener({
            literal(view) {
                const text = literalString(view);
                if (text !== null) {
                    report(view, [text]);
                }
            },
            templateLiteral(view) {
                report(
                    view,
                    nodesAt(view, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked")),
                );
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "A user-visible string never writes the value of an href. Every link in copy takes its value from a link helper or a link constant inside a template expression, so the quote that opens the value is the last character of its literal or template quasi. A value written in the text does not change when the page, tab or section it points to is renamed or moved.",
        },
        messages: {
            handBuiltHref:
                "This href is written by hand and does not follow a rename or move of the page, tab or section it points to. Build it with a link helper such as tabLink, pagePath or faceLink.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
