import { asNode, walk } from "@ssot/govlab/shared/selectors/syntax.selector.ts";
import {
    boundNameOf,
    composedKeyOf,
    cookedOf,
    depthBelowPackage,
    holdsMeta,
    isFileDir,
    isMetaClimb,
    staticTargetOf,
} from "@ssot/govlab/shared/analyzers/location.analyzer.ts";
import { describe, expect, it } from "vitest";
import type { AstNode } from "@ssot/govlab/types/syntax.types.ts";
import { Linter } from "eslint";
import { listener } from "@ssot/govlab/shared/factories/listener.factory.ts";
import { relativePath } from "@ssot/paths";

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

const nodesOfType = function nodesOfType(program: AstNode, type: string): AstNode[] {
    const found: AstNode[] = [];
    walk(program, (node) => {
        if (node.type === type) {
            found.push(node);
        }
    });
    return found.toSorted((a, b) => a.loc.start.line - b.loc.start.line || a.loc.start.column - b.loc.start.column);
};

describe("holdsMeta, isFileDir and isMetaClimb", () => {
    const program = programOf(`const here = dirname(import.meta.url); const up = join(here, "..", "..", "x.ts");`);
    const [dirnameCall, joinCall] = nodesOfType(program, "CallExpression");

    it("recognizes an import.meta anchor and the directory derived from it", () => {
        expect(holdsMeta(dirnameCall ?? null)).toBe(true);
        expect(isFileDir(dirnameCall ?? null, new Set())).toBe(true);
        expect(isFileDir(joinCall ?? null, new Set())).toBe(false);
    });

    it("counts climbs against the file's depth below its package", () => {
        expect(isMetaClimb(joinCall ?? program, new Set(["here"]), 1)).toBe(true);
        expect(isMetaClimb(joinCall ?? program, new Set(["here"]), 3)).toBe(false);
    });

    it("measures how deep a file sits below the nearest package manifest", () => {
        expect(depthBelowPackage(`${relativePath("govlabHost")}/shared/resolvers/anchor.resolver.ts`)).toBe(2);
    });
});

describe("staticTargetOf and boundNameOf", () => {
    const program = programOf(`const target = join(__dirname, "fixtures", "probe.ts");`);
    const [call] = nodesOfType(program, "CallExpression");

    it("resolves a join from a file directory against the file's own folder and names its binding", () => {
        expect(staticTargetOf(call ?? program, new Set(), "root/dir")).toBe("root/dir/fixtures/probe.ts");
        expect(boundNameOf(call ?? program)).toBe("target");
    });
});

describe("cookedOf and composedKeyOf", () => {
    const program = programOf(`const p = \`\${relativePath("govlabHost")}/shared\`;`);
    const element = nodesOfType(program, "TemplateElement").at(-1);

    it("reads a quasi's cooked text", () => {
        expect(cookedOf(element ?? null)).toBe("/shared");
    });

    it("recognizes a tail appended to an SSOT lookup that the SSOT already declares", () => {
        const composed = composedKeyOf(element ?? program, new Set(["relativePath"]));
        expect(composed?.key).toBe("govlabHost.shared");
        expect(composed?.tail).toBe("shared");
    });
});
