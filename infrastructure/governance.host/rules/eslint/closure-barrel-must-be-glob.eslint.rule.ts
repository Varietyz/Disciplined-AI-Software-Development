import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, literalString, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";

const BARREL_MARKER = ".barrel.ts";
const GLOB_METHOD = "glob";
const MIN_HAND_IMPORTS = 2;

const basenameOf = function basenameOf(path: string): string {
    const norm = normalizePath(path);
    const idx = norm.lastIndexOf("/");
    return idx === -1 ? norm : norm.slice(idx + 1);
};

const isGlobCall = function isGlobCall(statement: AstNode): boolean {
    if (statement.type !== "VariableDeclaration") {
        return false;
    }
    return nodesAt(statement, "declarations").some((decl) => {
        const init = nodeAt(decl, "init");
        if (!isType(init, "CallExpression")) {
            return false;
        }
        const callee = nodeAt(init, "callee");
        if (!isType(callee, "MemberExpression") || !isType(nodeAt(callee, "object"), "MetaProperty")) {
            return false;
        }
        const property = nodeAt(callee, "property");
        return isType(property, "Identifier") && nameOf(property) === GLOB_METHOD;
    });
};

const EXPORT_TYPES: ReadonlySet<string> = new Set([
    "ExportAllDeclaration",
    "ExportDefaultDeclaration",
    "ExportNamedDeclaration",
]);

const isExport = function isExport(statement: AstNode): boolean {
    return EXPORT_TYPES.has(statement.type);
};

const isRelativeSideEffectImport = function isRelativeSideEffectImport(statement: AstNode): boolean {
    if (statement.type !== "ImportDeclaration" || nodesAt(statement, "specifiers").length > 0) {
        return false;
    }
    const target = literalString(nodeAt(statement, "source"));
    return target?.startsWith(".") === true;
};

export default {
    create(context: RuleContext): RuleListener {
        const basename = basenameOf(context.filename);
        if (!basename.endsWith(BARREL_MARKER)) {
            return {};
        }
        return listener({
            program(view, node) {
                const body = nodesAt(view, "body");
                for (const statement of body.filter(isExport)) {
                    context.report({ data: { basename }, messageId: "barrelExports", node: statement });
                }
                if (body.some(isGlobCall)) {
                    return;
                }
                const count = body.filter(isRelativeSideEffectImport).length;
                if (count < MIN_HAND_IMPORTS) {
                    return;
                }
                const payload = { basename, count: String(count) };
                context.report({ data: payload, messageId: "barrelMustGlob", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:hand-kept-index"],
                enforces: ["architecture:runtime-discovery", "architecture:open-closed"],
            }),
            description:
                "Files matching `*.barrel.ts` must use `import.meta.glob` for discovery rather than enumerate sibling imports by hand, and must export nothing. Hand-imported barrels require an edit every time a new variant is added; glob barrels discover variants automatically. Operationalizes the self-registration mandate at the build layer.",
        },
        messages: {
            barrelExports:
                "Barrel file '{{ basename }}' exports a value. A discovery barrel only loads its variants for their registration side effect and exports nothing; a consumer that needs the discovered set reads it from the registry the variants register into, or derives it in its own module.",
            barrelMustGlob:
                "Barrel file '{{ basename }}' uses {{ count }} hand-written side-effect imports. Replace with `import.meta.glob(\"./*.<role>.ts\", { eager: true });` so new variants are discovered automatically. The pattern is the folder's declared role tag.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
