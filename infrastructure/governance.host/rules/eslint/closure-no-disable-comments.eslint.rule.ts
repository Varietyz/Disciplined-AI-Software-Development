import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const BANNED_PREFIXES = ["eslint-disable", "eslint-enable", "stylelint-disable", "stylelint-enable"];
const PREVIEW_LENGTH = 60;

const isBannedDirective = function isBannedDirective(value: string): boolean {
    const trimmed = value.trimStart();
    return BANNED_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
};

export default {
    create(context: RuleContext): RuleListener {
        const src = context.sourceCode;
        return listener({
            program(): void {
                for (const comment of src.getAllComments()) {
                    const at = comment.loc;
                    if (!isBannedDirective(comment.value) || at === null || at === undefined) {
                        continue;
                    }
                    const preview = comment.value.trim().slice(0, PREVIEW_LENGTH).split("\n")[0] ?? "";
                    context.report({ data: { preview }, loc: at, messageId: "banned" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:policy-as-code"] }),
            description:
                "Bans `eslint-disable*` and `stylelint-disable*` comment directives. The `no-comments` rule exempts these to allow tooling directives, but the codebase's policy is no per-site rule disabling — if a rule fires on something genuinely correct, refine the rule or restructure the code. Inline-disable as escape hatch undermines architectural discipline.",
        },
        messages: {
            banned: "Disable directive `{{ preview }}` — disabling rules per-site masks architectural debt. Fix the underlying violation OR refine the rule. Inline-disable is banned codebase-wide.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
