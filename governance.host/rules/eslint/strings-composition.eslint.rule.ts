import type { CompositionFinding, CompositionKind } from "../../types/writing.types.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { STRINGS_CHANNEL, isCheckEnforced } from "../../shared/manifests/writing.canon.manifest.ts";
import { compositionFindingsOf, fieldRestates } from "../../shared/analyzers/composition.analyzer.ts";
import {
    literalString,
    locOf,
    nameOf,
    nodeAt,
    nodesAt,
    recordAt,
    stringIn,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { CHECK_BY_KIND } from "../../shared/manifests/composition.manifest.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { codeLiteralsOf } from "../../shared/selectors/literal.selector.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const KIND_KEY = "kind";
const LESSON_KIND = "lesson";
const TEMPLATE_TYPE = "TemplateLiteral";
const QUASI_JOIN = " ";
const EXCERPT_LENGTH = 80;
const ELLIPSIS = "…";

type Reporter = (context: RuleContext, loc: ReturnType<typeof locOf>, data: Record<string, string>) => void;

const REPORTER_BY_KIND: ReadonlyMap<CompositionKind, Reporter> = new Map<CompositionKind, Reporter>([
    [
        "comment",
        (context, loc, data) => {
            context.report({ data, loc, messageId: "commentOnPrevious" });
        },
    ],
    [
        "filler",
        (context, loc, data) => {
            context.report({ data, loc, messageId: "fillerPhrase" });
        },
    ],
    [
        "party",
        (context, loc, data) => {
            context.report({ data, loc, messageId: "namedParty" });
        },
    ],
    [
        "restatement",
        (context, loc, data) => {
            context.report({ data, loc, messageId: "restatement" });
        },
    ],
]);

const FIELD_ENFORCED = isCheckEnforced("no-field-restatement", STRINGS_CHANNEL);

const excerpt = function excerpt(text: string): string {
    return text.length <= EXCERPT_LENGTH ? text : text.slice(0, EXCERPT_LENGTH) + ELLIPSIS;
};

const textOf = function textOf(node: AstNode): string | null {
    if (node.type !== TEMPLATE_TYPE) {
        return literalString(node);
    }
    return nodesAt(node, "quasis")
        .map((part) => stringIn(recordAt(part, "value"), "cooked"))
        .join(QUASI_JOIN);
};

const keyOf = function keyOf(prop: AstNode): string {
    const key = nodeAt(prop, "key");
    if (key === null) {
        return "";
    }
    return key.type === "Identifier" ? nameOf(key) : (literalString(key) ?? "");
};

interface Field {
    readonly name: string;
    readonly node: AstNode;
    readonly text: string;
}

const fieldsOf = function fieldsOf(objectExpr: AstNode): readonly Field[] {
    return nodesAt(objectExpr, "properties").flatMap((prop) => {
        const value = nodeAt(prop, "value");
        const text = value === null ? null : textOf(value);
        const name = keyOf(prop);
        return value === null || text === null || name === KIND_KEY ? [] : [{ name, node: value, text }];
    });
};

const isLesson = function isLesson(objectExpr: AstNode): boolean {
    return nodesAt(objectExpr, "properties").some(
        (prop) => keyOf(prop) === KIND_KEY && literalString(nodeAt(prop, "value")) === LESSON_KIND,
    );
};

const reportFinding = function reportFinding(context: RuleContext, node: AstNode, finding: CompositionFinding): void {
    const rule = CHECK_BY_KIND.get(finding.kind);
    const report = REPORTER_BY_KIND.get(finding.kind);
    if (rule === undefined || report === undefined || !isCheckEnforced(rule, STRINGS_CHANNEL)) {
        return;
    }
    report(context, locOf(node), { evidence: excerpt(finding.evidence), sentence: excerpt(finding.sentence) });
};

const reportFields = function reportFields(context: RuleContext, lesson: AstNode): void {
    const fields = fieldsOf(lesson);
    for (const [at, field] of fields.entries()) {
        const echoed = fields.slice(0, at).find((earlier) => fieldRestates(earlier.text, field.text));
        if (echoed !== undefined) {
            context.report({
                data: { field: field.name, other: echoed.name },
                loc: locOf(field.node),
                messageId: "fieldRestatement",
            });
        }
    }
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        let code: ReadonlySet<AstNode> = new Set();
        const check = function check(node: AstNode): void {
            const text = code.has(node) ? null : textOf(node);
            for (const finding of text === null ? [] : compositionFindingsOf(text)) {
                reportFinding(context, node, finding);
            }
        };
        return listener({
            literal(view) {
                check(view);
            },
            objectExpression(view) {
                if (FIELD_ENFORCED && isLesson(view)) {
                    reportFields(context, view);
                }
            },
            program(view) {
                code = codeLiteralsOf(view);
            },
            templateLiteral(view) {
                check(view);
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:standardization"] }),
            description:
                "Copy says each thing once and never talks about itself. A sentence that opens by pointing back at the sentence before it comments instead of informing; a phrase that announces, emphasizes or rephrases delays the fact it carries; a sentence whose content words mostly repeat an earlier sentence in the same passage carries the same proposition twice; and a lesson field that repeats another field of the same lesson gives the reader the same claim in a second place. The openers, the phrases, the function words and the overlap threshold are data in the composition manifest, and each shape has its own enforced flag there, so the policy changes by editing data and never this rule. A literal consumed as a code sample is code, not prose, and is not held to the policy.",
        },
        messages: {
            commentOnPrevious:
                "The sentence '{{sentence}}' opens with '{{evidence}}', pointing back at the sentence before it instead of adding a fact. Fold what it adds into the earlier sentence, or delete it.",
            fieldRestatement:
                "The lesson field '{{field}}' repeats most of the content words of the field '{{other}}'. Each field answers its own question: rewrite '{{field}}' to carry what only it can say.",
            fillerPhrase:
                "The sentence '{{sentence}}' carries '{{evidence}}', a phrase that announces or rephrases instead of informing. Delete the phrase and state the fact.",
            namedParty:
                "The sentence '{{sentence}}' gives its action to '{{evidence}}', an actor with no name. Name the party that acts: the model, the developer or the tooling.",
            restatement:
                "The sentence '{{sentence}}' repeats most of the content words of '{{evidence}}' in the same passage. Keep the sentence that carries the proposition, and delete or rewrite the other.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
