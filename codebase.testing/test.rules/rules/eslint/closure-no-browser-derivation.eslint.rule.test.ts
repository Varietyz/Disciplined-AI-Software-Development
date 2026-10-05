import { describe, expect, it, vi } from "vitest";
import type { ClosureGraph } from "@ssot/govlab/types/closure.types.ts";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import browserDerivation from "@ssot/govlab/rules/eslint/closure-no-browser-derivation.eslint.rule.ts";
import { join } from "node:path";

const NAMED_ENTRY = "runtime/entrypoints/named.entrypoint.ts";
const SIDE_ENTRY = "runtime/entrypoints/side.entrypoint.ts";
const UNREACHED = "presentation/widgets/unreached.widget.ts";

const { converter, matcher, stubGraph } = await vi.hoisted(async () => {
    const { DERIVATION_MODULES } = await import("@ssot/govlab/shared/manifests/layer.manifest.ts");
    const declared = (name: string): string => [...DERIVATION_MODULES].find((path) => path.endsWith(name)) ?? name;
    const matcherPath = declared("vocabulary.matcher.ts");
    const converterPath = declared("definition.converter.ts");
    const graph: ClosureGraph = {
        consumers: [],
        emits: [],
        eventActivity: [],
        exports: [{ file: "runtime/entrypoints/side.entrypoint.ts", name: "probe" }],
        externalConsumers: [],
        iconsExports: [],
        idsExports: [],
        imports: [
            { file: "runtime/entrypoints/named.entrypoint.ts", from: `../../${matcherPath}`, names: ["matchPhrases"] },
            { file: "runtime/entrypoints/named.entrypoint.ts", from: `../../${converterPath}`, names: ["probe"] },
            { file: converterPath, from: `../../${matcherPath}`, names: ["matchPhrases"] },
            { file: "presentation/widgets/unreached.widget.ts", from: `../../${matcherPath}`, names: ["matchPhrases"] },
        ],
        interfaces: [],
        registers: [],
        sideEffectImports: [{ file: "runtime/entrypoints/side.entrypoint.ts", from: `../../${matcherPath}` }],
        stringsExports: [],
        subscribes: [],
        version: 1,
    };
    return { converter: converterPath, matcher: matcherPath, stubGraph: graph };
});

vi.mock("@ssot/govlab/shared/loaders/graph.loader.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    loadClosureGraph: () => stubGraph,
}));

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "closure-no-browser-derivation": browserDerivation } } },
    rules: { "local/closure-no-browser-derivation": "error" },
};

const lint = function lint(member: string): Linter.LintMessage[] {
    return linter.verify("export const probe = 1;\n", config, { filename: join(absolutePath("app.member"), member) });
};

describe("closure-no-browser-derivation", () => {
    it("reports a browser file that names an import from a declared derivation module", () => {
        const messages = lint(NAMED_ENTRY);
        expect(messages.map((message) => message.messageId)).toStrictEqual(["browserDerivation", "browserDerivation"]);
        expect(messages[0]?.message).toContain(matcher);
    });

    it("reports a browser file that imports a declared derivation module for its side effects", () => {
        const messages = lint(SIDE_ENTRY);
        expect(messages.map((message) => message.messageId)).toStrictEqual(["browserDerivation"]);
        expect(messages[0]?.message).toContain(matcher);
    });

    it("passes a file the browser bundle does not reach", () => {
        expect(lint(UNREACHED)).toStrictEqual([]);
    });

    it("passes a declared derivation module that imports another, so the finding lands at the boundary", () => {
        expect(lint(converter)).toStrictEqual([]);
    });
});
