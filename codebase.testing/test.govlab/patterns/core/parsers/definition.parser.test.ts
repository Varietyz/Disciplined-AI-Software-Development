import { describe, expect, it } from "vitest";
import { codeSymbols } from "@govlab/patterns/core/parsers/definition.parser.ts";
import { parseCode } from "@govlab/code-parse";

const JS = `
export function greet(name) {
    console.log(name);
    return name;
}
function run() {
    return greet("world");
}
`;

const ALIASED = 'import { greet as sayHi } from "./greet.ts";\nfunction run() {\n    return sayHi("world");\n}\n';

const symbolsOf = async function symbolsOf(source: string, language: string): Promise<ReturnType<typeof codeSymbols>> {
    const root = await parseCode(source, language);
    return root === null ? [] : codeSymbols(root);
};

describe("codeSymbols", () => {
    it("reads definitions and calls with their lines, marking the exported definition", async () => {
        const symbols = await symbolsOf(JS, "javascript");
        const greet = symbols.find((symbol) => symbol.role === "definition" && symbol.name === "greet");
        expect(greet?.exported).toBe(true);
        expect(greet?.callable).toBe(true);
        expect(symbols.find((symbol) => symbol.name === "run")?.exported).toBe(false);
        expect(symbols.filter((symbol) => symbol.role === "call").map((symbol) => symbol.name)).toContain("log");
        expect(symbols.every((symbol) => symbol.line > 0)).toBe(true);
    });

    it("attributes an aliased call to the imported name", async () => {
        const calls = (await symbolsOf(ALIASED, "typescript")).filter((symbol) => symbol.role === "call");
        expect(calls.map((symbol) => symbol.name)).toStrictEqual(["greet"]);
    });
});
