import { JOIN_CAP, SENTENCE_CAP } from "../../shared/manifests/sentence.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { STRINGS_CHANNEL, isCheckEnforced } from "../../shared/manifests/writing.canon.manifest.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import type { SentenceShape } from "../../types/writing.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { codeLiteralsOf } from "../../shared/selectors/literal.selector.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { shapesOf } from "../../shared/analyzers/sentence.analyzer.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const CAP_ENFORCED = isCheckEnforced("sentence-cap", STRINGS_CHANNEL);
const AGENT_ENFORCED = isCheckEnforced("named-agent", STRINGS_CHANNEL);
const JOIN_ENFORCED = isCheckEnforced("one-instruction-per-sentence", STRINGS_CHANNEL);
const ANY_ENFORCED = CAP_ENFORCED || AGENT_ENFORCED || JOIN_ENFORCED;

const quasiTexts = function quasiTexts(node: AstNode): string {
    return nodesAt(node, "quasis")
        .map((part) => stringIn(recordAt(part, "value"), "cooked"))
        .join(" ");
};

const reportShape = function reportShape(context: RuleContext, node: AstNode, shape: SentenceShape): void {
    const loc = locOf(node);
    if (CAP_ENFORCED && shape.words > SENTENCE_CAP) {
        context.report({ data: { cap: String(SENTENCE_CAP), words: String(shape.words) }, loc, messageId: "overCap" });
    }
    if (AGENT_ENFORCED && shape.agentlessPassive) {
        context.report({ loc, messageId: "agentlessPassive" });
    }
    if (JOIN_ENFORCED && shape.joins > JOIN_CAP) {
        context.report({ data: { joins: String(shape.joins) }, loc, messageId: "chainedInstructions" });
    }
};

export default {
    create(context: RuleContext): RuleListener {
        if (!ANY_ENFORCED || !basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        let code: ReadonlySet<AstNode> = new Set();
        const report = function report(node: AstNode, text: string): void {
            if (code.has(node)) {
                return;
            }
            for (const shape of shapesOf(text)) {
                reportShape(context, node, shape);
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
                "A sentence in user-visible copy has the shape the writing policy declares: it stays under the word cap, it names the agent when it is passive, and it carries one instruction rather than a chain. Each shape is one rule record in the writing registry with its own enforced flag, so the operator turns a shape on by editing data and this rule never changes; the tone baseline reports the same three measurements so the switch is read from a count. A literal consumed as a code sample is code, not prose, and is not held to the policy.",
        },
        messages: {
            agentlessPassive:
                "The sentence is passive and names no agent, so the reader cannot tell who does the thing. Name the agent, or write the sentence active with the doer as its subject.",
            chainedInstructions:
                "The sentence chains {{joins}} coordinated parts, so it carries more than one instruction. Split it so each sentence carries one.",
            overCap:
                "The sentence runs to {{words}} words and the cap is {{cap}}. A long sentence hides a nested clause; split it at the clause boundary.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
