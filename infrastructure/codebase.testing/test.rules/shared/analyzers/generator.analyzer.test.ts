import {
    GENERATED_MARKER,
    MARKER_EXEMPT_BASENAMES,
    PRETTIER_EXTENSIONS,
    WRITER_FUNCTIONS,
    WRITE_OWNER_MODULES,
} from "@ssot/govlab/shared/manifests/generator.manifest.ts";
import {
    collectLiterals,
    rootsAtEphemeralDir,
    targetIsUnmarkedGenerated,
} from "@ssot/govlab/shared/analyzers/generator.analyzer.ts";
import { describe, expect, it } from "vitest";
import type { WriteNode } from "@ssot/govlab/types/generator.types.ts";

const literal = function literal(value: string): WriteNode {
    return { type: "Literal", value };
};

const call = function call(callee: string, ...args: WriteNode[]): WriteNode {
    return { arguments: args, callee: { name: callee, type: "Identifier" }, type: "CallExpression" };
};

const unresolved = (): WriteNode | null => null;

describe("collectLiterals and rootsAtEphemeralDir", () => {
    it("gathers every literal below a node and recognizes a temporary-directory root", () => {
        const joined = call("join", call("tmpdir"), literal("out.json"));
        expect(collectLiterals(joined, 0)).toStrictEqual(["out.json"]);
        expect(rootsAtEphemeralDir(unresolved, joined, 0)).toBe(true);
        expect(rootsAtEphemeralDir(unresolved, literal("out.json"), 0)).toBe(false);
    });
});

describe("targetIsUnmarkedGenerated", () => {
    it("reads the target's extension against the formatter set and the generated marker against its basename", () => {
        expect(targetIsUnmarkedGenerated(unresolved, literal("report.json"))).toBe(true);
        expect(targetIsUnmarkedGenerated(unresolved, literal("archive.tar.gz"))).toBe(false);
        expect(targetIsUnmarkedGenerated(unresolved, literal(`report${GENERATED_MARKER}json`))).toBe(false);
        expect(targetIsUnmarkedGenerated(unresolved, literal("README.md"))).toBe(false);
    });

    it("resolves a binding to its initializer before judging the target", () => {
        const resolve = (name: string): WriteNode | null => (name === "target" ? literal("out.md") : null);
        expect(targetIsUnmarkedGenerated(resolve, { name: "target", type: "Identifier" })).toBe(true);
    });
});

describe("the generator manifest", () => {
    it("declares the formatter extensions and the marker as data, and ships the owner registries empty", () => {
        expect(PRETTIER_EXTENSIONS.has("md")).toBe(true);
        expect(GENERATED_MARKER).toBe(".generated.");
        expect(MARKER_EXEMPT_BASENAMES.has("readme.md")).toBe(true);
        expect(WRITE_OWNER_MODULES.size).toBe(0);
        expect(WRITER_FUNCTIONS.size).toBe(0);
    });
});
