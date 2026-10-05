import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { TEST_ROOT_SEGMENT, basenameOf, isInContainer, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { concernForPath, concernSuffix, isImportedRoot, rootFor } from "../../shared/manifests/taxonomy.manifest.ts";
import { nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import { defineCheck } from "@govlab/context/check";
import { isTestRoot } from "../../shared/manifests/taxonomy.root.manifest.ts";
import { listener } from "../../shared/factories/listener.factory.ts";

const TYPES_CONCERN = "types";
const INTERFACE_DECLARATION = "TSInterfaceDeclaration";
const TYPE_ALIAS_DECLARATION = "TSTypeAliasDeclaration";

const EXEMPT_BASENAME_SUFFIXES = [concernSuffix(TYPES_CONCERN), ".test.ts", ".spec.ts"];

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    if (EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix))) {
        return true;
    }
    const path = normalizePath(filename);
    const root = rootFor(path);
    if (isImportedRoot(root)) {
        return isTestRoot(root) || concernForPath(path) === TYPES_CONCERN;
    }
    return isInContainer(filename, TYPES_CONCERN) || path.includes(TEST_ROOT_SEGMENT);
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            exportNamedDeclaration(view, node) {
                const declaration = nodeAt(view, "declaration");
                if (declaration === null) {
                    return;
                }
                const payload = { name: nameOf(nodeAt(declaration, "id")) };
                if (declaration.type === INTERFACE_DECLARATION) {
                    context.report({ data: payload, messageId: "inlineExportedInterface", node });
                    return;
                }
                if (declaration.type === TYPE_ALIAS_DECLARATION) {
                    context.report({ data: payload, messageId: "inlineExportedTypeAlias", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:separation-of-concerns"] }),
            description:
                "An exported interface or type alias belongs in the type bucket, not beside the runtime code that happens to use it first. A shared contract has a review axis of its own, exactly as the editorial surface does, and one location is what makes reviewing it possible. A file-local, non-exported type is fine — only the exported surface is centralized.",
        },
        messages: {
            inlineExportedInterface:
                "Exported interface `{{name}}` declared outside the type bucket. Move it into a types file there, or add one. A code file carries runtime and imported types only; it must not contain`export interface` or `export type` declarations; inline non-exported types are allowed.",
            inlineExportedTypeAlias:
                "Exported type alias `{{name}}` declared outside the type bucket. Move it into a types file there, or add one. A code file carries runtime and imported types only; it must not contain`export type X = ...` declarations; inline non-exported types are allowed.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
