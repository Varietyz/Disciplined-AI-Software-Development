import { beforeAll, describe, expect, it } from "vitest";
import { declaredTarget, innerTypes, keyOf, within } from "@ssot/govlab/codemods/selectors/field.selector.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import ts from "typescript";
import { writeCanonicalText } from "@govlab/canonical-write";

const SOURCE = [
    "export interface Box { size: number; meta: { label: string } }",
    "export const boxes: Box[] = [];",
    "export const made: Box = { meta: { label: '' }, size: 1 };",
].join("\n");

const folder = mkdtempSync(join(tmpdir(), "field-selector-"));
const file = join(folder, "box.generated.ts");
let program: ts.Program | null = null;

beforeAll(async () => {
    await writeCanonicalText(file, SOURCE);
    program = ts.createProgram([file], { noEmit: true, strict: true, target: ts.ScriptTarget.ES2022 });
    program.getTypeChecker();
});

const nodesOf = function nodesOf(): readonly ts.Node[] {
    const source = program?.getSourceFile(file);
    const nodes: ts.Node[] = [];
    const visit = (node: ts.Node): void => {
        nodes.push(node);
        ts.forEachChild(node, visit);
    };
    if (source !== undefined) {
        visit(source);
    }
    return nodes;
};

describe("within", () => {
    it("holds a file under one of the roots and refuses one outside them", () => {
        expect(within(file, [folder])).toBe(true);
        expect(within(file, [join(folder, "other")])).toBe(false);
    });
});

describe("keyOf", () => {
    it("keys a property by its interface, through a nested literal, and nothing else", () => {
        const keys = nodesOf()
            .map(keyOf)
            .filter((key) => key !== null);
        expect(keys).toStrictEqual(["Box.size", "Box.meta", "Box.meta.label"]);
    });
});

describe("innerTypes and declaredTarget", () => {
    it("opens an array down to its element, and reads the type a literal is declared as", () => {
        const checker = program?.getTypeChecker();
        const nodes = nodesOf();
        const array = nodes.find(ts.isVariableDeclaration);
        const literal = nodes.find(ts.isObjectLiteralExpression);
        if (checker === undefined || array === undefined || literal === undefined) {
            throw new TypeError(file);
        }
        const types = innerTypes(checker, checker.getTypeAtLocation(array));
        expect(types.map((type) => checker.typeToString(type))).toStrictEqual(["Box"]);
        const target = declaredTarget(checker, literal);
        expect(target === undefined ? null : checker.typeToString(target)).toBe("Box");
    });
});
