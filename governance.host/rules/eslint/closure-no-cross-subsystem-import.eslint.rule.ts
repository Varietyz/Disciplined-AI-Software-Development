import { FOUNDATION_FOLDER, GOVERNED_ROOT, collapsePath } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { literalString, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import { containerPath } from "../../shared/resolvers/container.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { relativeFromMember } from "../../shared/manifests/layer.manifest.ts";

const TYPES_ROOT = containerPath("types", GOVERNED_ROOT);

const isInFoundation = function isInFoundation(filepath: string): boolean {
    return relativeFromMember(filepath).includes(FOUNDATION_FOLDER);
};

const resolveFromMember = function resolveFromMember(importerFile: string, importStr: string): string {
    const rel = relativeFromMember(importerFile);
    const importerDir = rel.slice(0, rel.lastIndexOf("/"));
    return collapsePath(`${importerDir}/${importStr}`);
};

const isAllowedFromFoundation = function isAllowedFromFoundation(resolvedPath: string): boolean {
    return resolvedPath.includes(FOUNDATION_FOLDER) || resolvedPath.startsWith(TYPES_ROOT);
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        if (!isInFoundation(filename)) {
            return {};
        }
        return listener({
            importDeclaration(view, node) {
                const importStr = literalString(nodeAt(view, "source"));
                if (importStr === null) {
                    return;
                }
                if (!importStr.startsWith(".")) {
                    return;
                }
                const resolved = resolveFromMember(filename, importStr);
                if (resolved === "" || isAllowedFromFoundation(resolved)) {
                    return;
                }
                const payload = { importStr, resolved };
                context.report({ data: payload, messageId: "crossSubsystem", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:layered-architecture"] }),
            description:
                "A file in a foundational folder may import only from another foundational folder or from the type bucket. Foundational code depending on a non-foundational subsystem inverts the dependency direction and dissolves the tier's whole reason to exist — everything may depend on the foundation, and the foundation on nothing. External, non-relative imports are exempt.",
        },
        messages: {
            crossSubsystem:
                "Foundational file imports outside the foundation: `{{ importStr }}` resolves to `{{ resolved }}`. Foundational code is tier zero — move the import target into a foundational folder, lift the shared concept into the type bucket, or move this file out of the foundation, since depending on a subsystem means it was never foundational.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
