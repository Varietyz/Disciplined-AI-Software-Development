import { GOVERNED_ROOT, normalizePath, projectDirs } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { concernFolders, containerPath } from "../../shared/resolvers/container.resolver.ts";
import { isType, literalString, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { PLATFORM_PATH_PREFIXES } from "../../shared/manifests/layer.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const PLATFORM_ROOTS = PLATFORM_PATH_PREFIXES.map((prefix) => `/${containerPath(prefix.slice(0, -1), GOVERNED_ROOT)}`);

const CACHING_CONCERNS = ["cache", "pool"];
const OWNS_STATE_MARKER = "export class";
const MIN_KEYED_INDEXES = 2;
const MAP_CONSTRUCTOR = "Map";

const CACHE_IMPORT_FRAGMENTS = CACHING_CONCERNS.flatMap((tag) =>
    concernFolders(tag, projectDirs()).map((dir) => `/${dir.slice(dir.lastIndexOf("/", dir.length - 2) + 1)}`),
);

const inPlatformTier = function inPlatformTier(normalized: string): boolean {
    return PLATFORM_ROOTS.some((root) => normalized.includes(root));
};

const baseNameOf = function baseNameOf(filename: string): string {
    const normalized = normalizePath(filename);
    const lastSlash = normalized.lastIndexOf("/");
    const base = lastSlash === -1 ? normalized : normalized.slice(lastSlash + 1);
    return base.endsWith(".ts") ? base.slice(0, -3) : base;
};

const isStatefulPlatformFile = function isStatefulPlatformFile(filename: string, source: string): boolean {
    const normalized = normalizePath(filename);
    if (!inPlatformTier(normalized) || normalized.endsWith(".test.ts")) {
        return false;
    }
    return source.includes(OWNS_STATE_MARKER);
};

const importSourceMentionsCache = function importSourceMentionsCache(source: string): boolean {
    return CACHE_IMPORT_FRAGMENTS.some((fragment) => source.includes(fragment));
};

const isMapField = function isMapField(member: AstNode): boolean {
    const annotation = nodeAt(nodeAt(member, "typeAnnotation"), "typeAnnotation");
    if (isType(annotation, "TSTypeReference") && nameOf(nodeAt(annotation, "typeName")) === MAP_CONSTRUCTOR) {
        return true;
    }
    const init = nodeAt(member, "value");
    if (!isType(init, "NewExpression")) {
        return false;
    }
    const callee = nodeAt(init, "callee");
    return isType(callee, "Identifier") && nameOf(callee) === MAP_CONSTRUCTOR;
};

const countMapFields = function countMapFields(classNode: AstNode): number {
    return nodesAt(nodeAt(classNode, "body"), "body").filter(
        (member) => member.type === "PropertyDefinition" && isMapField(member),
    ).length;
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        const source = context.sourceCode.getText();
        if (!isStatefulPlatformFile(filename, source)) {
            return {};
        }
        const base = baseNameOf(filename);
        let hasCacheImport = false;
        let maxMapFields = 0;
        return listener(
            {
                classDeclaration(view) {
                    maxMapFields = Math.max(maxMapFields, countMapFields(view));
                },
                importDeclaration(view) {
                    const specifier = literalString(nodeAt(view, "source"));
                    if (specifier !== null && importSourceMentionsCache(specifier)) {
                        hasCacheImport = true;
                    }
                },
            },
            (_view: AstNode, node): void => {
                if (hasCacheImport || maxMapFields >= MIN_KEYED_INDEXES) {
                    return;
                }
                context.report({ data: { name: base }, messageId: "missing", node });
            },
        );
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:caching"] }),
            description:
                "A stateful coordinator over a collection either uses the shared caching primitives or declares its own keyed secondary index. Neither means every read is a scan, which is a performance defect that only appears at scale — the check makes the choice explicit rather than accidental.",
        },
        messages: {
            missing:
                "Stateful platform-tier file '{{name}}' has no cache coverage. Choose one: import a caching primitive from the pool or cache concern, or declare a keyed secondary index of your own.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
