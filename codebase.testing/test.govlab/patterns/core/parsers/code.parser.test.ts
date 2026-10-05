import { describe, expect, it } from "vitest";
import { ingestCode, ingestFile, ingestImports, ingestSymbols } from "@govlab/patterns/core/parsers/code.parser.ts";
import { availableLanguages } from "@govlab/code-parse";
import { report } from "@govlab/patterns/core/pipelines/record.pipeline.ts";

const MIN_LANGUAGES = 20;

const JS = `
function greet(name) {
    const message = "hi " + name;
    console.log(message);
    return message;
}
`;

const PY = `
def greet(name):
    message = "hi " + name
    print(message)
    return message
`;

const RS = `
fn greet(name: &str) -> String {
    let message = format!("hi {}", name);
    println!("{}", message);
    message
}
`;

describe("code ingestion over real grammars", () => {
    it("discovers the available languages from the grammar set", () => {
        expect(availableLanguages().length).toBeGreaterThan(MIN_LANGUAGES);
    });

    it("ingestCode parses JavaScript, Python and Rust through one pipeline", async () => {
        expect((await ingestCode(JS, "greet.js")).map((record) => record["nodeType"])).toContain(
            "function_declaration",
        );
        expect((await ingestCode(PY, "greet.py")).map((record) => record["nodeType"])).toContain("function_definition");
        expect((await ingestCode(RS, "greet.rs")).some((record) => record["role"] === "call")).toBe(true);
    });

    it("feeds code records straight into the analysis pipeline", async () => {
        const reported = report(await ingestCode(JS, "greet.js"));
        expect(reported.headline.findings).toBeGreaterThan(0);
        expect(reported.schema.map((field) => field.name)).toContain("nodeType");
    });

    it("ingestSymbols and ingestImports read the same file through their own extractors", async () => {
        expect((await ingestSymbols(JS, "greet.js")).map((symbol) => symbol.name)).toContain("greet");
        expect(await ingestImports('import { a } from "./one.ts";\n', "run.ts")).toStrictEqual([
            { importedNames: ["a"], source: "./one.ts" },
        ]);
    });

    it("ingestFile returns records, symbols and imports together, and empties for an unknown language", async () => {
        const file = await ingestFile(JS, "greet.js");
        expect(file.records.length).toBeGreaterThan(0);
        expect(file.symbols.length).toBeGreaterThan(0);
        expect(await ingestFile(JS, "notes.unknownext")).toStrictEqual({ imports: [], records: [], symbols: [] });
        await expect(ingestImports(JS, "notes.unknownext")).resolves.toStrictEqual([]);
    });
});
