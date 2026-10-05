import { describe, expect, it } from "vitest";
import { ROOT } from "@ssot/paths";
import { govlabEslintConfig } from "@govlab/quality/core/factories/eslint.setup.factory.ts";

const SLOW_TEST_TIMEOUT_MS = 90_000;

describe("govlabEslintConfig — the built gate carries every core plugin", () => {
    it(
        "builds a config containing both core govlab plugins",
        async () => {
            const config = await govlabEslintConfig(ROOT);
            const namespaces = new Set(config.flatMap((block) => Object.keys(block.plugins ?? {})));
            expect(namespaces.has("govlab")).toBe(true);
            expect(namespaces.has("govlab-context")).toBe(true);
        },
        SLOW_TEST_TIMEOUT_MS,
    );
});
