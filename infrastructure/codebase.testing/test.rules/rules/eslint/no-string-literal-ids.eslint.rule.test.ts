import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import noStringLiteralIds from "@ssot/govlab/rules/eslint/no-string-literal-ids.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "no-string-literal-ids": noStringLiteralIds } } },
    rules: { "local/no-string-literal-ids": "error" },
};

const SRC_FILE = "src/page.ts";

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("no-string-literal-ids", () => {
    it("fires on getImagePath with string literal", () => {
        const msgs = lint(`getImagePath("image-error-404");`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalIdArg");
    });

    it("passes when getImagePath called with identifier", () => {
        const msgs = lint(`getImagePath(ASSET_IMAGE_404);`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("fires on registerAsset with literal id field", () => {
        const msgs = lint(`registerAsset({ id: "foo", kind: "image" });`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalIdProperty");
    });

    it("passes when registerAsset called with identifier id", () => {
        const msgs = lint(`registerAsset({ id: ASSET_FOO, kind: "image" });`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("fires on registerComponent with literal id", () => {
        const msgs = lint(`registerComponent({ id: "card", build: fn });`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalIdProperty");
    });

    it("fires on registerCapability with literal id", () => {
        const msgs = lint(`registerCapability({ id: "escape-to-close", apply: fn });`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalIdProperty");
    });

    it("does not fire inside *.ids.ts files", () => {
        const msgs = lint(`export const ID_X = "x";`, "src/ids/x.ids.ts");
        expect(msgs).toHaveLength(0);
    });

    it("does not fire inside a schema file", () => {
        const msgs = lint(`registerAsset({ id: "literal-id" });`, "src/schemas/base.schema.ts");
        expect(msgs).toHaveLength(0);
    });

    it("derives the lookup position from the verb, not from a list of known accessors", () => {
        expect(lint(`getWidgetTemplate("hero");`, SRC_FILE)).toHaveLength(1);
        expect(lint(`hasFeatureFlag("beta");`, SRC_FILE)).toHaveLength(1);
        expect(lint(`resolveThemeToken("accent");`, SRC_FILE)).toHaveLength(1);
        expect(lint(`disposeConnection("primary");`, SRC_FILE)).toHaveLength(1);
    });

    it("derives the registration position from the verb too", () => {
        expect(lint(`registerThemeToken({ id: "accent" });`, SRC_FILE)).toHaveLength(1);
        expect(lint(`unregisterThemeToken("accent");`, SRC_FILE)).toHaveLength(1);
    });

    it("does not fire on a name that merely starts with the verb's letters", () => {
        expect(lint(`getter("x");`, SRC_FILE)).toHaveLength(0);
        expect(lint(`hash("x");`, SRC_FILE)).toHaveLength(0);
        expect(lint(`loader("x");`, SRC_FILE)).toHaveLength(0);
    });

    it("allows template literals with expressions (computed lookups)", () => {
        const msgs = lint(`getImagePath(\`asset-\${kind}\`);`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("fires on plain template literal without expressions", () => {
        const msgs = lint("getImagePath(`asset-foo`);", SRC_FILE);
        expect(msgs).toHaveLength(1);
    });
});
