import { IMPERATIVE_OPENERS, NON_IMPERATIVE_OPENERS } from "../../shared/manifests/sentence.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { STRINGS_CHANNEL, isCheckEnforced } from "../../shared/manifests/writing.canon.manifest.ts";
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
import { LESSON_FIELD_MOODS } from "../../shared/manifests/writing.prose.manifest.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { sentenceWordsOf } from "../../shared/analyzers/sentence.analyzer.ts";

const STRINGS_SUFFIX = concernSuffix("strings");
const KIND_KEY = "kind";
const LESSON_KIND = "lesson";
const MOOD_ENFORCED = isCheckEnforced("field-mood", STRINGS_CHANNEL);

interface Field {
    readonly name: string;
    readonly node: AstNode;
    readonly opensWithText: boolean;
    readonly text: string;
}

interface Reading {
    readonly opensWithText: boolean;
    readonly text: string;
}

const propertyKeyOf = function propertyKeyOf(prop: AstNode): string {
    const key = nodeAt(prop, "key");
    if (key === null) {
        return "";
    }
    return key.type === "Identifier" ? nameOf(key) : (literalString(key) ?? "");
};

const isLessonObject = function isLessonObject(objectExpr: AstNode): boolean {
    return nodesAt(objectExpr, "properties").some(
        (prop) =>
            prop.type === "Property" &&
            propertyKeyOf(prop) === KIND_KEY &&
            literalString(nodeAt(prop, "value")) === LESSON_KIND,
    );
};

const TEMPLATE_TYPE = "TemplateLiteral";
const QUASI_JOIN = " ";

const templateReading = function templateReading(value: AstNode): Reading | null {
    if (value.type !== TEMPLATE_TYPE) {
        return null;
    }
    const parts = nodesAt(value, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked"));
    const joined = parts.join(QUASI_JOIN);
    const computed = nodesAt(value, "expressions").length > 0;
    return {
        opensWithText: (parts[0] ?? "").trim().length > 0,
        text: joined.trim().length === 0 && computed ? QUASI_JOIN : joined,
    };
};

const readingOf = function readingOf(value: AstNode): Reading | null {
    const text = literalString(value);
    return text === null ? templateReading(value) : { opensWithText: true, text };
};

const stringFields = function stringFields(objectExpr: AstNode): Field[] {
    const found: Field[] = [];
    for (const prop of nodesAt(objectExpr, "properties")) {
        const value = nodeAt(prop, "value");
        const reading = value === null ? null : readingOf(value);
        if (prop.type === "Property" && value !== null && reading !== null) {
            found.push({ name: propertyKeyOf(prop), node: value, ...reading });
        }
    }
    return found;
};

const moodMismatchOf = function moodMismatchOf(field: Field): string | null {
    const mood = LESSON_FIELD_MOODS[field.name];
    const [opener] = sentenceWordsOf(field.text);
    if (mood === undefined || opener === undefined || !field.opensWithText) {
        return null;
    }
    if (mood === "imperative" && NON_IMPERATIVE_OPENERS.has(opener)) {
        return mood;
    }
    return mood === "declarative" && IMPERATIVE_OPENERS.has(opener) ? mood : null;
};

export default {
    create(context: RuleContext): RuleListener {
        if (!basenameOf(context.filename).endsWith(STRINGS_SUFFIX)) {
            return {};
        }
        return listener({
            objectExpression(view) {
                if (!isLessonObject(view)) {
                    return;
                }
                for (const field of stringFields(view)) {
                    if (field.text === "") {
                        context.report({
                            data: { field: field.name },
                            loc: locOf(field.node),
                            messageId: "emptyField",
                        });
                        continue;
                    }
                    const mood = MOOD_ENFORCED ? moodMismatchOf(field) : null;
                    if (mood !== null) {
                        context.report({
                            data: { field: field.name, mood },
                            loc: locOf(field.node),
                            messageId: "moodMismatch",
                        });
                    }
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:standardization"] }),
            description:
                "A lesson block carries every field of the pedagogical contract with content, and each field is written in the mood the writing registry declares for it. The type-checker holds presence; this rule holds non-emptiness, because an empty string satisfies the type while teaching nothing, and it holds the mood by the field's opening word: an imperative field never opens with an article, a pronoun or a subordinator, and a declarative field never opens with a bare instruction verb. A field written as a template literal is read through its literal parts, so a field that carries a computed link is held to the same contract as a plain string; a field that opens with a computed part has no readable opening word, so its mood is not judged. The mood table and both opener sets are data, so the contract changes by editing them and never by editing this rule.",
        },
        messages: {
            emptyField:
                "The lesson field '{{field}}' is empty. Every field of a lesson carries content, or the block is not a lesson yet — fill the field or keep the block out of the published set.",
            moodMismatch:
                "The lesson field '{{field}}' is declared {{mood}} and its opening word says otherwise. An imperative field opens with the verb; a declarative field opens with its subject. Rewrite the first sentence in the declared mood.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
