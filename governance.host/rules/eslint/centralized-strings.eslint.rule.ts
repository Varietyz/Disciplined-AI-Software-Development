import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { basenameOf, normalizePath, projectDirs } from "../../shared/resolvers/anchor.resolver.ts";
import { concernFolders } from "../../shared/resolvers/container.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const STRINGS_CONCERN = "strings";
const STRINGS_ROOTS = concernFolders(STRINGS_CONCERN, projectDirs());
const STRINGS_SUFFIXES = [concernSuffix(STRINGS_CONCERN)];

const isStringsFile = function isStringsFile(basename: string): boolean {
    return STRINGS_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const isInStringsRoot = function isInStringsRoot(filename: string): boolean {
    const norm = normalizePath(filename);
    return STRINGS_ROOTS.some((root) => norm.startsWith(root) || norm.includes(`/${root}`));
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        const basename = basenameOf(filename);
        if (!isStringsFile(basename) || isInStringsRoot(filename)) {
            return {};
        }
        return listener({
            program(_view, node) {
                context.report({ data: { basename }, messageId: "misplacedStringsFile", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "A file carrying a concern's suffix must live in a folder declared for that concern. An editorial surface has a review axis of its own, separate from the code that consumes it, so the whole surface has to be reachable in one place. Following the suffix convention in an undeclared folder defeats the centralization while appearing to honor it.",
        },
        messages: {
            misplacedStringsFile:
                "'{{basename}}' carries a centralized concern's suffix but sits outside every folder declared for that concern. Move it into one of them — a surface reviewed as a whole cannot be scattered across the code that consumes it.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
