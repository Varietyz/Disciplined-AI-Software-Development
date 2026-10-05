import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/no-linear-scan-lookup.eslint.rule.ts";
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
const PLATFORM = `${MEMBER}/core/registries/probe.registry.ts`;
const PRODUCT = `${MEMBER}/domain/models/probe.model.ts`;

const wrap = function wrap(body: string): string {
    return `const find = function find(index, wanted) { ${body} return null; };`;
};

const SCAN = wrap("for (const entry of index.values()) { if (entry.id === wanted) { return entry; } }");

const idsFor = function idsFor(code: string, file = PLATFORM): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-linear-scan-lookup", () => {
    it("reports a values() scan with an early return in the platform tier", () => {
        expect(idsFor(SCAN)).toStrictEqual(["scan"]);
    });

    it("accepts a scan that aggregates rather than looks up", () => {
        expect(idsFor(wrap("for (const entry of index.values()) { total += entry.size; }"))).toStrictEqual([]);
    });

    it("accepts iteration over something that is not a values() call", () => {
        const code = wrap("for (const entry of index) { if (entry.id === wanted) { return entry; } }");
        expect(idsFor(code)).toStrictEqual([]);
    });

    it("does not fire outside the platform tier", () => {
        expect(idsFor(SCAN, PRODUCT)).toStrictEqual([]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor(SCAN, `${MEMBER}/core/registries/probe.registry.test.ts`)).toStrictEqual([]);
    });
});
