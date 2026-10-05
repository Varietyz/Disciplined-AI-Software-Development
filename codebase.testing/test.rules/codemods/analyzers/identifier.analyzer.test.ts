import { describe, expect, it } from "vitest";
import type { IdentifierFinding as Finding } from "@ssot/govlab/types/analyzer.types.ts";
import { scanProgram } from "@ssot/govlab/codemods/analyzers/identifier.analyzer.ts";
import { sep } from "node:path";
import ts from "typescript";

const FILE = `${process.cwd().split(sep).join("/")}/probe.ts`;

const scan = function scan(code: string, fileName = FILE): Finding[] {
    const source = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
    const host: ts.CompilerHost = {
        fileExists: (name) => name === fileName,
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: () => process.cwd(),
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        getNewLine: () => "\n",
        getSourceFile: (name) => (name === fileName ? source : undefined),
        readFile: (name) => (name === fileName ? code : undefined),
        useCaseSensitiveFileNames: () => true,
        writeFile: () => {},
    };
    const program = ts.createProgram({ host, options: {}, rootNames: [fileName] });
    const resolved = program.getSourceFile(fileName) ?? source;
    return scanProgram(program, [resolved]);
};

describe("scanProgram", () => {
    it("finds a pascal-cased const and proposes the camel-cased name", () => {
        const [finding] = scan("const WidgetFactory = () => 1;\nexport const use = WidgetFactory;");
        expect(finding?.from).toBe("WidgetFactory");
        expect(finding?.to).toBe("widgetFactory");
        expect(finding?.reason).toBeNull();
    });

    it("leaves a constant-cased const alone, which is a different convention", () => {
        expect(scan("const MAX_RETRIES = 3;\nexport const use = MAX_RETRIES;")).toStrictEqual([]);
    });

    it("leaves an already camel-cased const alone", () => {
        expect(scan("const widgetFactory = () => 1;\nexport const use = widgetFactory;")).toStrictEqual([]);
    });

    it("collects every reference to the declaration as a rename location", () => {
        const [finding] = scan(
            "const WidgetFactory = () => 1;\nconst a = WidgetFactory;\nexport const b = [a, WidgetFactory];",
        );
        expect((finding?.locations.length ?? 0) >= 3).toBe(true);
    });

    it("blocks a rename whose target name is already bound in the file", () => {
        const code =
            "const widgetFactory = 1;\nconst WidgetFactory = 2;\nexport const use = [widgetFactory, WidgetFactory];";
        const finding = scan(code).find((entry) => entry.from === "WidgetFactory");
        expect(finding?.reason).toContain("already declares");
    });

    it("blocks a rename used in a shorthand property, where it would change the key", () => {
        const code = "const WidgetFactory = 1;\nexport const bag = { WidgetFactory };";
        const [finding] = scan(code);
        expect(finding?.reason).toContain("shorthand property");
    });

    it("skips a generated file, whose source is regenerated rather than edited", () => {
        const generated = `${process.cwd().split(sep).join("/")}/probe.generated.ts`;
        expect(scan("const WidgetFactory = () => 1;", generated)).toStrictEqual([]);
    });

    it("ignores a mutable binding, since the convention governs constants", () => {
        expect(scan("let WidgetFactory = 1;\nexport const use = WidgetFactory;")).toStrictEqual([]);
    });
});
