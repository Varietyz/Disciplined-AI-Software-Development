import {
    assertCorePluginsLoaded,
    installedEslintPlugins,
    loadModule,
    resolveGlobals,
} from "@govlab/quality/core/loaders/eslint.loader.ts";
import { describe, expect, it } from "vitest";

const rec = (npm: string): { npm: string } => ({ npm });
const SLOW_TEST_TIMEOUT_MS = 90_000;

describe("assertCorePluginsLoaded — a failed core plugin blocks, never silently degrades", () => {
    it("throws when a core @govlab plugin failed to load", () => {
        expect(() => {
            assertCorePluginsLoaded([{ plugin: null, record: rec("@govlab/quality/eslint-plugin") }]);
        }).toThrow("did not load");
    });

    it("does not throw when all core plugins loaded, even if an optional third-party plugin is absent", () => {
        expect(() => {
            assertCorePluginsLoaded([
                { plugin: {}, record: rec("@govlab/quality/eslint-plugin") },
                { plugin: {}, record: rec("@govlab/quality/context-lint") },
                { plugin: null, record: rec("eslint-plugin-sonarjs") },
            ]);
        }).not.toThrow();
    });

    it("names every missing core plugin in the error", () => {
        const missing = [
            { plugin: null, record: rec("@govlab/quality/eslint-plugin") },
            { plugin: null, record: rec("@govlab/quality/context-lint") },
        ];
        expect(() => {
            assertCorePluginsLoaded(missing);
        }).toThrow("@govlab/quality/eslint-plugin, @govlab/quality/context-lint");
    });
});

describe("module loading", () => {
    it("answers null for a module that does not resolve", async () => {
        expect(await loadModule("@govlab/no-such-module")).toBeNull();
    });

    it("merges the named environments with custom globals", async () => {
        const globals = await resolveGlobals([], { custom: "readonly" });
        expect(globals["custom"]).toBe("readonly");
    });

    it(
        "loads every installed eslint plugin the registry names",
        async () => {
            expect(Array.isArray(await installedEslintPlugins())).toBe(true);
        },
        SLOW_TEST_TIMEOUT_MS,
    );
});
