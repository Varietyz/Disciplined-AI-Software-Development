import { ASSET_MODULE_NAME, ASSET_PATH_HINTS } from "../../shared/manifests/asset.manifest.ts";
import {
    BUILD_SCRIPT_ROOT_SEGMENT,
    GOVERNED_ROOT,
    SCRIPT_ROOT_SEGMENT,
    basenameOf,
    normalizePath,
} from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isModuleSpecifier, isStandaloneScript } from "../../shared/predicates/location.predicate.ts";
import {
    isType,
    literalString,
    locOf,
    nameOf,
    nodeAt,
    recordAt,
    stringIn,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { containerPath } from "../../shared/resolvers/container.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const CORE_CONTAINER = containerPath("core", GOVERNED_ROOT);
const ASSET_MODULE_PREFIX = `/${CORE_CONTAINER.slice(CORE_CONTAINER.indexOf("/") + 1)}${ASSET_MODULE_NAME}/`;
const REGISTRY_SUFFIX = concernSuffix("manifest");

const ENV_BASE_URL = "import.meta.env.BASE_URL";
const ENV_NAMESPACE = "env";
const BASE_URL_PROPERTY = "BASE_URL";

const ALLOWED_SEGMENTS = [ASSET_MODULE_PREFIX, SCRIPT_ROOT_SEGMENT, BUILD_SCRIPT_ROOT_SEGMENT];

const isAllowedFile = function isAllowedFile(filename: string): boolean {
    const norm = normalizePath(filename);
    if (ALLOWED_SEGMENTS.some((segment) => norm.includes(segment))) {
        return true;
    }
    return isStandaloneScript(norm) || basenameOf(norm).endsWith(REGISTRY_SUFFIX);
};

const pathHintIn = function pathHintIn(value: string): string | null {
    return ASSET_PATH_HINTS.find((hint) => value.includes(hint)) ?? null;
};

const isImportMeta = function isImportMeta(node: AstNode | null): boolean {
    if (!isType(node, "MetaProperty")) {
        return false;
    }
    return nameOf(nodeAt(node, "meta")) === "import" && nameOf(nodeAt(node, "property")) === "meta";
};

const isEnvBaseUrl = function isEnvBaseUrl(node: AstNode): boolean {
    if (node.type !== "MemberExpression" || nameOf(nodeAt(node, "property")) !== BASE_URL_PROPERTY) {
        return false;
    }
    const object = nodeAt(node, "object");
    if (!isType(object, "MemberExpression") || nameOf(nodeAt(object, "property")) !== ENV_NAMESPACE) {
        return false;
    }
    return isImportMeta(nodeAt(object, "object"));
};

export default {
    create(context: RuleContext): RuleListener {
        if (isAllowedFile(context.filename)) {
            return {};
        }
        return listener({
            literal(view) {
                const value = literalString(view);
                const hint = value === null || isModuleSpecifier(view) ? null : pathHintIn(value);
                if (hint !== null) {
                    context.report({ data: { hint }, loc: locOf(view), messageId: "pathLiteral" });
                }
            },
            memberExpression(view, node) {
                if (isEnvBaseUrl(view)) {
                    context.report({ data: { expr: ENV_BASE_URL }, messageId: "envBaseUrl", node });
                }
            },
            templateElement(view) {
                const hint = pathHintIn(stringIn(recordAt(view, "value"), "cooked"));
                if (hint !== null) {
                    context.report({ data: { hint }, loc: locOf(view), messageId: "pathLiteral" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:hardcoded-configuration"],
                enforces: ["architecture:single-source-of-truth"],
            }),
            description:
                "An asset location, an environment import, a URL or a route written as a literal at a call site is banned; each is declared once in the asset catalog and reached through its accessor. These are deployment facts, not code facts — they change on a different schedule than the code that consumes them, and a literal ties the two together. The location shapes the rule looks for are data in the asset manifest, and a registry module is exempt because it is where such a shape is declared. A standalone server script ships as one file that can import nothing, so it is its own catalog.",
        },
        messages: {
            envBaseUrl:
                "Direct `{{expr}}` access is banned outside the asset catalog. The catalog's accessors apply the deployment base internally, so reaching for the environment here re-derives a fact the catalog already owns.",
            pathLiteral:
                "Inline location '{{hint}}' is banned outside the asset catalog. Declare it there once and reach it through the catalog's accessor — a deployment fact spelled at a call site changes on a different schedule than the code around it.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
