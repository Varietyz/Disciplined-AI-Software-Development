import { GOVERNED_ROOT, basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { TYPE_LAYERS, relativeFromMember } from "../../shared/manifests/layer.manifest.ts";
import { containerPath } from "../../shared/resolvers/container.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { hasConcern } from "../../shared/matchers/filename.matcher.ts";
import { listener } from "../../shared/factories/listener.factory.ts";

const TYPES_CONCERN = "types";
const TYPES_ROOT = containerPath(TYPES_CONCERN, GOVERNED_ROOT);

const isTypesFile = function isTypesFile(filepath: string): boolean {
    const rel = relativeFromMember(filepath);
    return rel.startsWith(TYPES_ROOT) && hasConcern(basenameOf(rel), TYPES_CONCERN);
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        const rel = relativeFromMember(filename);
        if (!isTypesFile(filename) || TYPE_LAYERS.has(rel)) {
            return {};
        }
        return listener({
            program(_view, node) {
                context.report({ data: { path: rel }, messageId: "undeclaredTypeLayer", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:layered-architecture"] }),
            description:
                "Every types file in the bucket is classified in the layer manifest as `platform` or `product`. The bucket is flat and its path carries no tier, so nothing else can decide the classification — leaving it undeclared makes the platform-to-product import rule unable to judge that file at all, and it fails open rather than reporting.",
        },
        messages: {
            undeclaredTypeLayer:
                "Types file `{{path}}` has no tier classification. Add an entry to TYPE_LAYERS in `.govlab/shared/manifests/layer.manifest.ts` — `platform` for an application-agnostic contract any tier may import, `product` for one tied to this application's specifics. Unclassified means the tier boundary cannot reason about the file at all.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
