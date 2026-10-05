import type { Rule } from "eslint";
import { withinPackage } from "#core/resolvers/package.resolver";

const MESSAGE =
    'A workspace package.json must declare "private": true. ' +
    "Every package stays private until publishing is explicitly authorized per package — no default-open publish path. [private_until_authorized]";

const MANIFEST_TAIL = "/package.json";
const SELECTORS = ["JSONObjectExpression"];

interface JsonAstNode {
    type?: string;
    parent?: JsonAstNode;
    properties?: JsonProperty[];
    value?: { value?: unknown };
}

interface JsonProperty {
    key?: { value?: unknown; name?: unknown };
    value: { value?: unknown };
}

const isJsonNode = function isJsonNode(node: unknown): node is JsonAstNode {
    return typeof node === "object" && node !== null;
};

const isRuleNode = function isRuleNode(node: unknown): node is Rule.Node {
    return typeof node === "object" && node !== null;
};

const isWorkspacePackageManifest = function isWorkspacePackageManifest(filename: string): boolean {
    const normalized = filename.replaceAll("\\", "/");
    if (!normalized.endsWith(MANIFEST_TAIL)) {
        return false;
    }
    return withinPackage(normalized) === "package.json";
};

const isTopLevelObject = function isTopLevelObject(node: JsonAstNode): boolean {
    const { parent } = node;
    if (parent?.type !== "JSONExpressionStatement") {
        return false;
    }
    return parent.parent?.type === "Program";
};

const findPrivateProperty = function findPrivateProperty(properties: JsonProperty[]): JsonProperty | null {
    for (const property of properties) {
        if (property.key && (property.key.value === "private" || property.key.name === "private")) {
            return property;
        }
    }
    return null;
};

const reportIfNotTrue = function reportIfNotTrue(context: Rule.RuleContext, valueNode: { value?: unknown }): void {
    if (valueNode.value !== true && isRuleNode(valueNode)) {
        context.report({ messageId: "requirePrivatePackage", node: valueNode });
    }
};

const checkPrivate = function checkPrivate(context: Rule.RuleContext, node: Rule.Node): void {
    const json = isJsonNode(node) ? node : null;
    if (json === null || !isTopLevelObject(json)) {
        return;
    }
    const privateProperty = findPrivateProperty(json.properties ?? []);
    if (privateProperty === null) {
        context.report({ messageId: "requirePrivatePackage", node });
        return;
    }
    reportIfNotTrue(context, privateProperty.value);
};

export default {
    create(context): Rule.RuleListener {
        if (!isWorkspacePackageManifest(context.filename)) {
            return {};
        }
        const listeners: Rule.RuleListener = {};
        for (const selector of SELECTORS) {
            listeners[selector] = (node: Rule.Node): void => {
                checkPrivate(context, node);
            };
        }
        return listeners;
    },

    meta: {
        docs: {
            description:
                "Require every workspace package.json to have 'private: true' so no default-open publish path exists.",
        },
        messages: { requirePrivatePackage: MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
