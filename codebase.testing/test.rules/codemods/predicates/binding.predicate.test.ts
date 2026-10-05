import { describe, expect, it } from "vitest";
import type { BindingContext } from "@ssot/govlab/types/analyzer.types.ts";
import { sep } from "node:path";
import ts from "typescript";
import { unsafeReason } from "@ssot/govlab/codemods/predicates/binding.predicate.ts";

const FILE = `${process.cwd().split(sep).join("/")}/probe.ts`;

const contextFor = function contextFor(code: string): { ctx: BindingContext; method: ts.MethodDeclaration } {
    const source = ts.createSourceFile(FILE, code, ts.ScriptTarget.Latest, true);
    const host: ts.CompilerHost = {
        fileExists: (name) => name === FILE,
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: () => process.cwd(),
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        getNewLine: () => "\n",
        getSourceFile: (name) => (name === FILE ? source : undefined),
        readFile: (name) => (name === FILE ? code : undefined),
        useCaseSensitiveFileNames: () => true,
        writeFile: () => {},
    };
    const program = ts.createProgram({ host, options: {}, rootNames: [FILE] });
    const resolved = program.getSourceFile(FILE) ?? source;
    const classNode = resolved.statements.findLast((statement) => ts.isClassDeclaration(statement));
    if (classNode === undefined || !ts.isClassDeclaration(classNode)) {
        throw new Error("fixture declares no class");
    }
    const method = classNode.members.find((member) => ts.isMethodDeclaration(member));
    if (method === undefined || !ts.isMethodDeclaration(method)) {
        throw new Error("fixture declares no method");
    }
    return {
        ctx: { checker: program.getTypeChecker(), classNode, overrides: new Map(), sourceFile: resolved },
        method,
    };
};

describe("unsafeReason", () => {
    it("clears a plain method with a body", () => {
        const { ctx, method } = contextFor("class Job { run() {} }");
        expect(unsafeReason(ctx, method, "run")).toBeNull();
    });

    it("names the shape that blocks binding", () => {
        const generator = contextFor("class Job { *run() {} }");
        expect(unsafeReason(generator.ctx, generator.method, "run")).toBe("generator");
        const isStatic = contextFor("class Job { static run() {} }");
        expect(unsafeReason(isStatic.ctx, isStatic.method, "run")).toBe("static, abstract or declared member");
    });

    it("refuses a member that calls super or is read by an earlier field initializer", () => {
        const withSuper = contextFor("class Base { run() {} }\nclass Job extends Base { run() { super.run(); } }");
        expect(unsafeReason(withSuper.ctx, withSuper.method, "run")).toBe("member calls super");
        const early = contextFor("class Job { early = this.run(); run() {} }");
        expect(unsafeReason(early.ctx, early.method, "run")).toBe("read by an earlier field initializer");
    });
});
