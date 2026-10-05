import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths";
import { govlabStylelintConfig } from "@govlab/quality/core/adapters/stylelint.adapter.ts";

const SLOW_TEST_TIMEOUT_MS = 90_000;

test(
    "govlabStylelintConfig carries the govlab plugins and the emitted rules",
    async () => {
        const config = await govlabStylelintConfig(ROOT);
        expect(Array.isArray(config["plugins"])).toBe(true);
        expect(typeof config["rules"]).toBe("object");
    },
    SLOW_TEST_TIMEOUT_MS,
);
