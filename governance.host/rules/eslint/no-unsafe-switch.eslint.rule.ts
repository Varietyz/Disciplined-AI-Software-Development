import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { literalString, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const SWITCH_PREFIX = "--";
const VALUE_SEPARATOR = "=";
const WORD_SEPARATOR = "-";
const SAFETY_OFF_WORDS: ReadonlySet<string> = new Set(["unsafe"]);

const isUnsafeSwitch = function isUnsafeSwitch(text: string): boolean {
    if (!text.startsWith(SWITCH_PREFIX)) {
        return false;
    }
    const [name = ""] = text.slice(SWITCH_PREFIX.length).split(VALUE_SEPARATOR);
    return name.split(WORD_SEPARATOR).some((word) => SAFETY_OFF_WORDS.has(word));
};

export default {
    create(context: RuleContext): RuleListener {
        return listener({
            literal(view, node) {
                const text = literalString(view);
                if (text !== null && isUnsafeSwitch(text)) {
                    context.report({ messageId: "unsafeSwitch", node });
                }
            },
            templateLiteral(view, node) {
                const [head] = nodesAt(view, "quasis");
                if (isUnsafeSwitch(stringIn(recordAt(head ?? null, "value"), "cooked"))) {
                    context.report({ messageId: "unsafeSwitch", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:secure-by-default"] }),
            description:
                "A process switch that turns a safety mechanism off is never passed to make something work. A command-line switch whose name carries a safety-off word is reported at the source, so the supported setting that gives the result is found and used instead.",
        },
        messages: {
            unsafeSwitch:
                "This switch turns a safety mechanism off. Measure which supported setting gives the result and pass that; when no supported setting does, the capability is reported as unavailable, never forced.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
