import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isDiagramSource, reservedNodeIdsOf } from "../../shared/analyzers/diagram.analyzer.ts";
import { literalString, locOf, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { diagramLiteralsOf } from "../../shared/selectors/literal.selector.ts";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_SUFFIX = concernSuffix("strings");

const quasiText = function quasiText(node: AstNode): string {
    return nodesAt(node, "quasis")
        .map((part) => stringIn(recordAt(part, "value"), "cooked"))
        .join("");
};

const sourceOf = function sourceOf(node: AstNode): string | null {
    return node.type === "TemplateLiteral" ? quasiText(node) : literalString(node);
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        const report = function report(node: AstNode): void {
            const source = sourceOf(node);
            if (source === null || !isDiagramSource(source)) {
                return;
            }
            for (const found of reservedNodeIdsOf(source)) {
                context.report({
                    data: { line: String(found.line), word: found.word },
                    loc: locOf(node),
                    messageId: "reservedNodeId",
                });
            }
        };
        return listener({
            program(view) {
                for (const literal of diagramLiteralsOf(view)) {
                    report(literal);
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:fail-fast"] }),
            description:
                "A diagram source in a strings module never names a node with one of the diagram grammar's own keywords. The grammar reads such a line as the keyword rather than the node, so the diagram fails to parse at build time, in the render stage, long after the copy was written; this rule reads the same source at lint time and reports the identifier where it is declared or used as an edge end. The keyword set is data in the diagram manifest, so a grammar that gains a keyword is one entry, and a node meant to carry that word takes a different identifier with the word as its label.",
        },
        messages: {
            reservedNodeId:
                "Diagram line {{line}} uses `{{word}}` as a node identifier, and the diagram grammar reserves that word. Rename the node identifier and keep the word in the node's label.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
