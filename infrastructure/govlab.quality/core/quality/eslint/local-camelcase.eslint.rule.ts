import type { Rule, Scope } from "eslint";
import { isDigit, isLowerAlpha } from "@govlab/constants";
import { govlabMeta } from "#core/factories/eslint.factory";

const LOCAL_SCOPES = new Set(["function", "block", "for", "catch"]);
const RENAMEABLE_DEFS = new Set(["Variable", "Parameter"]);

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object";
};

const isSnakeChar = function isSnakeChar(ch: string): boolean {
    return isLowerAlpha(ch) || isDigit(ch) || ch === "_";
};

const hasSnakeShape = function hasSnakeShape(name: string): boolean {
    return name.includes("_") && !name.startsWith("_") && !name.endsWith("_") && !name.includes("__");
};

const isSnakeCase = function isSnakeCase(name: string): boolean {
    if (!hasSnakeShape(name)) {
        return false;
    }
    for (const ch of name) {
        if (!isSnakeChar(ch)) {
            return false;
        }
    }
    return true;
};

const toCamelCase = function toCamelCase(name: string): string {
    const parts = name.split("_");
    let out = parts[0] ?? "";
    for (let i = 1; i < parts.length; i += 1) {
        const part = parts[i];
        if (typeof part === "string" && part.length > 0) {
            out += (part[0] ?? "").toUpperCase() + part.slice(1);
        }
    }
    return out;
};

const isShorthandProperty = function isShorthandProperty(value: unknown): boolean {
    if (!isRecord(value)) {
        return false;
    }
    const { parent } = value;
    return isRecord(parent) && parent["type"] === "Property" && parent["shorthand"] === true;
};

const carriesExternalKey = function carriesExternalKey(variable: Scope.Variable): boolean {
    return variable.identifiers.some(isShorthandProperty);
};

const isRenameableDefinition = function isRenameableDefinition(variable: Scope.Variable): boolean {
    return (
        variable.identifiers.length > 0 &&
        variable.defs.length > 0 &&
        variable.defs.every((def) => RENAMEABLE_DEFS.has(def.type))
    );
};

const isRenameable = function isRenameable(variable: Scope.Variable, taken: Set<string>, camel: string): boolean {
    if (!isRenameableDefinition(variable)) {
        return false;
    }
    return camel !== variable.name && !taken.has(camel) && !carriesExternalKey(variable);
};

const rangeStart = function rangeStart(node: { range?: [number, number] | undefined }): number {
    return node.range?.[0] ?? 0;
};

const collectStarts = function collectStarts(variable: Scope.Variable): number[] {
    const starts = new Set<number>();
    for (const identifier of variable.identifiers) {
        starts.add(rangeStart(identifier));
    }
    for (const reference of variable.references) {
        starts.add(rangeStart(reference.identifier));
    }
    return [...starts];
};

const reportVariable = function reportVariable(
    context: Rule.RuleContext,
    variable: Scope.Variable,
    camel: string,
): void {
    const [firstId] = variable.identifiers;
    if (!firstId) {
        return;
    }
    const starts = collectStarts(variable);
    const nameLength = variable.name.length;
    context.report({
        data: { camel, name: variable.name },
        fix: (fixer): Rule.Fix[] =>
            starts.map((start): Rule.Fix => fixer.replaceTextRange([start, start + nameLength], camel)),
        messageId: "camelCase",
        node: firstId,
    });
};

const checkScope = function checkScope(context: Rule.RuleContext, scope: Scope.Scope): void {
    if (LOCAL_SCOPES.has(scope.type)) {
        const taken = new Set(scope.variables.map((variable) => variable.name));
        for (const variable of scope.variables) {
            const camel = toCamelCase(variable.name);
            if (isSnakeCase(variable.name) && isRenameable(variable, taken, camel)) {
                reportVariable(context, variable, camel);
            }
        }
    }
    for (const child of scope.childScopes) {
        checkScope(context, child);
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onExit = (node: Rule.Node): void => {
            checkScope(context, context.sourceCode.getScope(node));
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["Program:exit", onExit]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["idiomatic-preference"],
        description:
            "Normalize file-local identifiers (variables, parameters) to camelCase; cross-file and destructured-key bindings are left for manual judgment",
        fixable: "code",
        messages: { camelCase: "Local identifier '{{name}}' should be camelCase '{{camel}}'." },
        ruleId: "local_camelcase",
        type: "suggestion",
    }),
} satisfies Rule.RuleModule;
