import type { Rule } from "eslint";

interface AstNode {
    type?: string;
    object?: AstNode;
    property?: AstNode;
    name?: string;
    value?: unknown;
}

const isAstNode = (value: unknown): value is AstNode => typeof value === "object" && value !== null;

const asNode = (value: unknown): AstNode | null => (isAstNode(value) ? value : null);

const safeString = (value: unknown): string => {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    return "UNKNOWN";
};

const isProcessEnv = (value: unknown): boolean => {
    const node = asNode(value);
    const object = asNode(node?.object);
    if (node?.type !== "MemberExpression" || object?.type !== "MemberExpression") {
        return false;
    }
    const objectObject = asNode(object.object);
    const objectProperty = asNode(object.property);
    return objectObject?.type === "Identifier" && objectObject.name === "process" && objectProperty?.name === "env";
};

const isImportMetaEnv = (value: unknown): boolean => {
    const node = asNode(value);
    const object = asNode(node?.object);
    const objectObject = asNode(object?.object);
    const objectProperty = asNode(object?.property);
    return (
        node?.type === "MemberExpression" &&
        object?.type === "MemberExpression" &&
        objectObject?.type === "MetaProperty" &&
        objectProperty?.name === "env"
    );
};

const isEnvAccess = (value: unknown): boolean => isProcessEnv(value) || isImportMetaEnv(value);

const getEnvVarName = (value: unknown): string => {
    const node = asNode(value);
    const property = asNode(node?.property);
    if (property?.type === "Identifier" && typeof property.name === "string") {
        return property.name;
    }
    if (property?.type === "Literal") {
        return safeString(property.value);
    }
    return "UNKNOWN";
};

const reportConditional = function reportConditional(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type !== "ConditionalExpression" || !isEnvAccess(node.test)) {
        return;
    }
    context.report({ data: { name: getEnvVarName(node.test) }, messageId: "noEnvTernaryFallback", node });
};

const reportLogical = function reportLogical(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type !== "LogicalExpression" || (node.operator !== "||" && node.operator !== "??")) {
        return;
    }
    if (!isEnvAccess(node.left)) {
        return;
    }
    if (node.right.type === "BinaryExpression" || node.right.type === "LogicalExpression") {
        return;
    }
    context.report({ data: { name: getEnvVarName(node.left) }, messageId: "noEnvFallback", node });
};

export default {
    create(context): Rule.RuleListener {
        const handlers: [string, (node: Rule.Node) => void][] = [
            [
                "ConditionalExpression",
                (node): void => {
                    reportConditional(context, node);
                },
            ],
            [
                "LogicalExpression",
                (node): void => {
                    reportLogical(context, node);
                },
            ],
        ];
        return Object.fromEntries(handlers);
    },
    meta: {
        docs: { description: "Disallow fallback values for process.env / import.meta.env access" },
        messages: {
            noEnvFallback:
                "process.env.{{name}} must not have a fallback value. Environment variables are mandatory — " +
                "if missing, fail fast. Declare {{name}} in the project's secret store and read it through the store's typed accessor, which stops the run when the value is missing. [no_environment_fallback]",
            noEnvTernaryFallback:
                "process.env.{{name}} must not have a ternary fallback. Environment variables are mandatory — " +
                "validate presence at startup, never provide defaults. [no_environment_fallback]",
        },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
