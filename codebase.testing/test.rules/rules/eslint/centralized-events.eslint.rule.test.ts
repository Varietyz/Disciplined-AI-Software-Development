import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import centralizedEvents from "@ssot/govlab/rules/eslint/centralized-events.eslint.rule.ts";
import { join } from "node:path";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "centralized-events": centralizedEvents } } },
    rules: { "local/centralized-events": "error" },
};

const MEMBER = "banes-lab.web";
const IDS = `${MEMBER}/core/ids`;
const LISTENERS = `${MEMBER}/core/listeners`;

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("centralized-events", () => {
    it("fires on an ids file outside every declared ids folder", () => {
        const msgs = lint(`export const X = "test";`, `${MEMBER}/runtime/entrypoints/base.ids.ts`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("misplacedEventIdsFile");
    });

    it("fires on an ids file sitting in a sibling concern folder", () => {
        const msgs = lint(`export const X = "test";`, `${MEMBER}/core/registries/base.ids.ts`);
        expect(msgs).toHaveLength(1);
    });

    it("does NOT fire on an ids file inside the declared ids folder", () => {
        const msgs = lint(`export const X = "test";`, join(IDS, "base.ids.ts"));
        expect(msgs).toHaveLength(0);
    });

    it("fires on a listener outside every declared listeners folder", () => {
        const msgs = lint(`export const X = "test";`, `${MEMBER}/runtime/entrypoints/base.listener.ts`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("misplacedListenerFile");
    });

    it("does NOT fire on a listener inside the declared listeners folder", () => {
        const msgs = lint(`export const X = "test";`, `${LISTENERS}/base.listener.ts`);
        expect(msgs).toHaveLength(0);
    });

    it("does NOT fire on a file carrying neither concern tag", () => {
        const msgs = lint(`export const X = "test";`, `${MEMBER}/domain/models/base.model.ts`);
        expect(msgs).toHaveLength(0);
    });

    it("handles windows path separators", () => {
        const msgs = lint(`export const X = "test";`, String.raw`banes-lab.web\core\ids\base.ids.ts`);
        expect(msgs).toHaveLength(0);
    });

    it("fires on a misplaced file with windows separators", () => {
        const msgs = lint(`export const X = "test";`, String.raw`banes-lab.web\core\caches\base.ids.ts`);
        expect(msgs).toHaveLength(1);
    });
});
