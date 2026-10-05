import type { LocalRule, RuleContext, RuleFixer, RuleListener } from "../../types/rule.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const DIRECTIVE_PREFIXES = [
    "eslint-disable",
    "eslint-enable",
    "eslint-env",
    "global ",
    "globals ",
    "@ts-",
    "!",
    "c8",
    "/",
];

const PREVIEW_LENGTH = 60;
const NEWLINE_CODE = 10;
const SPACE_CODE = 32;

const isDirective = function isDirective(value: string): boolean {
    const trimmed = value.trimStart();
    return DIRECTIVE_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
};

export default {
    create(context: RuleContext): RuleListener {
        const src = context.sourceCode;
        return listener({
            program(): void {
                for (const comment of src.getAllComments()) {
                    const at = comment.loc;
                    const { range } = comment;
                    if (isDirective(comment.value) || range === undefined || at === null || at === undefined) {
                        continue;
                    }
                    const preview = comment.value.trim().slice(0, PREVIEW_LENGTH).replaceAll("\n", " ");
                    const payload = { preview };
                    const [start, rawEnd] = range;
                    context.report({
                        data: payload,
                        fix(fixer: RuleFixer) {
                            let end = rawEnd;
                            const text = src.getText();
                            if (end < text.length && (text.codePointAt(end) ?? 0) === NEWLINE_CODE) {
                                end += 1;
                            }
                            const lineStart = text.slice(0, start).lastIndexOf("\n") + 1;
                            if (text.slice(lineStart, start).trim().length === 0) {
                                return fixer.removeRange([lineStart, end]);
                            }
                            let trimStart = start;
                            while (trimStart > lineStart && (text.codePointAt(trimStart - 1) ?? 0) === SPACE_CODE) {
                                trimStart -= 1;
                            }
                            return fixer.removeRange([trimStart, end]);
                        },
                        loc: at,
                        messageId: "report",
                    });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: [] }),
            description: "Remove all comments — code is self-documenting",
        },
        fixable: "code",
        messages: {
            report: 'Comment "{{ preview }}" — delete it. If intent is unclear without prose, rename. Auto-fix removes.',
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
