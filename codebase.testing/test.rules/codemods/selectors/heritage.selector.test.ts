import {
    baseChain,
    clausesOfToken,
    implementsClauses,
    memberNamesOf,
} from "@ssot/govlab/codemods/selectors/heritage.selector.ts";
import { describe, expect, it } from "vitest";
import ts from "typescript";

const programOf = function programOf(code: string): { checker: ts.TypeChecker; source: ts.SourceFile } {
    const fileName = "probe.ts";
    const source = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
    const host: ts.CompilerHost = {
        fileExists: (name) => name === fileName,
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: () => "",
        getDefaultLibFileName: () => "lib.d.ts",
        getNewLine: () => "\n",
        getSourceFile: (name) => (name === fileName ? source : undefined),
        readFile: (name) => (name === fileName ? code : undefined),
        useCaseSensitiveFileNames: () => true,
        writeFile: () => {},
    };
    const program = ts.createProgram({ host, options: {}, rootNames: [fileName] });
    return { checker: program.getTypeChecker(), source: program.getSourceFile(fileName) ?? source };
};

const classesIn = function classesIn(source: ts.SourceFile): ts.ClassDeclaration[] {
    return source.statements.filter((statement): statement is ts.ClassDeclaration => ts.isClassDeclaration(statement));
};

describe("clausesOfToken", () => {
    it("separates the extends clause from the implements clauses", () => {
        const { source } = programOf("interface Shape {}\nclass Base {}\nclass Leaf extends Base implements Shape {}");
        const leaf = classesIn(source).find((node) => node.name?.getText() === "Leaf");
        const target = leaf ?? classesIn(source)[0];
        if (target === undefined) {
            throw new Error("no class parsed");
        }
        expect(clausesOfToken(target, ts.SyntaxKind.ExtendsKeyword)).toHaveLength(1);
        expect(clausesOfToken(target, ts.SyntaxKind.ImplementsKeyword)).toHaveLength(1);
    });

    it("returns nothing for a class with no heritage", () => {
        const { source } = programOf("class Lone {}");
        const [lone] = classesIn(source);
        expect(lone === undefined ? [] : clausesOfToken(lone, ts.SyntaxKind.ExtendsKeyword)).toStrictEqual([]);
    });
});

describe("baseChain", () => {
    it("walks the full extends chain, nearest base first", () => {
        const { checker, source } = programOf(
            "class Root {}\nclass Middle extends Root {}\nclass Leaf extends Middle {}",
        );
        const leaf = classesIn(source).find((node) => node.name?.getText() === "Leaf");
        if (leaf === undefined) {
            throw new Error("Leaf did not parse");
        }
        expect(baseChain(checker, leaf).map((node) => node.name?.getText())).toStrictEqual(["Middle", "Root"]);
    });

    it("returns nothing for a class that extends nothing", () => {
        const { checker, source } = programOf("class Lone {}");
        const [lone] = classesIn(source);
        expect(lone === undefined ? [] : baseChain(checker, lone)).toStrictEqual([]);
    });
});

describe("implementsClauses", () => {
    it("gathers the class's own clauses and every one inherited up the chain", () => {
        const code =
            "interface A {}\ninterface B {}\nclass Base implements A {}\nclass Leaf extends Base implements B {}";
        const { checker, source } = programOf(code);
        const leaf = classesIn(source).find((node) => node.name?.getText() === "Leaf");
        if (leaf === undefined) {
            throw new Error("Leaf did not parse");
        }
        const names = implementsClauses(checker, leaf).map((clause) => clause.expression.getText());
        expect(names.toSorted()).toStrictEqual(["A", "B"]);
    });
});

describe("memberNamesOf", () => {
    it("names every member that has a name", () => {
        const { source } = programOf("class Holder { id = 1; run() {} }");
        const [holder] = classesIn(source);
        expect(holder === undefined ? [] : memberNamesOf(holder)).toStrictEqual(["id", "run"]);
    });
});
