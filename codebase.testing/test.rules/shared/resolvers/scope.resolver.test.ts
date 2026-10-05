import { asWriteNode, findVariable, variableInit } from "@ssot/govlab/shared/resolvers/scope.resolver.ts";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import type { Rule } from "eslint";
import { listener } from "@ssot/govlab/shared/factories/listener.factory.ts";

const linter = new Linter();

interface Captured {
    context: Rule.RuleContext;
    node: Rule.Node;
}

const captureCall = function captureCall(code: string): Captured | null {
    let captured: Captured | null = null;
    const capture: Rule.RuleModule = {
        create(context) {
            return listener({
                callExpression(_view, node) {
                    captured ??= { context, node };
                },
            });
        },
        meta: { messages: {}, schema: [], type: "problem" },
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
    return captured;
};

describe("the scope resolver", () => {
    const captured = captureCall(
        `const target = "out.json"; let later = ""; later = "late.json"; let unset; write(target);`,
    );

    it("narrows an unknown value to a write node by its type field", () => {
        expect(asWriteNode({ type: "Literal" })?.type).toBe("Literal");
        expect(asWriteNode(null)).toBeNull();
        expect(asWriteNode("text")).toBeNull();
    });

    it("finds a variable through the enclosing scopes and resolves the last value written to it", () => {
        if (captured === null) {
            throw new Error("no call captured");
        }
        expect(findVariable(captured.context, captured.node, "target")?.name).toBe("target");
        expect(findVariable(captured.context, captured.node, "missing")).toBeNull();
        expect(variableInit(captured.context, captured.node, "target")?.value).toBe("out.json");
        expect(variableInit(captured.context, captured.node, "later")?.value).toBe("late.json");
        expect(variableInit(captured.context, captured.node, "unset")).toBeNull();
        expect(variableInit(captured.context, captured.node, "missing")).toBeNull();
    });
});
