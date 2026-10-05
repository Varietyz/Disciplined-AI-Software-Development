import { absolutePath, relativePath } from "@ssot/paths";
import {
    anchoredBySsot,
    isMemberPathsSource,
    isModuleSpecifier,
    isPathShaped,
    isProseContext,
    isSsotExemptFile,
    isStandaloneScript,
} from "@ssot/govlab/shared/predicates/location.predicate.ts";
import { asNode, walk } from "@ssot/govlab/shared/selectors/syntax.selector.ts";
import { describe, expect, it } from "vitest";
import type { AstNode } from "@ssot/govlab/types/syntax.types.ts";
import { Linter } from "eslint";
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

const literalsIn = function literalsIn(program: AstNode): AstNode[] {
    const found: AstNode[] = [];
    walk(program, (node) => {
        if (node.type === "Literal") {
            found.push(node);
        }
    });
    return found.toSorted((a, b) => a.loc.start.column - b.loc.start.column);
};

describe("isProseContext", () => {
    const program = programOf(`const o = { description: "a/b" }; const p = read("c/d");`);
    const [prose, path] = literalsIn(program);

    it("treats a literal under a prose slot as prose and one handed to a path call as not", () => {
        expect(isProseContext(prose ?? program)).toBe(true);
        expect(isProseContext(path ?? program)).toBe(false);
    });
});

describe("isPathShaped", () => {
    it("accepts a slash-joined value that resolves on disk and refuses media types, urls and single words", () => {
        expect(isPathShaped(relativePath("govlabHost.shared"))).toBe(true);
        expect(isPathShaped("text/plain")).toBe(false);
        expect(isPathShaped("https://example.test/x")).toBe(false);
        expect(isPathShaped("word")).toBe(false);
    });
});

describe("isModuleSpecifier and isSsotExemptFile", () => {
    const program = programOf(`import { a } from "x/y"; read("x/y");`);
    const [specifier, argument] = literalsIn(program);

    it("tells an import source apart from the same literal handed to a call", () => {
        expect(isModuleSpecifier(specifier ?? program)).toBe(true);
        expect(isModuleSpecifier(argument ?? program)).toBe(false);
    });

    it("exempts the declaration SSOT, generated files and the rule's own file, and nothing else", () => {
        expect(isSsotExemptFile(`${absolutePath("project.paths")}/paths.resolver.ts`)).toBe(true);
        expect(isSsotExemptFile(absolutePath("app.ontology"))).toBe(true);
        expect(isSsotExemptFile(`${absolutePath("govlabHost.rules")}/closure-paths-via-ssot.eslint.rule.ts`)).toBe(
            true,
        );
        expect(isSsotExemptFile(`${absolutePath("app.member")}/core/assets/link.assets.ts`)).toBe(false);
    });
});

describe("isStandaloneScript", () => {
    it("recognizes a file in the standalone server script folder and nothing else", () => {
        expect(isStandaloneScript(`${absolutePath("app.nginxScripts")}/catalog.entrypoint.ts`)).toBe(true);
        expect(isStandaloneScript(`${absolutePath("app.member")}/core/assets/link.assets.ts`)).toBe(false);
    });
});

describe("isMemberPathsSource", () => {
    const steps = `${absolutePath("app.coordination")}/tools/core/steps`;

    it("accepts a relative import of the paths config a self-governed member declares and nothing else", () => {
        expect(isMemberPathsSource(steps, "../../../config/surface.config.ts")).toBe(true);
        expect(isMemberPathsSource(steps, "../constants/binding.constants.ts")).toBe(false);
        expect(isMemberPathsSource(steps, "@ssot/paths")).toBe(false);
    });
});

describe("anchoredBySsot", () => {
    const program = programOf(`read(relativePath("k"), "tail/x"); read("y/z");`);
    const [, anchored, bare] = literalsIn(program);

    it("accepts a literal composed beside an SSOT call and refuses one with no anchor", () => {
        expect(anchoredBySsot(anchored ?? program, new Set(["relativePath"]))).toBe(true);
        expect(anchoredBySsot(bare ?? program, new Set(["relativePath"]))).toBe(false);
    });
});
