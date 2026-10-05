import { describe, expect, it } from "vitest";
import { emitEslintConfig, eslintRulesForConcepts } from "@govlab/quality/core/emitters/eslint.emitter.ts";

const hasPrefix = function hasPrefix(config: Record<string, unknown>, prefix: string): boolean {
    return Object.keys(config).some((key) => key.startsWith(prefix));
};

describe("emitEslintConfig activePlugins", () => {
    it("emits only core + govlab when activePlugins is absent", () => {
        const config = emitEslintConfig({});
        expect(hasPrefix(config, "sonarjs/")).toBe(false);
        expect(hasPrefix(config, "@typescript-eslint/")).toBe(false);
    });

    it("emits the same config for an empty activePlugins list as for an absent one", () => {
        expect(JSON.stringify(emitEslintConfig({ activePlugins: [] }))).toBe(JSON.stringify(emitEslintConfig({})));
    });

    it("widens to a plugin's rules under its ruleId prefix when its namespace is active", () => {
        const base = emitEslintConfig({});
        const config = emitEslintConfig({ activePlugins: ["sonarjs"] });
        const sonar = Object.keys(config).filter((key) => key.startsWith("sonarjs/"));
        expect(sonar.length).toBeGreaterThan(0);
        expect(Object.keys(config)).toHaveLength(Object.keys(base).length + sonar.length);
    });

    it("handles a scoped namespace plugin", () => {
        expect(hasPrefix(emitEslintConfig({ activePlugins: ["@typescript-eslint"] }), "@typescript-eslint/")).toBe(
            true,
        );
    });

    it("does not emit a plugin's rules unless its namespace is listed", () => {
        expect(hasPrefix(emitEslintConfig({ activePlugins: ["sonarjs"] }), "unicorn/")).toBe(false);
    });

    it("lets no-magic-numbers ignore -1, 0 and 1", () => {
        expect(emitEslintConfig({})["no-magic-numbers"]).toStrictEqual(["error", { ignore: [-1, 0, 1] }]);
        const typed = emitEslintConfig({ activePlugins: ["@typescript-eslint"] });
        expect(typed["@typescript-eslint/no-magic-numbers"]).toStrictEqual(["error", { ignore: [-1, 0, 1] }]);
    });
});

describe("eslintRulesForConcepts", () => {
    it("returns the distinct ESLint rule keys that carry a wanted concept", () => {
        const keys = eslintRulesForConcepts(["cyclomatic-complexity"]);
        expect(keys).toContain("complexity");
        expect(new Set(keys).size).toBe(keys.length);
    });
});
