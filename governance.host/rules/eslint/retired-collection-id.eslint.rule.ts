import { COLLECTION_PATH_SEGMENTS, RENAMED_COLLECTIONS } from "../../shared/manifests/vocabulary.manifest.ts";
import type { LocalRule, RuleContext, RuleListener, RuleNode } from "../../types/rule.types.ts";
import { renamedSpans, renamedText } from "../../shared/matchers/word.matcher.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import type { RenameRules } from "../../types/writing.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { locOf } from "../../shared/selectors/syntax.selector.ts";

const RULES: RenameRules = {
    ids: RENAMED_COLLECTIONS,
    pathSegments: COLLECTION_PATH_SEGMENTS,
    wholeId: false,
    words: null,
};
const QUOTE_WIDTH = 1;
const HOLE_OPEN_WIDTH = 2;

const closingWidth = function closingWidth(view: AstNode): number {
    return view["tail"] === true ? QUOTE_WIDTH : HOLE_OPEN_WIDTH;
};

export default {
    create(context: RuleContext): RuleListener {
        const check = function check(view: AstNode, raw: RuleNode, trailing: number): void {
            const source = context.sourceCode.getText(raw);
            const inner = source.slice(QUOTE_WIDTH, source.length - trailing);
            const [first] = renamedSpans(inner, RULES);
            if (first === undefined) {
                return;
            }
            const rewritten =
                source.slice(0, QUOTE_WIDTH) + renamedText(inner, RULES) + source.slice(source.length - trailing);
            context.report({
                data: { from: first.from, to: first.to },
                fix: (fixer) => fixer.replaceText(raw, rewritten),
                loc: locOf(view),
                messageId: "retiredCollectionId",
            });
        };
        return listener({
            literal(view, raw) {
                if (typeof view["value"] === "string") {
                    check(view, raw, QUOTE_WIDTH);
                }
            },
            templateElement(view, raw) {
                check(view, raw, closingWidth(view));
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "A string names an ontology collection by the id the collection carries now. The rename registry keeps each retired id beside its current one, and a reference, an anchor, a catalog path or a collection name written with a retired id is rewritten to the current id. The registry is data, so a rename is one registry line.",
        },
        fixable: "code",
        messages: {
            retiredCollectionId:
                "'{{from}}' is a retired collection id, and the collection is now '{{to}}'. The fix rewrites the string in place from the rename registry.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
