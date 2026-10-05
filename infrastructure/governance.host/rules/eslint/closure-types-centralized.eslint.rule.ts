import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { basenameOf, isInContainer, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { concernForPath, concernSuffix, isImportedRoot, rootFor } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const TYPES_CONCERN = "types";
const TYPES_SUFFIXES = [concernSuffix(TYPES_CONCERN)];

const isTypesFile = function isTypesFile(basename: string): boolean {
    return TYPES_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const inTypeBucket = function inTypeBucket(filename: string): boolean {
    const path = normalizePath(filename);
    if (isImportedRoot(rootFor(path))) {
        return concernForPath(path) === TYPES_CONCERN;
    }
    return isInContainer(filename, TYPES_CONCERN);
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        const basename = basenameOf(filename);
        if (!isTypesFile(basename) || inTypeBucket(filename)) {
            return {};
        }
        return listener({
            program(_view, node) {
                context.report({ data: { basename }, messageId: "misplacedTypesFile", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:separation-of-concerns"] }),
            description:
                "A types file lives in the type bucket its own governed root declares. Type definitions have a change axis of their own — type review, schema evolution, contract audits — separate from the runtime code that happens to use them first, and centralizing the whole surface in one flat bucket is what makes reviewing it as a surface possible. Scattered type files dilute the code files they sit next to and can only be found by searching.",
        },
        messages: {
            misplacedTypesFile:
                "Types file '{{basename}}' sits outside the type bucket its root declares. Move it there — an interface audit, a generic-constraint refactor or a schema migration all need the whole type surface in one flat location.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
