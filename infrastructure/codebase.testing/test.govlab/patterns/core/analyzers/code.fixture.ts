import type { CodeSymbol } from "@govlab/patterns/types/code.types.ts";

export const definition = function definition(
    name: string,
    file: string,
    overrides: Partial<CodeSymbol> = {},
): CodeSymbol {
    return {
        callable: true,
        enclosing: "root",
        exported: false,
        file,
        hash: "",
        kind: "function_declaration",
        line: 1,
        member: false,
        name,
        role: "definition",
        size: 0,
        ...overrides,
    };
};

export const call = function call(name: string, enclosing: string, file: string): CodeSymbol {
    return { ...definition(name, file), callable: false, enclosing, kind: "call_expression", role: "call" };
};
