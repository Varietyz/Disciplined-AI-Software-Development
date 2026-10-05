import { isDigit, isUpperAlpha } from "@govlab/constants";
import type { Rule } from "eslint";
import { packageRelOf } from "#core/resolvers/package.resolver";

const CONFIG_INIT_TYPES = new Set(["Literal"]);
const SELECTORS = ["ExportNamedDeclaration"];

const MESSAGE =
    "Scalar config constant '{{name}}' is declared inline in a concern module, not in a constants module. " +
    "Move exported UPPER_SNAKE scalar knobs (number/string literals) into a co-located `constants/` folder (or src/constants.ts) so a package's tunable surface lives in dedicated constants modules. [central_config]";

interface VarDeclarator {
    id: { type: string; name?: string | undefined };
    init?: { type: string } | null | undefined;
}

const isWorkspaceSrcFile = function isWorkspaceSrcFile(filename: string): boolean {
    const normalized = filename.replaceAll("\\", "/");
    if (!normalized.includes("/src/") || !normalized.endsWith(".ts") || normalized.endsWith(".d.ts")) {
        return false;
    }
    return packageRelOf(normalized) !== null;
};

const isCentralConstantsLocation = function isCentralConstantsLocation(filename: string): boolean {
    const normalized = filename.replaceAll("\\", "/");
    return (
        normalized.includes("/constants/") ||
        normalized.endsWith("/constants.ts") ||
        normalized.endsWith("-constants.ts") ||
        normalized.endsWith(".constants.ts")
    );
};

const isUpperSnake = function isUpperSnake(name: string): boolean {
    let hasUpper = false;
    for (const ch of name) {
        if (isUpperAlpha(ch)) {
            hasUpper = true;
            continue;
        }
        if (!isDigit(ch) && ch !== "_") {
            return false;
        }
    }
    return hasUpper;
};

const offendingConstName = function offendingConstName(declarator: VarDeclarator): string | null {
    if (declarator.id.type !== "Identifier" || typeof declarator.id.name !== "string") {
        return null;
    }
    const { name } = declarator.id;
    if (!isUpperSnake(name)) {
        return null;
    }
    const initType = declarator.init?.type;
    return typeof initType === "string" && CONFIG_INIT_TYPES.has(initType) ? name : null;
};

const onExport = function onExport(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type !== "ExportNamedDeclaration") {
        return;
    }
    const { declaration } = node;
    if (declaration?.type !== "VariableDeclaration" || declaration.kind !== "const") {
        return;
    }
    for (const declarator of declaration.declarations) {
        const name = offendingConstName(declarator);
        if (name !== null) {
            context.report({ data: { name }, messageId: "decentralizedConfig", node });
        }
    }
};

export default {
    create(context): Rule.RuleListener {
        if (!isWorkspaceSrcFile(context.filename) || isCentralConstantsLocation(context.filename)) {
            return {};
        }
        const listeners: Rule.RuleListener = {};
        for (const selector of SELECTORS) {
            listeners[selector] = (node: Rule.Node): void => {
                onExport(context, node);
            };
        }
        return listeners;
    },

    meta: {
        docs: {
            description:
                "Exported UPPER_SNAKE config constants (objects/arrays/literals) must live in the package's central constants location, not scattered across concern modules.",
        },
        messages: { decentralizedConfig: MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
