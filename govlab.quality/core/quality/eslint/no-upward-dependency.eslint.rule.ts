import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";
import { govlabSettings } from "#core/selectors/eslint.selector";

interface AstNode {
    type: string;
    source?: { value?: unknown };
}

const DOTDOT = "../";

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

const moduleOf = function moduleOf(filePath: string, marker: string): string | null {
    const normalized = filePath.replaceAll("\\", "/");
    const idx = normalized.indexOf(marker);
    if (idx === -1) {
        return null;
    }
    const after = normalized.slice(idx + marker.length);
    const slash = after.indexOf("/");
    return slash === -1 ? after.replace(".ts", "") : after.slice(0, slash);
};

const importModuleOf = function importModuleOf(importPath: string): string {
    let cleaned = importPath.replaceAll("\\", "/");
    while (cleaned.startsWith(DOTDOT)) {
        cleaned = cleaned.slice(DOTDOT.length);
    }
    const slash = cleaned.indexOf("/");
    return slash === -1 ? cleaned.replace(".ts", "") : cleaned.slice(0, slash);
};

interface ModuleContext {
    levels: Record<string, number>;
    sourceModule: string;
    sourceLevel: number;
}

const resolveModuleContext = function resolveModuleContext(context: Rule.RuleContext): ModuleContext | null {
    const settings = govlabSettings(context);
    const pathMarker = settings.scopes?.backend;
    const levels = settings.hostPolicy?.moduleLevels;
    if (typeof pathMarker !== "string" || !levels) {
        return null;
    }
    const sourceModule = moduleOf(context.filename, pathMarker);
    if (sourceModule === null || !Object.hasOwn(levels, sourceModule)) {
        return null;
    }
    return { levels, sourceLevel: levels[sourceModule] ?? 0, sourceModule };
};

const checkImport = function checkImport(context: Rule.RuleContext, ctx: ModuleContext, node: Rule.Node): void {
    const importPath = asNode(node)?.source?.value;
    if (typeof importPath !== "string" || !importPath.startsWith(".")) {
        return;
    }
    const targetModule = importModuleOf(importPath);
    if (targetModule === ctx.sourceModule || !Object.hasOwn(ctx.levels, targetModule)) {
        return;
    }
    const targetLevel = ctx.levels[targetModule];
    if (typeof targetLevel === "number" && targetLevel > ctx.sourceLevel) {
        context.report({
            data: {
                sourceLevel: String(ctx.sourceLevel),
                sourceModule: ctx.sourceModule,
                targetLevel: String(targetLevel),
                targetModule,
            },
            messageId: "noUpwardDependency",
            node,
        });
    }
};

const onExportNamed = function onExportNamed(context: Rule.RuleContext, ctx: ModuleContext, node: Rule.Node): void {
    if (asNode(node)?.source) {
        checkImport(context, ctx, node);
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const ctx = resolveModuleContext(context);
        if (ctx === null) {
            return {};
        }
        const handlers: [string, (node: Rule.Node) => void][] = [
            [
                "ExportNamedDeclaration",
                (node): void => {
                    onExportNamed(context, ctx, node);
                },
            ],
            [
                "ImportDeclaration",
                (node): void => {
                    checkImport(context, ctx, node);
                },
            ],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["module-boundaries", "layering"],
        description: "Disallow imports from higher-level modules into lower-level modules (dependency inversion)",
        messages: {
            noUpwardDependency:
                "Module '{{sourceModule}}' (level {{sourceLevel}}) must not import from '{{targetModule}}' (level {{targetLevel}}). Dependencies flow downward: constants/database → core → services → web/dashboard → server.",
        },
        ruleId: "no_upward_dependency",
    }),
} satisfies Rule.RuleModule;
