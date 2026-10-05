import type { Rule } from "eslint";

const TYPE_TAGS = [
    "@type",
    "@param",
    "@returns",
    "@return",
    "@property",
    "@prop",
    "@typedef",
    "@template",
    "@callback",
    "@arg",
    "@argument",
    "@yields",
    "@yield",
];

const MESSAGE =
    "JSDoc type tag '{{tag}}' detected in '.js' source. " +
    "Workspace packages express types in TypeScript source ('.ts'), not in JSDoc comments — a JSDoc-typed surface cannot be mechanically checked, refactored, or distributed as a typed package the same way TS source can. " +
    "Either convert this file to TypeScript ('.ts'), or move the type declaration into a sidecar 'types/*.d.ts' file next to 'src/' and reference it from your tsconfig's 'include'. " +
    "[no_jsdoc_type_tags]";

const TAG_BOUNDARIES = new Set(["", " ", "\t", "\n", "{"]);
const SELECTORS = ["Program"];

const isWorkspaceSource = function isWorkspaceSource(filename: string): boolean {
    if (filename.length === 0) {
        return false;
    }
    const normalized = filename.replaceAll("\\", "/");
    return normalized.endsWith(".ts") || normalized.endsWith(".mts");
};

const commentContainsTag = function commentContainsTag(text: string): string | null {
    for (const tag of TYPE_TAGS) {
        const idx = text.indexOf(tag);
        if (idx !== -1 && TAG_BOUNDARIES.has(text.charAt(idx + tag.length))) {
            return tag;
        }
    }
    return null;
};

export default {
    create(context): Rule.RuleListener {
        if (!isWorkspaceSource(context.filename)) {
            return {};
        }
        const listeners: Rule.RuleListener = {};
        for (const selector of SELECTORS) {
            listeners[selector] = (): void => {
                for (const comment of context.sourceCode.getAllComments()) {
                    const tag = commentContainsTag(comment.value);
                    if (tag !== null && comment.loc) {
                        context.report({ data: { tag }, loc: comment.loc, messageId: "jsdocTypeTag" });
                    }
                }
            };
        }
        return listeners;
    },

    meta: {
        docs: {
            description:
                "Ban JSDoc type tags (@type, @param, @returns, @typedef, etc.) in workspace '.js' source — types belong in TypeScript source or sidecar '.d.ts' files, not in comment annotations.",
        },
        messages: { jsdocTypeTag: MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
