import type { Rule, Scope } from "eslint";
import type { WriteNode } from "../../types/generator.types.ts";

const isWriteNode = function isWriteNode(value: unknown): value is WriteNode {
    return value !== null && typeof value === "object" && "type" in value;
};

export const asWriteNode = function asWriteNode(value: unknown): WriteNode | null {
    return isWriteNode(value) ? value : null;
};

export const findVariable = function findVariable(
    context: Rule.RuleContext,
    node: Rule.Node,
    name: string,
): Scope.Variable | null {
    let scope: Scope.Scope | null = context.sourceCode.getScope(node);
    while (scope !== null) {
        const variable = scope.variables.find((entry) => entry.name === name);
        if (variable) {
            return variable;
        }
        scope = scope.upper;
    }
    return null;
};

const declaratorInit = function declaratorInit(variable: Scope.Variable): WriteNode | null {
    for (const def of variable.defs) {
        const declarator = asWriteNode(def.node);
        if (declarator?.type === "VariableDeclarator") {
            return declarator.init ?? null;
        }
    }
    return null;
};

const lastWrittenValue = function lastWrittenValue(variable: Scope.Variable): WriteNode | null {
    const written = variable.references.flatMap((reference) => {
        const value = asWriteNode(reference.writeExpr);
        return value === null ? [] : [value];
    });
    return written.at(-1) ?? null;
};

export const variableInit = function variableInit(
    context: Rule.RuleContext,
    node: Rule.Node,
    name: string,
): WriteNode | null {
    const variable = findVariable(context, node, name);
    return variable === null ? null : (lastWrittenValue(variable) ?? declaratorInit(variable));
};
