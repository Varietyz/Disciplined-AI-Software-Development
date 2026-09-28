import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { TEST_ROOT_SEGMENT, basenameOf, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const TEST_SUFFIXES = [".test.ts", ".spec.ts"];

const isTestFile = function isTestFile(basename: string): boolean {
    return TEST_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        const basename = basenameOf(filename);
        if (!isTestFile(basename) || normalizePath(filename).includes(TEST_ROOT_SEGMENT)) {
            return {};
        }
        return listener({
            program(_view, node) {
                context.report({ data: { basename }, messageId: "misplacedTestFile", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:mirrored-test-placement"] }),
            description:
                "A test file must live under the centralized test root, in the container for the member it covers, mirroring that member's source tree. A test beside its source defeats the one axis the centralization exists for — running the whole surface, finding the gaps, and reading coverage as a structure parallel to the code.",
        },
        messages: {
            misplacedTestFile:
                "Test file '{{basename}}' lives outside the centralized test root. Move it under that root, into the container for the member it covers, at the path mirroring the subject's own — the mirror is what makes a missing test visible as a missing folder.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
