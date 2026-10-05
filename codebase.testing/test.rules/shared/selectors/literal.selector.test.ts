import {
    CODE_KINDS,
    CODE_SLOTS,
    DIAGRAM_KINDS,
    boundCopyOf,
    boundInitOf,
    codeLiteralsOf,
    copyTextOf,
    diagramLiteralsOf,
    templateShapeOf,
} from "@ssot/govlab/shared/selectors/literal.selector.ts";
import { Linter, type Rule } from "eslint";
import { asNode, literalString, nodeAt, walk } from "@ssot/govlab/shared/selectors/syntax.selector.ts";
import { describe, expect, it } from "vitest";
import type { AstNode } from "@ssot/govlab/types/syntax.types.ts";
import { listener } from "@ssot/govlab/shared/factories/listener.factory.ts";

const linter = new Linter();

const programOf = function programOf(code: string): AstNode {
    let program: unknown = null;
    const capture = {
        create() {
            return listener({
                program(_view, node) {
                    program = node;
                },
            });
        },
        meta: { messages: {}, schema: [], type: "problem" as const },
    };
    linter.verify(
        code,
        [
            {
                files: ["**/*.ts"],
                languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
                plugins: { t: { rules: { r: capture } } },
                rules: { "t/r": "error" as const },
            },
        ],
        "probe.ts",
    );
    const node = asNode(program);
    if (node === null) {
        throw new Error("the capture rule did not observe a Program node");
    }
    return node;
};

const SOURCE = [
    `const SAMPLE = "held sample";`,
    `const PROSE = "held prose";`,
    `export const A = { code: SAMPLE, kind: "code" };`,
    `export const B = { code: "inline sample", kind: "code" };`,
    `export const C = { text: PROSE, title: "a title" };`,
    `export const D = { grammar: "<rule> ::= <term>", title: "a rule" };`,
    `const FIGURE = "[a]-->[b]";`,
    `export const E = { kind: "diagram", text: FIGURE };`,
    `export const F = { kind: "paragraph", text: "plain prose" };`,
].join("\n");

describe("codeLiteralsOf", () => {
    const program = programOf(SOURCE);
    const consumed = codeLiteralsOf(program);
    const consumedTexts = [...consumed].map((node) => literalString(node) ?? "").toSorted();

    it("collects a literal consumed inline by a code slot and one reaching it through a module-local const", () => {
        expect(consumedTexts).toStrictEqual(["<rule> ::= <term>", "[a]-->[b]", "held sample", "inline sample"]);
        expect(CODE_SLOTS.has("grammar")).toBe(true);
        expect(CODE_KINDS.has("diagram")).toBe(true);
    });

    it("leaves every other literal of the module as prose", () => {
        const prose: string[] = [];
        walk(program, (node) => {
            const text = literalString(node);
            if (text !== null && !consumed.has(node)) {
                prose.push(text);
            }
        });
        expect(prose).toContain("held prose");
        expect(prose).toContain("a title");
        expect(prose).toContain("plain prose");
        expect(prose).not.toContain("held sample");
        expect(prose).not.toContain("[a]-->[b]");
    });
});

describe("copyTextOf", () => {
    it("reads static text whole, a worded template with its holes marked, and no text from a template of values", () => {
        const texts: string[] = [];
        const code = ["const a = `Links to ", "{x}.`; const b = `", "{x}/", "{y}.md`; const c = `Plain`;"].join("$");
        walk(programOf(code), (node) => {
            const text = node.type === "TemplateLiteral" ? copyTextOf(node) : null;
            if (text !== null) {
                texts.push(text);
            }
        });
        expect(texts.toSorted()).toStrictEqual(["Links to ….", "Plain"]);
    });
});

describe("templateShapeOf", () => {
    it("joins a template's text parts with a mark for each hole, and gives nothing for another node", () => {
        const shapes: string[] = [];
        const code = ["const a = `https://h:", "{p}/x/", "{t}`; const b = 3;"].join("$");
        walk(programOf(code), (node) => {
            const shape = templateShapeOf(node);
            if (shape !== null) {
                shapes.push(shape);
            }
        });
        expect(shapes).toStrictEqual(["https://h:…/x/…"]);
    });
});

describe("boundInitOf and boundCopyOf", () => {
    it("finds what a name is bound to in the nearest scope that declares it, and nothing for a parameter", () => {
        const found: (string | null)[] = [];
        const copies: (string | null)[] = [];
        const capture = {
            create(context: Rule.RuleContext) {
                return listener({
                    returnStatement(view, node) {
                        const scope = context.sourceCode.getScope(node);
                        for (const name of ["title", "outer", "id", "missing"]) {
                            found.push(literalString(boundInitOf(scope, name)));
                        }
                        const copyOf = boundCopyOf(scope);
                        const copy = copyOf(nodeAt(view, "argument"));
                        copies.push(literalString(copy));
                    },
                });
            },
            meta: { messages: {}, schema: [], type: "problem" as const },
        };
        linter.verify(
            [
                'const outer = "Outer text";',
                'const title = "Shadowed";',
                'const f = (id) => { const title = "Inner text"; return id; };',
                'const g = () => { const title = "Bound copy"; return title; };',
            ].join("\n"),
            [
                {
                    files: ["**/*.ts"],
                    languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
                    plugins: { t: { rules: { r: capture } } },
                    rules: { "t/r": "error" as const },
                },
            ],
            "probe.ts",
        );
        expect(found).toStrictEqual(["Inner text", "Outer text", null, null, "Bound copy", "Outer text", null, null]);
        expect(copies).toStrictEqual([null, "Bound copy"]);
        expect(boundInitOf(null, "title")).toBeNull();
    });
});

describe("diagramLiteralsOf", () => {
    it("collects only the literals a diagram block consumes, inline or through a module-local const", () => {
        const diagrams = [...diagramLiteralsOf(programOf(SOURCE))].map((node) => literalString(node) ?? "");
        expect(diagrams).toStrictEqual(["[a]-->[b]"]);
        expect(DIAGRAM_KINDS.has("mermaid")).toBe(true);
        expect(DIAGRAM_KINDS.has("code")).toBe(false);
    });
});
