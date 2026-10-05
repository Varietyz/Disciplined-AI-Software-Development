import type { Rule } from "eslint";
import { packageRootOf } from "#core/resolvers/package.resolver";

const MESSAGE =
    "Packages must not read process.env directly. " +
    "Host-supplied configuration flows through the constructor or factory the package exposes. " +
    "Inject the value: have the consumer read process.env at the call site and pass it into the package. [injection_only_surface]";

const ENV = "env";
const PROCESS = "process";
const PROCESS_MODULES = new Set(["node:process", "process"]);
const TEST_MARKERS = [".test.", ".spec."];

const isEnvironmentPackage = function isEnvironmentPackage(packageRoot: string): boolean {
    return packageRoot.endsWith("/environment");
};

const CONSUMER_BOUNDARIES = ["/bin/", "/cli/", "/entrypoints/", "/examples/", "/tests/"];

const isTestFile = function isTestFile(name: string): boolean {
    return TEST_MARKERS.some((marker) => name.includes(marker));
};

const isConsumerBoundary = function isConsumerBoundary(filename: string): boolean {
    const normalized = filename.replaceAll("\\", "/");
    return (
        CONSUMER_BOUNDARIES.some((boundary) => normalized.includes(boundary)) ||
        isTestFile(normalized.slice(normalized.lastIndexOf("/") + 1))
    );
};

const isEnvKey = function isEnvKey(
    key: Partial<Record<"name" | "value", unknown>> & { type: string },
    computed: boolean,
): boolean {
    if (computed) {
        return key.type === "Literal" && key.value === ENV;
    }
    return key.type === "Identifier" && key.name === ENV;
};

const isProcessEnvAccess = function isProcessEnvAccess(node: Rule.Node): boolean {
    if (node.type !== "MemberExpression") {
        return false;
    }
    if (node.object.type !== "Identifier" || node.object.name !== PROCESS) {
        return false;
    }
    return isEnvKey(node.property, node.computed);
};

const isProcessEnvDestructure = function isProcessEnvDestructure(node: Rule.Node): boolean {
    if (node.type !== "VariableDeclarator" || node.id.type !== "ObjectPattern") {
        return false;
    }
    if (node.init?.type !== "Identifier" || node.init.name !== PROCESS) {
        return false;
    }
    return node.id.properties.some(
        (property) => property.type === "Property" && isEnvKey(property.key, property.computed),
    );
};

const isProcessEnvImport = function isProcessEnvImport(node: Rule.Node): boolean {
    if (node.type !== "ImportSpecifier" || node.parent.type !== "ImportDeclaration") {
        return false;
    }
    const imported = node.imported.type === "Identifier" ? node.imported.name : node.imported.value;
    return imported === ENV && PROCESS_MODULES.has(String(node.parent.source.value));
};

const WATCHED_NODES = ["ImportSpecifier", "MemberExpression", "VariableDeclarator"];

const DETECTORS: readonly ((node: Rule.Node) => boolean)[] = [
    isProcessEnvAccess,
    isProcessEnvDestructure,
    isProcessEnvImport,
];

export default {
    create(context): Rule.RuleListener {
        const packageRoot = packageRootOf(context.filename);
        if (packageRoot === null || isEnvironmentPackage(packageRoot) || isConsumerBoundary(context.filename)) {
            return {};
        }
        const report = (node: Rule.Node): void => {
            if (DETECTORS.some((detect) => detect(node))) {
                context.report({ messageId: "noProcessEnvDirect", node });
            }
        };
        return Object.fromEntries(WATCHED_NODES.map((type) => [type, report]));
    },

    meta: {
        docs: {
            description:
                "Disallow direct process.env access inside workspace packages, whether by member access, destructuring or a named import — config must flow through the constructor or factory the package exposes.",
        },
        messages: { noProcessEnvDirect: MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
