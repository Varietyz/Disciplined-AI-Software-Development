import { asNode, walk } from "@ssot/govlab/shared/selectors/syntax.selector.ts";
import { composedTokenOf, foldSegments } from "@ssot/govlab/shared/analyzers/segment.analyzer.ts";
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

const callsIn = function callsIn(program: AstNode): AstNode[] {
    const found: AstNode[] = [];
    walk(program, (node) => {
        if (node.type === "CallExpression") {
            found.push(node);
        }
    });
    return found.toSorted((a, b) => a.loc.start.column - b.loc.start.column);
};

const [head, tail] = relativePath("govlabHost.rules").split("/");

describe("foldSegments and composedTokenOf", () => {
    const program = programOf(`const a = join("${head ?? ""}", "${tail ?? ""}"); const b = ["x", "y"].join("/");`);
    const [joinCall, arrayJoin] = callsIn(program);

    it("folds literal arguments of a path builder into segments", () => {
        expect(foldSegments(joinCall ?? null, new Map())).toStrictEqual([head, tail]);
        expect(foldSegments(null, new Map())).toBeNull();
    });

    it("recognizes a workspace location assembled from parts and none when the parts spell nothing declared", () => {
        expect(composedTokenOf(joinCall ?? program, new Map())).toBe(relativePath("govlabHost"));
        expect(composedTokenOf(arrayJoin ?? program, new Map())).toBeNull();
    });
});
