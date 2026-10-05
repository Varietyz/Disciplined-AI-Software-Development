import { describe, expect, it } from "vitest";
import { ROOT } from "@ssot/paths";
import { runEslint } from "@govlab/quality/core/adapters/eslint.adapter.ts";

const SLOW_TEST_TIMEOUT_MS = 90_000;

describe("runEslint", () => {
    it(
        "runs on no paths without findings",
        async () => {
            const result = await runEslint({
                ecosystem: "typescript",
                fix: false,
                languageId: "typescript",
                paths: [],
                root: ROOT,
            });
            expect(result.findings).toStrictEqual([]);
        },
        SLOW_TEST_TIMEOUT_MS,
    );
});
