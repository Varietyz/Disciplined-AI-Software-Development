import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { VALIDATING_CLASSES } from "@ssot/govlab/shared/manifests/invariant.manifest.ts";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/validated-construction.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: 2025 as const,
            parser: await import("@typescript-eslint/parser"),
            sourceType: "module" as const,
        },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const SRC = `${absolutePath("govlab.patterns").split(sep).join("/")}/core/factories/probe.factory.ts`;

const idsFor = function idsFor(code: string): string[] {
    return linter
        .verify(code, config, SRC)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

const [entry] = [...VALIDATING_CLASSES];
const [className, method] = entry ?? ["", ""];

describe("validated-construction", () => {
    it("reports a registered class constructed and used without its validation call", () => {
        expect(idsFor(`const graph = new ${className}(nodes); use(graph);`)).toStrictEqual(["unvalidated"]);
    });

    it("accepts the validation chained on the construction", () => {
        expect(idsFor(`new ${className}(nodes).${method}();`)).toStrictEqual([]);
    });

    it("accepts the validation called on the binding the instance is assigned to", () => {
        expect(idsFor(`const graph = new ${className}(nodes); graph.${method}();`)).toStrictEqual([]);
    });

    it("ignores a class the registry does not classify", () => {
        expect(idsFor("const other = new Unregistered(nodes);")).toStrictEqual([]);
    });
});
