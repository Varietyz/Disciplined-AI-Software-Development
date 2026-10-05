import {
    calledName,
    identName,
    isFileWriteCall,
    isJsonStringify,
    parentWriteMissingUtf8,
} from "@ssot/govlab/shared/analyzers/sink.analyzer.ts";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import type { WriteNode } from "@ssot/govlab/types/generator.types.ts";
import { asWriteNode } from "@ssot/govlab/shared/resolvers/scope.resolver.ts";
import { listener } from "@ssot/govlab/shared/factories/listener.factory.ts";

const linter = new Linter();

const callsOf = function callsOf(code: string): WriteNode[] {
    const calls: WriteNode[] = [];
    const capture = {
        create() {
            return listener({
                callExpression(_view, node) {
                    const call = asWriteNode(node);
                    if (call !== null) {
                        calls.push(call);
                    }
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
    return calls;
};

describe("the call classifiers", () => {
    const [write, stringify] = callsOf(`writeFileSync("out.json", JSON.stringify(value, null, 4));`);
    const [member] = callsOf(`fs.writeFile("out.json", text);`);

    it("names identifiers and callees, and recognizes stringify and file-write calls", () => {
        expect(identName(write?.callee)).toBe("writeFileSync");
        expect(calledName(member ?? { type: "None" })).toBe("writeFile");
        expect(isJsonStringify(stringify ?? { type: "None" })).toBe(true);
        expect(isFileWriteCall(write)).toBe(true);
        expect(isFileWriteCall(member)).toBe(true);
        expect(isFileWriteCall(stringify)).toBe(false);
    });

    it("reports a stringify write that names no utf-8 encoding", () => {
        const [, bare] = callsOf(`fs.writeFileSync("out.json", JSON.stringify(value, null, 4));`);
        expect(parentWriteMissingUtf8(bare ?? { type: "None" })).toBe(true);
        const [, encoded] = callsOf(`fs.writeFileSync("out.json", JSON.stringify(value, null, 4), "utf-8");`);
        expect(parentWriteMissingUtf8(encoded ?? { type: "None" })).toBe(false);
        const [, spelled] = callsOf(`fs.writeFileSync("out.json", JSON.stringify(value, null, 4), "utf8");`);
        expect(parentWriteMissingUtf8(spelled ?? { type: "None" })).toBe(false);
    });
});
