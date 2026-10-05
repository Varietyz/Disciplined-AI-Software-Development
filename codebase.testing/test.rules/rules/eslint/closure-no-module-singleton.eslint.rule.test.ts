import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-no-module-singleton.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const MEMBER = absolutePath("app.member").split(sep).join("/");
const SRC = `${MEMBER}/core/registries/probe.registry.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-no-module-singleton", () => {
    it("reports an exported module-scope construction", () => {
        expect(idsFor("export const bus = new EventBus();")).toStrictEqual(["moduleSingleton"]);
    });

    it("accepts the same construction when it is not exported", () => {
        expect(idsFor("const bus = new EventBus();")).toStrictEqual([]);
    });

    it("accepts an exported built-in container", () => {
        expect(idsFor("export const index = new Map();")).toStrictEqual([]);
        expect(idsFor("export const seen = new WeakSet();")).toStrictEqual([]);
    });

    it("accepts an exported factory function", () => {
        expect(idsFor("export const makeBus = () => new EventBus();")).toStrictEqual([]);
    });

    it("does not fire inside the foundation folder", () => {
        expect(idsFor("export const bus = new EventBus();", `${MEMBER}/core/base/probe.bus.ts`)).toStrictEqual([]);
    });
});
