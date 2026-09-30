import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { FILE_LENGTH } from "../../shared/generated/thresholds.generated.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { isStandaloneScript } from "../../shared/predicates/location.predicate.ts";
import { listener } from "../../shared/factories/listener.factory.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";

const EXEMPT_SUFFIXES = [".test.ts", ".spec.ts", ".d.ts", ".generated.ts", ".json", concernSuffix("strings")];

const isExempt = function isExempt(filename: string): boolean {
    if (isStandaloneScript(filename)) {
        return true;
    }
    const norm = normalizePath(filename);
    for (const suffix of EXEMPT_SUFFIXES) {
        if (norm.endsWith(suffix)) {
            return true;
        }
    }
    return false;
};

const countLines = function countLines(text: string): number {
    let count = 0;
    for (const line of text.split("\n")) {
        if (line.trim().length > 0) {
            count += 1;
        }
    }
    return count;
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        if (isExempt(filename)) {
            return {};
        }
        return listener({
            program(_view, node) {
                const count = countLines(context.sourceCode.getText());
                if (count <= FILE_LENGTH) {
                    return;
                }
                const basename = normalizePath(filename).split("/").pop() ?? filename;
                const payload = { count: String(count), file: basename, max: String(FILE_LENGTH) };
                context.report({ data: payload, messageId: "tooLong", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:god-object"],
                enforces: ["architecture:single-responsibility"],
            }),
            description:
                "Every file stays within the one line budget the quality config declares, counted in non-blank lines. The budget is derived from the config into the generated thresholds module before any rule loads, so the number has one home and this rule restates nothing. A strings module is exempt: it is a catalog of copy, and its length is decided by the content it carries rather than by a concern that could be split. A standalone server script is exempt because it ships as one file and can import nothing.",
        },
        messages: {
            tooLong:
                "`{{ file }}` is {{ count }} non-blank lines, over the {{ max }}-line budget the quality config declares. Split it by concern.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
