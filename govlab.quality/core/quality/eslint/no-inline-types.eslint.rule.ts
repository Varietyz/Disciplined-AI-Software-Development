import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";
import { inHostScope } from "#core/predicates/eslint.predicate";

const TYPE_TAGS = [
    "@type",
    "@typedef",
    "@interface",
    "@callback",
    "@enum",
    "@template",
    "@property",
    "@param",
    "@returns",
    "@return",
    "@throws",
    "@yields",
    "@yield",
];
const BOUNDARY_CHARS = new Set([" ", "\t", "{", "\n"]);

const tagMatches = function tagMatches(text: string, tag: string): boolean {
    let searchFrom = 0;
    while (searchFrom < text.length) {
        const idx = text.indexOf(tag, searchFrom);
        if (idx === -1) {
            return false;
        }
        const after = text.at(idx + tag.length);
        if (typeof after !== "string" || BOUNDARY_CHARS.has(after)) {
            return true;
        }
        searchFrom = idx + tag.length;
    }
    return false;
};

const firstTypeTag = function firstTypeTag(text: string): string | null {
    return TYPE_TAGS.find((tag) => tagMatches(text, tag)) ?? null;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        if (!inHostScope(context)) {
            return {};
        }
        const { sourceCode } = context;
        const onProgram = (): void => {
            for (const comment of sourceCode.getAllComments()) {
                const tag = firstTypeTag(comment.value);
                const { loc } = comment;
                if (tag !== null && loc) {
                    context.report({ data: { tag }, loc, messageId: "inlineType" });
                }
            }
        };
        const handlers: [string, () => void][] = [["Program", onProgram]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["type-safety"],
        description: "Forbid inline JSDoc type annotations; declare types at the source signature/interface",
        messages: {
            inlineType:
                'Inline JSDoc type tag "{{tag}}" detected. The type pipeline strips inline type comments and corrupts the file — declare the type at the function signature or interface, not in a comment.',
        },
        ruleId: "no_inline_types",
    }),
} satisfies Rule.RuleModule;
