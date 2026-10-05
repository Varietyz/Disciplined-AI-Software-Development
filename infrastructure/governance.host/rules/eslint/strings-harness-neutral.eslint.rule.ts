import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { HARNESS_TOKENS } from "../../shared/manifests/vocabulary.manifest.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { firstTermIn } from "../../shared/matchers/vocabulary.matcher.ts";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_SUFFIX = concernSuffix("strings");

const quasiTexts = function quasiTexts(node: AstNode): string[] {
    return nodesAt(node, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked"));
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        const report = function report(node: AstNode, text: string): void {
            const token = firstTermIn(text, HARNESS_TOKENS);
            if (token !== null) {
                context.report({ data: { token }, loc: locOf(node), messageId: "harnessToken" });
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
            checks: defineCheck({ detects: [], enforces: ["architecture:platform-independence"] }),
            description:
                "A user-visible string names no feature of one harness. Public copy and its samples state semantic operations and slots that a binding resolves to whichever harness runs them, so a tool name, a configuration file, a hook event or a product name of one harness in a strings module locks the published practice to that harness. The registry holds the classified names as data; the rule matches each at word boundaries inside every literal and template quasi of a strings module, code samples included, because a sample is where the lock-in lives.",
        },
        messages: {
            harnessToken:
                "'{{token}}' names a feature of one harness. Restate it as the semantic operation or the slot a binding resolves, and keep the harness name out of user-visible copy; the registry is data, so widening it is a maintainer edit, never a rewrite of this rule.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
