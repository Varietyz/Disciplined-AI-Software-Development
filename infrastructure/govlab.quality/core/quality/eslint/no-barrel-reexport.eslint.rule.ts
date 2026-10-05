import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    source?: { value?: unknown };
}

const INDEX_SUFFIXES = ["/index.ts", "/index"];

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

const isIndexReexport = function isIndexReexport(node: AstNode | null): boolean {
    const source = node?.source?.value;
    if (typeof source !== "string") {
        return false;
    }
    return INDEX_SUFFIXES.some((suffix) => source.endsWith(suffix));
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        if (!context.filename.endsWith("index.ts")) {
            return {};
        }
        const onExport = (node: Rule.Node): void => {
            if (isIndexReexport(asNode(node))) {
                context.report({ messageId: "noBarrelReexport", node });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["ExportAllDeclaration", onExport],
            ["ExportNamedDeclaration", onExport],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["module-boundaries", "circular-dependency"],
        description: "Disallow re-exporting from index.ts inside another index.ts (circular barrel prevention)",
        messages: {
            noBarrelReexport:
                "A barrel (index) file must not re-export from another index — this creates circular dependency chains. Import directly from the source module file instead.",
        },
        ruleId: "module_boundary_index",
    }),
} satisfies Rule.RuleModule;
